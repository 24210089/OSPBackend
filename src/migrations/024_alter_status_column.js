// Migration: Change status column from ENUM to VARCHAR
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();

  try {
    console.log("Altering status column in sisters table...");

    // Change status from ENUM to VARCHAR to allow custom statuses
    await connection.query(`
      ALTER TABLE sisters 
      MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active'
    `);

    console.log("✓ Status column altered to VARCHAR(50)");
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
