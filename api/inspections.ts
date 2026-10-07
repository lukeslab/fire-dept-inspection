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
				return

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
      ('${rigId}', '${inspectorId}')
  `

	console.log(query)

	return response
		.status(200)
		.json({ message: "Inspection created successfully." })
}
