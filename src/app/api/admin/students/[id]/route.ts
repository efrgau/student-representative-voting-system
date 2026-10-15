import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { students, votes, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDb();
    const { id } = await context.params;
    const studentId = parseInt(id, 10);
    const body = (await req.json()) as any;

    if (isNaN(studentId)) {
      return NextResponse.json({ success: false, error: "ID de estudiante no válido" }, { status: 400 });
    }

    if (body.action === "reset_vote") {
      // Delete votes cast by student and reset status
      await db.delete(votes).where(eq(votes.studentId, studentId));
      await db
        .update(students)
        .set({
          hasVoted: false,
          votedAt: null,
          verificationCode: null,
        })
        .where(eq(students.id, studentId));

      await db.insert(auditLogs).values({
        action: "VOTE_RESET",
        details: `Voto del estudiante ID ${studentId} fue habilitado de nuevo por el administrador.`,
      });

      return NextResponse.json({ success: true, message: "Voto del estudiante reseteado correctamente" });
    }

    // Standard edit
    const { documentId, fullName, grade, groupName } = body;
    const [updated] = await db
      .update(students)
      .set({
        documentId: documentId?.trim(),
        fullName: fullName?.trim(),
        grade,
        groupName,
      })
      .where(eq(students.id, studentId))
      .returning();

    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDb();
    const { id } = await context.params;
    const studentId = parseInt(id, 10);

    if (isNaN(studentId)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
    }

    await db.delete(votes).where(eq(votes.studentId, studentId));
    await db.delete(students).where(eq(students.id, studentId));

    await db.insert(auditLogs).values({
      action: "STUDENT_DELETED",
      details: `Estudiante ID ${studentId} fue eliminado del censo.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
