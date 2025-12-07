const pool = require("../src/config/database");

async function updateRoleEnum() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      ALTER TABLE community_assignments 
      MODIFY COLUMN role ENUM('superior','assistant','vice_superior','deputy','secretary','treasurer','member') 
      NOT NULL DEFAULT 'member'
    `);
    console.log("ENUM updated successfully");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

updateRoleEnum();
