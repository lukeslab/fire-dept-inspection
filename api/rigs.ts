import { neon } from "@neondatabase/serverless";

import type { Compartment } from "../src/models/Compartment.ts";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not configured.");
}

const sql = neon(databaseUrl);

type CompartmentInput = {
  id?: string;
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

  const insertedCompartments = insertCompartments(rig.id, compartments)

  return response.status(201).json({
    ...rig,
    compartments: insertedCompartments,
  });
}

async function handleEditRig(
  request: VercelRequest,
  response: VercelResponse
) {
  const body = request.body as EditRigBody | undefined
  console.log('editing')
  const id = body?.id
  const name = body?.name.trim()
  const compartments = body?.compartments

  if (!name) {
    return response.status(400).json({
      error: "Rig name is required.",
    });
  }

  // Check if the name exists on all other rig
  const queryOtherRigs = await sql`
    SELECT name
    FROM rigs
    WHERE LOWER(name) = LOWER(${name})
      AND id <> ${id}
    LIMIT 1;
  `;

  if (queryOtherRigs.length > 0) {
    return response.status(409).json({
      error: 'A rig with that name already exists.'
    })
  }

  // If the name is different from the current name AND does not already exist, update the current name.

  const querySelectedRig = await sql`
    SELECT name
    FROM rigs
    WHERE id = ${id}
  `
  const [currentRig] = querySelectedRig

  if (!currentRig) {
    return response.status(404).json({
      error: "Rig not found."
    })
  }

  if (currentRig.name !== name) {
    await sql`
      UPDATE rigs
      SET name = ${name}
      WHERE id = ${id}
    `
  }
  
  const newCompartments = compartments?.filter(compartment => !compartment.id)
  if (id && newCompartments) insertCompartments(id, newCompartments)
  
  const existingCompartments = compartments?.filter(compartment => compartment.id)
  if (existingCompartments) updateCompartments(existingCompartments)
  
  const compartmentsInDatabase = (await sql`
    SELECT id
    FROM compartments
    WHERE rig_id = ${id}
  `) as Compartment[]
  // const setCompartments = new Set(existingCompartments)
  const deletedCompartments = compartmentsInDatabase.filter( compartmentInDB => {
    return !existingCompartments?.find( existingCompartment => {
      return existingCompartment.id == compartmentInDB.id
    })
  })

  if (deletedCompartments) deleteCompartments(deletedCompartments)
  console.log(deletedCompartments)

  return response.status(201).json({ message: "Updated successfully." })

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

async function insertCompartments(rigId: string, compartments: CompartmentInput[]) {
  const insertedCopmartments: Compartment[] = [];

  for (const [index, compartment] of compartments.entries()) {
    const compartmentName = compartment.name?.trim();

    if (!compartmentName) {
      continue;
    }

    const position = compartment.position ?? index;

    const [insertedCompartment] = (await sql`
    INSERT INTO compartments (
        rig_id,
        name,
        position
    )
    VALUES (
        ${rigId},
        ${compartmentName},
        ${position}
    )
    RETURNING
        id,
        rig_id AS "rigId",
        name,
        position;
`) as Compartment[];

    insertedCopmartments.push(insertedCompartment);
  }
}

async function updateCompartments(compartments: CompartmentInput[]) {

  for (const compartment of compartments) {
    if (!compartment.name) continue

    await sql`
      UPDATE compartments
      SET name = ${compartment.name}
      WHERE id = ${compartment.id}
    `
  }
  
}

async function deleteCompartments(compartments: CompartmentInput[]) {
  
  for ( const compartment of compartments) {
    await sql`
      DELETE FROM compartments
      WHERE id = ${compartment.id}
    `
  }
  
}
