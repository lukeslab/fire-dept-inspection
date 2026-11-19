import { neon } from "@neondatabase/serverless"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not configured.")
}

const sql = neon(databaseUrl)

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	try {
		console.log(request.query)
		switch (request.method) {
			case "GET":
				if (request.query.id) {
					return await getInspectionById(request, response)
				}
				return await getAllInspections(request, response)

			case "POST":
				return await createInspection(request, response)

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
		console.error("Inspections API error:", error)

		return response.status(500).json({
			error: "An unexpected server error occurred.",
		})
	}
}

async function createInspection(request, response) {
	const { rigId, inspectorId } = request.body

	const query = await sql`
    INSERT INTO inspections (rig_id, inspector_id)
    VALUES 
			(${rigId}, ${inspectorId})
		RETURNING 
			id AS "inspectionId"
  `

	return response
		.status(200)
		.json({ message: "Inspection created successfully.", data: query })
}

async function getAllInspections(request, response) {
	const query = await sql`
		SELECT 
			i.id,
			i.status,
			i.passed,
			r.name AS "rigName",
			r.model as "rigModel",
			r.image_url AS "rigImageUrl",
			CONCAT(u.first_name, ' ', u.last_name) AS "inspector", 
			i.started_at AS "startTime",
			i.completed_at AS "endTime",
			i.items_checked AS "itemsChecked",
			i.total_items AS "totalItems"
		FROM inspections i
		LEFT JOIN rigs r
				ON i.rig_id = r.id
		LEFT JOIN users u
				ON i.inspector_id = u.id
		ORDER BY 
			i.started_at DESC,
			r.name DESC
	`

	return response.status(200).json({
		message: `Returning ${query.length} inspections records.`,
		data: query,
	})
}

async function getInspectionById(request, response) {
	const id = request.query.id

	const [inspection] = await sql`
		SELECT 
			i.id,
			i.status,
			i.passed,
			r.name AS "rigName",
			r.model as "rigModel",
			r.image_url AS "rigImageUrl",
			CONCAT(u.first_name, ' ', u.last_name) AS "inspector", 
			i.started_at AS "startTime",
			i.completed_at AS "endTime",
			i.items_checked AS "itemsChecked",
			i.total_items AS "totalItems"
		FROM inspections i
		LEFT JOIN rigs r
				ON i.rig_id = r.id
		LEFT JOIN users u
				ON i.inspector_id = u.id
		WHERE i.id = ${id}
		ORDER BY 
			i.started_at DESC,
			r.name DESC
		LIMIT 1
	`

	console.log(inspection)
	return response.status(200).json({
		message: `Returning inspection ${id}.`,
		data: inspection,
	})
}
