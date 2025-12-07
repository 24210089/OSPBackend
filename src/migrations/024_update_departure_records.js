// Migration to add temporary absence (đi vắng) fields to departure_records table
const pool = require("../config/database");

const upQueries = [
  `ALTER TABLE departure_records ADD COLUMN type VARCHAR(50) NULL AFTER departure_date`,
  `ALTER TABLE departure_records ADD COLUMN expected_return_date DATE NULL AFTER type`,
  `ALTER TABLE departure_records ADD COLUMN return_date DATE NULL AFTER expected_return_date`,
  `ALTER TABLE departure_records ADD COLUMN destination VARCHAR(255) NULL AFTER return_date`,
  `ALTER TABLE departure_records ADD COLUMN contact_phone VARCHAR(50) NULL AFTER destination`,
  `ALTER TABLE departure_records ADD COLUMN contact_address TEXT NULL AFTER contact_phone`,
  `ALTER TABLE departure_records ADD COLUMN approved_by INT UNSIGNED NULL AFTER contact_address`,
  `ALTER TABLE departure_records ADD COLUMN notes TEXT NULL AFTER approved_by`,
  `ALTER TABLE departure_records ADD COLUMN documents JSON NULL AFTER notes`,
  `ALTER TABLE departure_records MODIFY COLUMN stage_at_departure ENUM('inquiry','postulant','aspirant','novice','temporary_vows','perpetual_vows','left') NULL`,
];

const downQueries = [
  `ALTER TABLE departure_records DROP COLUMN type`,
  `ALTER TABLE departure_records DROP COLUMN expected_return_date`,
  `ALTER TABLE departure_records DROP COLUMN return_date`,
  `ALTER TABLE departure_records DROP COLUMN destination`,
  `ALTER TABLE departure_records DROP COLUMN contact_phone`,
  `ALTER TABLE departure_records DROP COLUMN contact_address`,
  `ALTER TABLE departure_records DROP COLUMN approved_by`,
  `ALTER TABLE departure_records DROP COLUMN notes`,
  `ALTER TABLE departure_records DROP COLUMN documents`,
  `ALTER TABLE departure_records MODIFY COLUMN stage_at_departure ENUM('inquiry','postulant','aspirant','novice','temporary_vows','perpetual_vows','left') NOT NULL`,
];

module.exports = {
  name: "024_update_departure_records",
  up: async () => {
    const connection = await pool.getConnection();
    try {
      for (const query of upQueries) {
        try {
          await connection.query(query);
          console.log("  ✓ " + query.substring(0, 60) + "...");
        } catch (err) {
          // Ignore "Duplicate column" errors (column already exists)
          if (err.code !== "ER_DUP_FIELDNAME") {
            console.log("  ⚠ Skipped (may already exist): " + err.message);
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
      for (const query of downQueries) {
        try {
          await connection.query(query);
        } catch (err) {
          console.log("  ⚠ Skipped: " + err.message);
        }
      }
    } finally {
      connection.release();
    }
  },
};
