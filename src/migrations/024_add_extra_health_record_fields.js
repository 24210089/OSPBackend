const pool = require("../config/database");

const upQuery = `
  ALTER TABLE health_records
    MODIFY COLUMN general_health VARCHAR(50) NOT NULL DEFAULT 'good',
    ADD COLUMN IF NOT EXISTS doctor VARCHAR(150) NULL AFTER checkup_place,
    ADD COLUMN IF NOT EXISTS blood_pressure VARCHAR(20) NULL AFTER doctor,
    ADD COLUMN IF NOT EXISTS heart_rate VARCHAR(20) NULL AFTER blood_pressure,
    ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2) NULL AFTER heart_rate,
    ADD COLUMN IF NOT EXISTS height DECIMAL(5,2) NULL AFTER weight,
    ADD COLUMN IF NOT EXISTS next_checkup_date DATE NULL AFTER checkup_date,
    ADD COLUMN IF NOT EXISTS documents JSON NULL AFTER notes;
`;

const downQuery = `
  ALTER TABLE health_records
    DROP COLUMN IF EXISTS doctor,
    DROP COLUMN IF EXISTS blood_pressure,
    DROP COLUMN IF EXISTS heart_rate,
    DROP COLUMN IF EXISTS weight,
    DROP COLUMN IF EXISTS height,
    DROP COLUMN IF EXISTS next_checkup_date,
    DROP COLUMN IF EXISTS documents;
`;

module.exports = {
  name: "024_add_extra_health_record_fields",
  up: async () => {
    const connection = await pool.getConnection();
    try {
      // Run each ALTER separately to handle IF NOT EXISTS properly
      const alterStatements = [
        "ALTER TABLE health_records MODIFY COLUMN general_health VARCHAR(50) NOT NULL DEFAULT 'good'",
        "ALTER TABLE health_records ADD COLUMN doctor VARCHAR(150) NULL AFTER checkup_place",
        "ALTER TABLE health_records ADD COLUMN blood_pressure VARCHAR(20) NULL AFTER doctor",
        "ALTER TABLE health_records ADD COLUMN heart_rate VARCHAR(20) NULL AFTER blood_pressure",
        "ALTER TABLE health_records ADD COLUMN weight DECIMAL(5,2) NULL AFTER heart_rate",
        "ALTER TABLE health_records ADD COLUMN height DECIMAL(5,2) NULL AFTER weight",
        "ALTER TABLE health_records ADD COLUMN next_checkup_date DATE NULL AFTER checkup_date",
        "ALTER TABLE health_records ADD COLUMN documents JSON NULL AFTER notes",
      ];

      for (const sql of alterStatements) {
        try {
          await connection.query(sql);
        } catch (err) {
          // Ignore duplicate column errors
          if (!err.message.includes("Duplicate column")) {
            console.log(`Note: ${err.message}`);
          }
        }
      }
    } finally {
      connection.release();
    }
  },
  down: async () => {
    const connection = await pool.getConnection();
    try {
      const dropStatements = [
        "ALTER TABLE health_records DROP COLUMN IF EXISTS doctor",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS blood_pressure",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS heart_rate",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS weight",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS height",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS next_checkup_date",
        "ALTER TABLE health_records DROP COLUMN IF EXISTS documents",
      ];

      for (const sql of dropStatements) {
        try {
          await connection.query(sql);
        } catch (err) {
          console.log(`Note: ${err.message}`);
        }
      }
    } finally {
      connection.release();
    }
  },
};
