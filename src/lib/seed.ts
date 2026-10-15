import { getDb } from "@/db";
import { elections, positions, candidates, students } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function ensureInitialData() {
  const db = await getDb();
  try {
    const existingElections = await db.select().from(elections);
    if (existingElections.length > 0) {
      return { status: "already_seeded" };
    }

    // 1. Create main election
    const [insertedElection] = await db
      .insert(elections)
      .values({
        title: "SISTEMA DE VOTACIONES ESTUDIANTILES 2026",
        institutionName: "Colegio Nuestra Señora de las Lajas - Pasto",
        year: 2026,
        status: "active",
      })
      .returning();

    // 2. Create positions
    const [personeroPos] = await db
      .insert(positions)
      .values({
        electionId: insertedElection.id,
        name: "PERSONERO ESTUDIANTIL 2026",
        description: "Representante legal de los derechos y deberes estudiantiles en el Gobierno Escolar.",
        displayOrder: 1,
      })
      .returning();

    const [contralorPos] = await db
      .insert(positions)
      .values({
        electionId: insertedElection.id,
        name: "CONTRALOR ESTUDIANTIL 2026",
        description: "Encargado de promover la transparencia y la fiscalización del uso de bienes y recursos escolares.",
        displayOrder: 2,
      })
      .returning();

    // 3. Create Candidates for Personero
    await db.insert(candidates).values([
      {
        positionId: personeroPos.id,
        number: "01",
        name: "Jhon Franco Cerón Gómez",
        photoUrl: "https://images.pexels.com/photos/13538613/pexels-photo-13538613.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500",
        slogan: "Innovación, tecnología y deporte para todos",
        proposals: JSON.stringify([
          "Actualización y mantenimiento del laboratorio de tecnología y red Wi-Fi escolar.",
          "Organización de torneos interclases semanales y festivales deportivos.",
          "Canal virtual de atención rápida para sugerencias y reclamos estudiantiles.",
        ]),
        isBlank: false,
        displayOrder: 1,
      },
      {
        positionId: personeroPos.id,
        number: "02",
        name: "Mateo Nicolás Hernández Caicedo",
        photoUrl: "https://images.pexels.com/photos/8617732/pexels-photo-8617732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500",
        slogan: "Liderazgo activo, inclusión y diálogo permanente",
        proposals: JSON.stringify([
          "Feria de orientación vocacional y preparatorios ICFES Saber 11.",
          "Zonas de descanso ecológicas con puntos de reciclaje y carga solar.",
          "Vocería directa y activa en cada reunión del Consejo Directivo.",
        ]),
        isBlank: false,
        displayOrder: 2,
      },
      {
        positionId: personeroPos.id,
        number: "03",
        name: "Juan Sebastián Buitrago Osorno",
        photoUrl: "https://images.pexels.com/photos/6256322/pexels-photo-6256322.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500",
        slogan: "Cultura, salud mental y bienestar integral",
        proposals: JSON.stringify([
          "Jornadas de salud mental, manejo del estrés e inteligencia emocional.",
          "Festival anual de arte, música y talentos ladeños.",
          "Mejoramiento de menú y atención en la cafetería escolar.",
        ]),
        isBlank: false,
        displayOrder: 3,
      },
      {
        positionId: personeroPos.id,
        number: "04",
        name: "VOTO EN BLANCO",
        photoUrl: "",
        slogan: "Opción de libre elección democrática",
        proposals: JSON.stringify(["Manifiesta desacuerdo o reserva frente a las candidaturas presentadas."]),
        isBlank: true,
        displayOrder: 4,
      },
    ]);

    // 4. Create Candidates for Contralor
    await db.insert(candidates).values([
      {
        positionId: contralorPos.id,
        number: "01",
        name: "Valeria Sofía Morales Ruíz",
        photoUrl: "https://images.pexels.com/photos/6256116/pexels-photo-6256116.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500",
        slogan: "Transparencia absoluta y control ciudadano escolar",
        proposals: JSON.stringify([
          "Veeduría permanente a la ejecución del presupuesto de recursos propios.",
          "Informes trimestrales visuales del estado del mobiliario de los salones.",
          "Buzón de denuncias sobre cuidado y mantenimiento de baños e instalaciones.",
        ]),
        isBlank: false,
        displayOrder: 1,
      },
      {
        positionId: contralorPos.id,
        number: "02",
        name: "Santiago Esteban López Díaz",
        photoUrl: "https://images.pexels.com/photos/5211450/pexels-photo-5211450.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=500",
        slogan: "Cuentas claras y compromiso con nuestra infraestructura",
        proposals: JSON.stringify([
          "Comité estudiantil de inventarios de laboratorios y salas de informática.",
          "Control y seguimiento a la distribución de insumos deportivos.",
          "Auditoría participativa con delegados de cada grado.",
        ]),
        isBlank: false,
        displayOrder: 2,
      },
      {
        positionId: contralorPos.id,
        number: "03",
        name: "VOTO EN BLANCO",
        photoUrl: "",
        slogan: "Opción de libre elección democrática",
        proposals: JSON.stringify(["Manifiesta desacuerdo o reserva frente a las candidaturas presentadas."]),
        isBlank: true,
        displayOrder: 3,
      },
    ]);

    // 5. Create Sample Students Census (Padrón electoral)
    await db.insert(students).values([
      { documentId: "1085234543", fullName: "EDWIN PACHECO FIGUEROA", grade: "11", groupName: "11-1" },
      { documentId: "1085299102", fullName: "MARÍA ALEJANDRA BENAVIDES", grade: "11", groupName: "11-1" },
      { documentId: "1085312489", fullName: "CARLOS ANDRÉS VILLOTA", grade: "11", groupName: "11-1" },
      { documentId: "1085421990", fullName: "DANIELA FERNANDA GUERRERO", grade: "11", groupName: "11-2" },
      { documentId: "1085554312", fullName: "FELIPE ALEXANDER MUÑOZ", grade: "11", groupName: "11-2" },
      { documentId: "1085600123", fullName: "ANGIE KATHERINE ROSERO", grade: "11", groupName: "11-2" },
      { documentId: "1085789456", fullName: "CAMILO ERNESTO SANTACRUZ", grade: "11", groupName: "11-3" },
      { documentId: "1085811223", fullName: "PAULA ANDREA SOLARTE", grade: "11", groupName: "11-3" },
      { documentId: "1085998877", fullName: "KEVIN DAVID BASTIDAS", grade: "11", groupName: "11-3" },
      { documentId: "1085112233", fullName: "VALENTINA ESCOBAR CHAVES", grade: "10", groupName: "10-1" },
      { documentId: "1085445566", fullName: "JUAN MANUEL QUINTERO", grade: "10", groupName: "10-2" },
    ]);

    return { status: "seeded" };
  } catch (error) {
    console.error("Error in ensureInitialData:", error);
    throw error;
  }
}
