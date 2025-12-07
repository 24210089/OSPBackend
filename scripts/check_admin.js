const pool = require("../src/config/database");

async function main() {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, role, is_active, password FROM users WHERE username = ?",
      ["admin"]
    );
    console.log("Admin user:", JSON.stringify(rows, null, 2));

    if (rows.length > 0) {
      const bcrypt = require("bcryptjs");
      const match = await bcrypt.compare("password123", rows[0].password);
      console.log("Password matches:", match);
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
