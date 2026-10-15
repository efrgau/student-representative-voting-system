import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export type Db = ReturnType<typeof getD1Db>;

function getD1Db(binding: D1Database) {
  return drizzle(binding, { schema });
}

// La DB vive en el binding D1 `DB` (Cloudflare).
// En `next dev` se resuelve contra el D1 local vía initOpenNextCloudflareForDev()
// (ver next.config.ts); en Workers/preview, contra el D1 real.
export async function getDb(): Promise<Db> {
  const { env } = await getCloudflareContext({ async: true });
  const d1 = (env as { DB?: D1Database }).DB;
  if (!d1) {
    throw new Error(
      "D1 binding `DB` no disponible. Revisa d1_databases en wrangler.jsonc."
    );
  }
  return getD1Db(d1);
}
