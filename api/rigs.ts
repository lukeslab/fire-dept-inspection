import { neon } from "@neondatabase/serverless";

import type { Compartment } from "../src/models/Compartment.ts";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const sql = neon(databaseUrl);

type CompartmentInput = {
  name: string;
  position?: number;
};

type CreateRigBody = {
  name?: string;
  compartments?: CompartmentInput[];
};

type EditRigBody = {
  id: string;
  name: string;
  compartments?: CompartmentInput[]
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    switch (request.method) {
      case "GET":
        if (request.query.id) {
          console.log(request.query.id)
          return await handleGetRigById(request, response)
        }

        return await handleGetRigs(response);

      case "POST":
        return await handleCreateRig(request, response);

      case "PATCH":
        return await handleEditRig(request, response);

      case "DELETE":
        return await handleDeleteRig(request, response);

      default:
        response.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);

        return response.status(405).json({
          error: `Method ${request.method} is not allowed.`,
        });
    }
  } catch (error) {
    console.error("Rigs API error:", error);

    return response.status(500).json({
      error: "An unexpected server error occurred.",
    });
  }
}

async function handleGetRigs(response: VercelResponse) {
  const rigs = await sql`
    SELECT
      r.id,
      r.name,
      r.created_at,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', c.id,
            'name', c.name,
            'position', c.position
          )
          ORDER BY c.position
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::JSON
      ) AS compartments
    FROM rigs r
    LEFT JOIN compartments c
      ON c.rig_id = r.id
    GROUP BY
      r.id,
      r.name,
      r.created_at
    ORDER BY
      r.name;
  `;

  return response.status(200).json(rigs);
}

async function handleGetRigById(request: VercelRequest, response: VercelResponse) {
  const rigId = request.query.id
 
  const rig = await sql`
    SELECT
      r.id AS rig_id,
      r.name AS rig_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', c.id,
            'name', c.name
          )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'::json
      ) AS compartments
    FROM rigs r
    LEFT JOIN compartments c
      ON c.rig_id = r.id
    WHERE r.id = ${rigId}
    GROUP BY r.id, r.name
  `

  return response.status(200).json(rig)
  
}

async function handleCreateRig(
  request: VercelRequest,
  response: VercelResponse,
) {
  const body = request.body as CreateRigBody | undefined;

  const name = body?.name?.trim();
  const compartments = body?.compartments ?? [];

  if (!name) {
    return response.status(400).json({
      error: "Rig name is required.",
    });
  }

  const existingRig = await sql`
    SELECT id
    FROM rigs
    WHERE LOWER(name) = LOWER(${name})
    LIMIT 1;
  `;

  if (existingRig.length > 0) {
    return response.status(409).json({
      error: "A rig with that name already exists.",
    });
  }

  const [rig] = await sql`
    INSERT INTO rigs (name)
    VALUES (${name})
    RETURNING
      id,
      name,
      created_at;
  `;

  const createdCompartments: Compartment[] = [];

  for (const [index, compartment] of compartments.entries()) {
    const compartmentName = compartment.name?.trim();

    if (!compartmentName) {
      continue;
    }

    const position = compartment.position ?? index;

    const [createdCompartment] = (await sql`
    INSERT INTO compartments (
        rig_id,
        name,
        position
    )
    VALUES (
        ${rig.id},
        ${compartmentName},
        ${position}
    )
    RETURNING
        id,
        rig_id AS "rigId",
        name,
        position;
`) as Compartment[];

    createdCompartments.push(createdCompartment);
  }

  return response.status(201).json({
    ...rig,
    compartments: createdCompartments,
  });
}

async function handleEditRig(
  request: VercelRequest,
  response: VercelResponse
) {
  const body = request.body as EditRigBody | undefined

  const name = body?.name?.trim();

  if (!name) {
    return response.status(400).json({
      error: "Rig name is required.",
    });
  }
}

async function handleDeleteRig(
  request: VercelRequest,
  response: VercelResponse,
) {
  const id =
    typeof request.query.id === "string"
      ? request.query.id.trim()
      : undefined;

  if (!id) {
    return response.status(400).json({
      error: "Rig ID is required.",
    });
  }

  const deletedRigs = await sql`
    DELETE FROM rigs
    WHERE id = ${id}
    RETURNING id, name;
  `;

  if (deletedRigs.length === 0) {
    return response.status(404).json({
      error: "Rig not found.",
    });
  }

  return response.status(200).json({
    deleted: true,
    rig: deletedRigs[0],
  });
}