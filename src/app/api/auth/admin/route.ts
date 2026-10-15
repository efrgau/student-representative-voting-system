import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = (await req.json()) as any;

    const validUsername = process.env.ADMIN_USER || "admin@colegio.edu.co";
    const validPassword = process.env.ADMIN_PASS || "admin123";

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
