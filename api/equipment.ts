import { neon } from "@neondatabase/serverless"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { COMPARTMENT_GROUPS } from "../src/lib/db/compartmentGroups.ts"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not configured.")
}

const sql = neon(databaseUrl)

type CompartmentGroupKey = (typeof COMPARTMENT_GROUPS)[number]["key"]
type CompartmentInput = {
	id?: string
	name: string
	position: number
	group_key: CompartmentGroupKey
}

type CreateEquipmentBody = {
	compartment_id: string
	name: string
	function: boolean
	quantity: number
}

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	try {
		console.log(request.query)
		switch (request.method) {
			case "GET":
				if (request.query.rigId)
					return await getEquipmentByRigID(request, response)
				else return

			case "POST":
				return await createEquipment(request, response)

			case "PATCH":
				return

			case "DELETE":
				return

			default:
				response.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"])

				return response.status(405).json({
					error: `Method ${request.method} is not allowed.`,
				})
		}
	} catch (error) {
		console.error("Equipment API error:", error)

		return response.status(500).json({
			error: "An unexpected server error occurred.",
		})
	}

	async function getEquipmentByRigID(
		request: VercelRequest,
		response: VercelResponse,
	) {
		const rigId = request.query.rigId

		if (!rigId) {
			return response
				.status(400)
				.json({ error: "Rig ID is missing or invalid." })
		}

		const equipment = await sql`
      SELECT
        equipment.id,
        equipment.name,
        equipment.hasfunction,
        equipment.compartment_id,
        compartments.name AS compartment_name,
        compartments.group_key,
        rigs.name AS rig_name
      FROM equipment
      JOIN compartments
        ON compartments.id = equipment.compartment_id
      JOIN rigs
        ON rigs.id = compartments.rig_id
      WHERE compartments.rig_id = ${rigId}
      ORDER BY
        CASE compartments.group_key
          WHEN 'front_bumper' THEN 1
          WHEN 'cab' THEN 2
          WHEN 'driver_side' THEN 3
          WHEN 'officer_side' THEN 4
          WHEN 'rear' THEN 5
          WHEN 'top' THEN 6
          WHEN 'undercarriage' THEN 7
          WHEN 'other' THEN 8
          ELSE 99
        END,
      compartments.position ASC,
      equipment.name ASC;
    `
		return response.status(200).json(equipment)
	}

	async function createEquipment(
		request: VercelRequest,
		response: VercelResponse,
	) {}
}
