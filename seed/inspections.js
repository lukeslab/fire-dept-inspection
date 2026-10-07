// CREATE TABLE IF NOT EXISTS inspections (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

//   rig_id UUID NOT NULL REFERENCES rigs(id) ON DELETE RESTRICT,
//   inspector_id UUID NOT NULL,

//   status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
//   passed BOOLEAN DEFAULT false,
//   comments TEXT,

//   started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//   completed_at TIMESTAMPTZ,

//   CHECK (
//       (status = 'in_progress' AND completed_at IS NULL) OR
//       (status = 'completed' and completed_at IS NOT NULL)
//   )
// )
// INSERT INTO inspections (rig_id, inspector_id)
// VALUES
//   ('01550b4f-edc9-449f-8005-a8032bcbd4ca', '01550b4f-edc9-449f-8005-a8032bcbd4ca')

// INSERT INTO inspections (rig_id, inspector_id, status, passed, completed_at)
// VALUES
//   ('01550b4f-edc9-449f-8005-a8032bcbd4ca', '01550b4f-edc9-449f-8005-a8032bcbd4ca', 'completed', FALSE, now() + INTERVAL '10 minutes')
//   ('01550b4f-edc9-449f-8005-a8032bcbd4ca', '01550b4f-edc9-449f-8005-a8032bcbd4ca', 'completed', true, now() + INTERVAL '1 day')
