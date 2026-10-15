import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { candidates, auditLogs } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getDb();
    const list = await db.select().from(candidates).orderBy(asc(candidates.displayOrder));
    return NextResponse.json({ success: true, candidates: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { positionId, number, name, photoUrl, slogan, proposals, isBlank } = (await req.json()) as any;

    if (!positionId || !name || !number) {
      return NextResponse.json({ success: false, error: "Posición, número y nombre son obligatorios." }, { status: 400 });
    }

    const proposalsJson = Array.isArray(proposals)
      ? JSON.stringify(proposals)
      : typeof proposals === "string"
      ? JSON.stringify(proposals.split("\n").filter((p) => p.trim()))
      : "[]";

    const [newCand] = await db
      .insert(candidates)
      .values({
        positionId: parseInt(positionId, 10),
        number: number.trim(),
        name: name.trim(),
        photoUrl: photoUrl?.trim() || "",
        slogan: slogan?.trim() || "",
        proposals: proposalsJson,
        isBlank: !!isBlank,
      })
      .returning();

    await db.insert(auditLogs).values({
      action: "CANDIDATE_CREATED",
      details: `Candidato agregado: ${newCand.name} (${newCand.number})`,
    });

    return NextResponse.json({ success: true, candidate: newCand });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
