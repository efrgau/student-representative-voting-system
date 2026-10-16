import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { students, elections } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const docOrCode = searchParams.get("query") || "";

    if (!docOrCode.trim()) {
      return NextResponse.json({ success: false, error: "Consulta vacía" }, { status: 400 });
    }

    const clean = docOrCode.trim();

    const [student] = await db
      .select()
      .from(students)
      .where(or(eq(students.documentId, clean), eq(students.verificationCode, clean)));

    if (!student || !student.hasVoted) {
      return NextResponse.json(
        { success: false, error: "No se encontró comprobante de voto válido para los datos ingresados." },
        { status: 404 }
      );
    }

    const [election] = await db.select().from(elections).limit(1);

    return NextResponse.json({
      success: true,
      certificate: {
        documentId: student.documentId,
        fullName: student.fullName,
        grade: student.grade,
        groupName: student.groupName,
        votedAt: student.votedAt,
        verificationCode: student.verificationCode,
        institutionName: election?.institutionName || "Institución Prueba",
        year: election?.year || 2026,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
