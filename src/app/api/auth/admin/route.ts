import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Lee credenciales del entorno Cloudflare (secretos del dashboard o
// `wrangler secret`), con fallback a process.env para desarrollo local.
async function getAdminCreds() {
  let user = process.env.ADMIN_USER;
  let pass = process.env.ADMIN_PASS;
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cfEnv = env as Record<string, string | undefined>;
    user = cfEnv.ADMIN_USER ?? user;
    pass = cfEnv.ADMIN_PASS ?? pass;
  } catch {
    // Sin contexto Cloudflare (dev local sin bindings): usa process.env.
  }
  return {
    user: user || "admin@colegio.edu.co",
    pass: pass || "admin123",
  };
}

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as any;

    const { user: validUsername, pass: validPassword } = await getAdminCreds();

    if (
      (username.trim().toLowerCase() === validUsername.toLowerCase() || username.trim() === "admin") &&
      password === validPassword
    ) {
      return NextResponse.json({
        success: true,
        user: {
          role: "admin",
          name: "Administrador de Votaciones",
          email: validUsername,
        },
      });
    } else {
      return NextResponse.json({ success: false, error: "Credenciales de administrador incorrectas." }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
