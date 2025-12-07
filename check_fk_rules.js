const pool = require("./src/config/database");

(async () => {
  try {
    const connection = await pool.getConnection();

    // Check ON DELETE rules for foreign keys
    const [fks] = await connection.query(`
      SELECT 
        kcu.TABLE_NAME,
        kcu.COLUMN_NAME,
        kcu.CONSTRAINT_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME,
        rc.DELETE_RULE,
        rc.UPDATE_RULE
      FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
      JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu 
        ON rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME 
        AND rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
      WHERE kcu.REFERENCED_TABLE_NAME = 'users' 
        AND rc.CONSTRAINT_SCHEMA = DATABASE()
    `);

    console.log("=== Foreign Key Constraints with DELETE/UPDATE Rules ===");
    fks.forEach((fk) => {
      console.log(
        `\n${fk.TABLE_NAME}.${fk.COLUMN_NAME} -> ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`
      );
      console.log(`  Constraint: ${fk.CONSTRAINT_NAME}`);
      console.log(`  ON DELETE: ${fk.DELETE_RULE}`);
      console.log(`  ON UPDATE: ${fk.UPDATE_RULE}`);
    });

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
