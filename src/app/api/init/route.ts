import { NextResponse } from "next/server";
import { ensureInitialData } from "@/lib/seed";
import { getDb } from "@/db";
import { elections, positions, candidates, students, votes, auditLogs } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const db = await getDb();
    const result = await ensureInitialData();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const body = (await req.json().catch(() => ({}))) as any;
    if (body.action === "reset_votes") {
      await db.delete(votes);
      await db.update(students).set({ hasVoted: false, votedAt: null, verificationCode: null });
      await db.insert(auditLogs).values({
        action: "RESET_VOTES",
        details: "Todos los votos fueron reiniciados por el administrador.",
      });
      return NextResponse.json({ success: true, message: "Votos reiniciados exitosamente" });
    }

    if (body.action === "seed_all") {
      // Clear all tables and re-seed
      await db.delete(votes);
      await db.delete(candidates);
      await db.delete(positions);
      await db.delete(students);
      await db.delete(elections);
      await db.delete(auditLogs);
      await ensureInitialData();
      return NextResponse.json({ success: true, message: "Base de datos restaurada al estado inicial" });
    }

    const result = await ensureInitialData();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
