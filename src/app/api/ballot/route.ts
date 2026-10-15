import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { elections, positions, candidates } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ensureInitialData } from "@/lib/seed";

export async function GET() {
  try {
    const db = await getDb();
    await ensureInitialData();

    const [election] = await db.select().from(elections).limit(1);
    if (!election) {
      return NextResponse.json({ success: false, error: "No hay elecciones configuradas." }, { status: 404 });
    }

    const positionList = await db
      .select()
      .from(positions)
      .where(eq(positions.electionId, election.id))
      .orderBy(asc(positions.displayOrder));

    const candidateList = await db.select().from(candidates).orderBy(asc(candidates.displayOrder));

    const ballotData = positionList.map((pos) => {
      const posCandidates = candidateList.filter((c) => c.positionId === pos.id);
      return {
        id: pos.id,
        name: pos.name,
        description: pos.description,
        candidates: posCandidates.map((c) => ({
          id: c.id,
          number: c.number,
          name: c.name,
          photoUrl: c.photoUrl,
          slogan: c.slogan,
          proposals: c.proposals ? JSON.parse(c.proposals) : [],
          isBlank: c.isBlank,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      election,
      positions: ballotData,
    });
  } catch (error: any) {
    console.error("Error fetching ballot:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
