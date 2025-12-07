// Migration to add recommendations column to evaluations table
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();
  try {
    console.log("Adding recommendations column to evaluations table...");

    // Check if column exists
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'evaluations' 
       AND COLUMN_NAME = 'recommendations'`
    );

    if (columns.length === 0) {
      // Add recommendations column after weaknesses
      await connection.query(
        `ALTER TABLE evaluations 
         ADD COLUMN recommendations TEXT NULL 
         AFTER weaknesses`
      );
      console.log("Column 'recommendations' added successfully");
    } else {
      console.log("Column 'recommendations' already exists");
    }

    console.log(
      "Migration 027_add_recommendations_column completed successfully"
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
    console.log("Rolling back recommendations column...");

    await connection.query(
      `ALTER TABLE evaluations DROP COLUMN IF EXISTS recommendations`
    );

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
