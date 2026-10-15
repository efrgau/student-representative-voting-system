import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { candidates, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDb();
    const { id } = await context.params;
    const candId = parseInt(id, 10);
    const { number, name, photoUrl, slogan, proposals, isBlank } = (await req.json()) as any;

    if (isNaN(candId)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
    }

    const proposalsJson = Array.isArray(proposals)
      ? JSON.stringify(proposals)
      : typeof proposals === "string"
      ? JSON.stringify(proposals.split("\n").filter((p) => p.trim()))
      : "[]";

    const [updated] = await db
      .update(candidates)
      .set({
        number: number?.trim(),
        name: name?.trim(),
        photoUrl: photoUrl?.trim(),
        slogan: slogan?.trim(),
        proposals: proposalsJson,
        isBlank: isBlank !== undefined ? !!isBlank : false,
      })
      .where(eq(candidates.id, candId))
      .returning();

    await db.insert(auditLogs).values({
      action: "CANDIDATE_UPDATED",
      details: `Candidato actualizado: ${updated.name}`,
    });

    return NextResponse.json({ success: true, candidate: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const db = await getDb();
    const { id } = await context.params;
    const candId = parseInt(id, 10);

    if (isNaN(candId)) {
      return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
    }

    await db.delete(candidates).where(eq(candidates.id, candId));

    await db.insert(auditLogs).values({
      action: "CANDIDATE_DELETED",
      details: `Candidato ID ${candId} fue eliminado.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
