// Migration: Change current_stage column from ENUM to VARCHAR
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();

  try {
    console.log("Altering current_stage column in sisters table...");

    // Change current_stage from ENUM to VARCHAR to allow custom stages
    await connection.query(`
      ALTER TABLE sisters 
      MODIFY COLUMN current_stage VARCHAR(50) NULL
    `);

    console.log("✓ current_stage column altered to VARCHAR(50)");
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Run migration
up()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
