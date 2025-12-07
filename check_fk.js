const pool = require("./src/config/database");

(async () => {
  try {
    const connection = await pool.getConnection();

    // Check foreign keys referencing users table
    const [fks] = await connection.query(`
      SELECT 
        TABLE_NAME, 
        COLUMN_NAME, 
        CONSTRAINT_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE REFERENCED_TABLE_NAME = 'users' 
        AND TABLE_SCHEMA = DATABASE()
    `);

    console.log("=== Foreign Keys Referencing Users Table ===");
    console.log(JSON.stringify(fks, null, 2));
    console.log("\nTotal:", fks.length, "foreign key constraints");

    // Check if users table has any triggers
    const [triggers] = await connection.query(`
      SELECT 
        TRIGGER_NAME, 
        EVENT_MANIPULATION, 
        ACTION_TIMING 
      FROM INFORMATION_SCHEMA.TRIGGERS 
      WHERE EVENT_OBJECT_TABLE = 'users' 
        AND TRIGGER_SCHEMA = DATABASE()
    `);

    console.log("\n=== Triggers on Users Table ===");
    console.log(JSON.stringify(triggers, null, 2));
    console.log("\nTotal:", triggers.length, "triggers");

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
