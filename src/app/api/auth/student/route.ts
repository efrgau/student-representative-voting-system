import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { students, elections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureInitialData } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    const db = await getDb();
    await ensureInitialData();
    const { documentId } = (await req.json()) as any;

    if (!documentId || typeof documentId !== "string" || !documentId.trim()) {
      return NextResponse.json(
        { success: false, error: "Por favor ingrese su número de documento o tarjeta de identidad." },
        { status: 400 }
      );
    }

    const cleanDoc = documentId.trim();

    // Check election status
    const activeElections = await db.select().from(elections).limit(1);
    const election = activeElections[0];

    if (!election) {
      return NextResponse.json({ success: false, error: "No se encontró ninguna elección activa." }, { status: 404 });
    }

    // Check student in database
    const [student] = await db.select().from(students).where(eq(students.documentId, cleanDoc));

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: `El número de identificación ${cleanDoc} no se encuentra registrado en el censo electoral.`,
        },
        { status: 404 }
      );
    }

    if (election.status === "paused") {
      return NextResponse.json(
        {
          success: false,
          error: "Las votaciones se encuentran temporalmente pausadas por el jurado/administrador.",
        },
        { status: 403 }
      );
    }

    if (election.status === "closed" && !student.hasVoted) {
      return NextResponse.json(
        {
          success: false,
          error: "La jornada electoral ha finalizado oficialmente.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      election,
      student: {
        id: student.id,
        documentId: student.documentId,
        fullName: student.fullName,
        grade: student.grade,
        groupName: student.groupName,
        hasVoted: student.hasVoted,
        votedAt: student.votedAt,
        verificationCode: student.verificationCode,
      },
    });
  } catch (error: any) {
    console.error("Error in auth student route:", error);
    return NextResponse.json({ success: false, error: error.message || "Error al autenticar" }, { status: 500 });
  }
}
