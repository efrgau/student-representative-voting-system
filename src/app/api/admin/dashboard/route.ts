import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { elections, positions, candidates, students, votes, auditLogs } from "@/db/schema";
import { eq, count, desc, asc } from "drizzle-orm";
import { ensureInitialData } from "@/lib/seed";

export async function GET() {
  try {
    const db = await getDb();
    await ensureInitialData();

    const [election] = await db.select().from(elections).limit(1);
    if (!election) {
      return NextResponse.json({ success: false, error: "No hay elección." }, { status: 404 });
    }

    const allStudents = await db.select().from(students);
    const totalStudents = allStudents.length;
    const votedStudents = allStudents.filter((s) => s.hasVoted).length;
    const pendingStudents = totalStudents - votedStudents;
    const participationPercentage = totalStudents > 0 ? ((votedStudents / totalStudents) * 100).toFixed(1) : "0";

    // Breakdown by group
    const groupStatsMap: Record<string, { total: number; voted: number }> = {};
    allStudents.forEach((s) => {
      const g = s.groupName || "Sin Grupo";
      if (!groupStatsMap[g]) {
        groupStatsMap[g] = { total: 0, voted: 0 };
      }
      groupStatsMap[g].total += 1;
      if (s.hasVoted) {
        groupStatsMap[g].voted += 1;
      }
    });

    const groupStats = Object.entries(groupStatsMap).map(([group, data]) => ({
      group,
      total: data.total,
      voted: data.voted,
      percentage: data.total > 0 ? Math.round((data.voted / data.total) * 100) : 0,
    }));

    // Positions and Candidate Results
    const positionList = await db
      .select()
      .from(positions)
      .where(eq(positions.electionId, election.id))
      .orderBy(asc(positions.displayOrder));

    const candidateList = await db.select().from(candidates).orderBy(asc(candidates.displayOrder));
    const allVotes = await db.select().from(votes);

    const positionResults = positionList.map((pos) => {
      const posCandidates = candidateList.filter((c) => c.positionId === pos.id);
      const posVotes = allVotes.filter((v) => v.positionId === pos.id);
      const totalPosVotes = posVotes.length;

      const candidateResults = posCandidates.map((cand) => {
        const votesCount = posVotes.filter((v) => v.candidateId === cand.id).length;
        const percentage = totalPosVotes > 0 ? ((votesCount / totalPosVotes) * 100).toFixed(1) : "0";
        return {
          id: cand.id,
          number: cand.number,
          name: cand.name,
          photoUrl: cand.photoUrl,
          isBlank: cand.isBlank,
          slogan: cand.slogan,
          votesCount,
          percentage: parseFloat(percentage),
        };
      });

      // Sort candidate results by votes descending
      candidateResults.sort((a, b) => b.votesCount - a.votesCount);

      const winningCandidate = candidateResults.length > 0 ? candidateResults[0] : null;

      return {
        id: pos.id,
        name: pos.name,
        totalVotes: totalPosVotes,
        candidates: candidateResults,
        winner: winningCandidate,
      };
    });

    const recentLogs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      election,
      stats: {
        totalStudents,
        votedStudents,
        pendingStudents,
        participationPercentage: parseFloat(participationPercentage),
      },
      groupStats,
      positionResults,
      recentLogs,
    });
  } catch (error: any) {
    console.error("Error loading admin dashboard:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
