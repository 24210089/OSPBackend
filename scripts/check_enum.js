const pool = require("../src/config/database");

async function checkEnum() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SHOW COLUMNS FROM community_assignments WHERE Field = 'role'"
    );
    console.log("Result:", JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

checkEnum();
