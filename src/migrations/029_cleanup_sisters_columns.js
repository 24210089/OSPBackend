// Migration: Cleanup unused columns in sisters table
// Remove columns that are not used in SisterFormPage.jsx

const db = require("../config/database");

const up = async () => {
  console.log("Running migration 029: Cleanup unused sisters columns...");

  const columnsToRemove = [
    "religious_name",
    "prefer_name",
    "preferred_name",
    "hometown",
    "id_number",
    "documents_url",
  ];

  for (const column of columnsToRemove) {
    try {
      // Check if column exists before dropping
      const [rows] = await db.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'sisters' 
         AND COLUMN_NAME = ?`,
        [column]
      );

      if (rows.length > 0) {
        await db.query(`ALTER TABLE sisters DROP COLUMN ${column}`);
        console.log(`  ✓ Dropped column: ${column}`);
      } else {
        console.log(`  - Column ${column} does not exist, skipping...`);
      }
    } catch (error) {
      console.error(`  ✗ Error dropping column ${column}:`, error.message);
    }
  }

  console.log("Migration 029 completed.");
};

const down = async () => {
  console.log("Rolling back migration 029...");

  // Re-add the columns if needed
  const columnsToAdd = [
    { name: "religious_name", type: "VARCHAR(120) NULL" },
    { name: "prefer_name", type: "VARCHAR(120) NULL" },
    { name: "preferred_name", type: "VARCHAR(255) NULL" },
    { name: "hometown", type: "VARCHAR(200) NULL" },
    { name: "id_number", type: "VARCHAR(50) NULL" },
    { name: "documents_url", type: "LONGTEXT NULL" },
  ];

  for (const col of columnsToAdd) {
    try {
      await db.query(`ALTER TABLE sisters ADD COLUMN ${col.name} ${col.type}`);
      console.log(`  ✓ Added column: ${col.name}`);
    } catch (error) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log(`  - Column ${col.name} already exists, skipping...`);
      } else {
        console.error(`  ✗ Error adding column ${col.name}:`, error.message);
      }
    }
  }

  console.log("Rollback 029 completed.");
};

module.exports = { up, down };

// Run directly if called from command line
if (require.main === module) {
  up()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
