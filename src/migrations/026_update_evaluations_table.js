// Migration to update evaluations table to match form fields and add documents
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();
  try {
    console.log("Updating evaluations table...");

    // Check existing columns
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'evaluations'`
    );
    const existingCols = columns.map((c) => c.COLUMN_NAME);

    // Add new columns if not exist
    const columnsToAdd = [
      {
        name: "evaluation_type",
        sql: "ALTER TABLE evaluations ADD COLUMN evaluation_type VARCHAR(50) NULL AFTER sister_id",
      },
      {
        name: "period",
        sql: "ALTER TABLE evaluations ADD COLUMN period VARCHAR(100) NULL AFTER evaluation_type",
      },
      {
        name: "evaluation_date",
        sql: "ALTER TABLE evaluations ADD COLUMN evaluation_date DATE NULL AFTER period",
      },
      {
        name: "evaluator",
        sql: "ALTER TABLE evaluations ADD COLUMN evaluator VARCHAR(255) NULL AFTER evaluation_date",
      },
      {
        name: "spiritual_life",
        sql: "ALTER TABLE evaluations ADD COLUMN spiritual_life TINYINT UNSIGNED NULL AFTER evaluator",
      },
      {
        name: "community_life",
        sql: "ALTER TABLE evaluations ADD COLUMN community_life TINYINT UNSIGNED NULL AFTER spiritual_life",
      },
      {
        name: "apostolic_work",
        sql: "ALTER TABLE evaluations ADD COLUMN apostolic_work TINYINT UNSIGNED NULL AFTER community_life",
      },
      {
        name: "personal_development",
        sql: "ALTER TABLE evaluations ADD COLUMN personal_development TINYINT UNSIGNED NULL AFTER apostolic_work",
      },
      {
        name: "overall_rating",
        sql: "ALTER TABLE evaluations ADD COLUMN overall_rating TINYINT UNSIGNED NULL AFTER personal_development",
      },
      {
        name: "strengths",
        sql: "ALTER TABLE evaluations ADD COLUMN strengths TEXT NULL AFTER overall_rating",
      },
      {
        name: "weaknesses",
        sql: "ALTER TABLE evaluations ADD COLUMN weaknesses TEXT NULL AFTER strengths",
      },
      {
        name: "notes",
        sql: "ALTER TABLE evaluations ADD COLUMN notes TEXT NULL AFTER recommendations",
      },
      {
        name: "documents",
        sql: "ALTER TABLE evaluations ADD COLUMN documents JSON NULL AFTER notes",
      },
    ];

    for (const col of columnsToAdd) {
      if (!existingCols.includes(col.name)) {
        console.log(`Adding column: ${col.name}`);
        await connection.query(col.sql);
      } else {
        console.log(`Column ${col.name} already exists`);
      }
    }

    console.log(
      "Migration 026_update_evaluations_table completed successfully"
    );
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function down() {
  const connection = await pool.getConnection();
  try {
    console.log("Rolling back evaluations table changes...");

    const columnsToRemove = [
      "documents",
      "notes",
      "weaknesses",
      "strengths",
      "overall_rating",
      "personal_development",
      "apostolic_work",
      "community_life",
      "spiritual_life",
      "evaluator",
      "evaluation_date",
      "period",
      "evaluation_type",
    ];

    for (const col of columnsToRemove) {
      try {
        await connection.query(
          `ALTER TABLE evaluations DROP COLUMN IF EXISTS ${col}`
        );
      } catch (e) {
        console.log(`Could not drop column ${col}:`, e.message);
      }
    }

    console.log("Rollback completed");
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  up()
    .then(() => {
      console.log("Done");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { up, down };
