// Migration: Add documents JSON field to sisters table
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();
  
  try {
    console.log("Adding documents field to sisters table...");

    // Check if documents column exists
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'sisters' 
      AND COLUMN_NAME = 'documents'
    `);

    if (columns.length === 0) {
      // Add documents column as JSON
      await connection.query(`
        ALTER TABLE sisters 
        ADD COLUMN documents JSON DEFAULT NULL 
        COMMENT 'JSON array of document files'
      `);
      console.log("✓ Added documents column");
    } else {
      console.log("✓ documents column already exists");
    }

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
