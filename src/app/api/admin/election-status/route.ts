import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { elections, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { status, title, institutionName } = (await req.json()) as any;

    const [election] = await db.select().from(elections).limit(1);

    if (!election) {
      return NextResponse.json({ success: false, error: "Elección no encontrada." }, { status: 404 });
    }

    const newStatus = status || election.status;
    const newTitle = title || election.title;
    const newInst = institutionName || election.institutionName;

    const [updated] = await db
      .update(elections)
      .set({
        status: newStatus,
        title: newTitle,
        institutionName: newInst,
      })
      .where(eq(elections.id, election.id))
      .returning();

    await db.insert(auditLogs).values({
      action: "ELECTION_STATUS_CHANGED",
      details: `Estado de votación cambiado a: ${newStatus.toUpperCase()}`,
    });

    return NextResponse.json({ success: true, election: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
