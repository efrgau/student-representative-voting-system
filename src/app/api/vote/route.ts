import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { students, votes, elections, auditLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { studentId, documentId, votesMap } = (await req.json()) as any;

    if (!studentId || !documentId || !votesMap || typeof votesMap !== "object") {
      return NextResponse.json({ success: false, error: "Datos de voto incompletos." }, { status: 400 });
    }

    // Verify student
    const [student] = await db
      .select()
      .from(students)
      .where(and(eq(students.id, studentId), eq(students.documentId, documentId.trim())));

    if (!student) {
      return NextResponse.json({ success: false, error: "Estudiante no encontrado o no válido." }, { status: 404 });
    }

    if (student.hasVoted) {
      return NextResponse.json(
        {
          success: false,
          error: "Este documento ya registró su voto previamente.",
          verificationCode: student.verificationCode,
        },
        { status: 400 }
      );
    }

    const [election] = await db.select().from(elections).limit(1);
    if (!election || election.status !== "active") {
      return NextResponse.json(
        { success: false, error: "La jornada de votación no se encuentra activa en este momento." },
        { status: 403 }
      );
    }

    const verificationCode = `VOTO-${election.year}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const votedAt = new Date();

    // Record votes
    const voteEntries = Object.entries(votesMap).map(([posId, candId]) => ({
      electionId: election.id,
      positionId: parseInt(posId, 10),
      candidateId: parseInt(candId as string, 10),
      studentId: student.id,
      castAt: votedAt,
      voteToken: crypto.randomBytes(8).toString("hex"),
    }));

    await db.insert(votes).values(voteEntries);

    // Update student status
    await db
      .update(students)
      .set({
        hasVoted: true,
        votedAt,
        verificationCode,
      })
      .where(eq(students.id, student.id));

    // Audit log
    await db.insert(auditLogs).values({
      action: "VOTE_CAST",
      details: `Voto registrado exitosamente para estudiante ID: ${student.documentId} (${student.fullName}) - Código: ${verificationCode}`,
    });

    return NextResponse.json({
      success: true,
      verificationCode,
      votedAt: votedAt.toISOString(),
      studentName: student.fullName,
    });
  } catch (error: any) {
    console.error("Error submitting vote:", error);
    return NextResponse.json({ success: false, error: error.message || "Error al registrar el voto" }, { status: 500 });
  }
}
