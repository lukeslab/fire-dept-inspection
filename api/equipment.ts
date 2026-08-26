import { neon } from "@neondatabase/serverless";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const sql = neon(databaseUrl);

type CompartmentGroupKey = (typeof COMPARTMENT_GROUPS)[number]['key']
type CompartmentInput = {
  id?: string;
  name: string;
  position: number;
  group_key: CompartmentGroupKey;
};

type CreateEquipmentBody = {
    compartment_id: string,
    name: string,
    function: boolean,
    quantity: number,
}


export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    switch (request.method) {
      case "GET":
        if (request.query.id)  return await getEquipmentByRigID(request, response)
        else return

      case "POST":
        return await createEquipment(request, response)

      case "PATCH":
        return

      case "DELETE":
        return

      default:
        response.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);

        return response.status(405).json({
          error: `Method ${request.method} is not allowed.`,
        });
    }
  } catch (error) {
    console.error("Equipment API error:", error);

    return response.status(500).json({
      error: "An unexpected server error occurred.",
    });
  }

  async function getEquipmentByRigID(request: VercelRequest, response:VercelResponse) {
    const rigId = request.query.id

    if (!rigId) {
        return response.status(400).json({error: "Rig ID is missing or invalid."})
    }

    const [ data ] = await sql`
    
    `

    return response.status(200).json({message: "success", data})
  }

  async function createEquipment(request: VercelRequest, response: VercelResponse) {

  }
}