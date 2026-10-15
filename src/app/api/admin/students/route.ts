import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { students, auditLogs } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const group = searchParams.get("group") || "";
    const status = searchParams.get("status") || "";

    let allStudents = await db.select().from(students).orderBy(asc(students.fullName));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      allStudents = allStudents.filter(
        (s) => s.fullName.toLowerCase().includes(q) || s.documentId.toLowerCase().includes(q)
      );
    }

    if (group.trim()) {
      allStudents = allStudents.filter((s) => s.groupName === group);
    }

    if (status === "voted") {
      allStudents = allStudents.filter((s) => s.hasVoted);
    } else if (status === "pending") {
      allStudents = allStudents.filter((s) => !s.hasVoted);
    }

    return NextResponse.json({ success: true, students: allStudents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { documentId, fullName, grade, groupName } = (await req.json()) as any;

    if (!documentId || !fullName) {
      return NextResponse.json({ success: false, error: "Documento y nombre completo son obligatorios." }, { status: 400 });
    }

    const cleanDoc = documentId.trim();

    // Check duplicate
    const [existing] = await db.select().from(students).where(eq(students.documentId, cleanDoc));

    if (existing) {
      return NextResponse.json({ success: false, error: "El número de documento ya está registrado." }, { status: 400 });
    }

    const [newStudent] = await db
      .insert(students)
      .values({
        documentId: cleanDoc,
        fullName: fullName.trim(),
        grade: grade || "11",
        groupName: groupName || "11-1",
        hasVoted: false,
      })
      .returning();

    await db.insert(auditLogs).values({
      action: "STUDENT_CREATED",
      details: `Estudiante registrado: ${newStudent.fullName} (ID: ${newStudent.documentId})`,
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
