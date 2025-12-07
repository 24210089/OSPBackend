const pool = require("./src/config/database");

(async () => {
  try {
    const userId = 3; // ID của user bạn muốn test

    const connection = await pool.getConnection();

    // Kiểm tra user tồn tại
    const [users] = await connection.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      console.log(`User ID ${userId} không tồn tại`);
      connection.release();
      process.exit(0);
      return;
    }

    console.log("User trước khi xóa:");
    console.log(users[0]);

    // Kiểm tra các bản ghi liên quan
    const [auditLogs] = await connection.query(
      "SELECT COUNT(*) as count FROM audit_logs WHERE user_id = ?",
      [userId]
    );
    const [evaluations] = await connection.query(
      "SELECT COUNT(*) as count FROM evaluations WHERE evaluator_id = ?",
      [userId]
    );
    const [sisters] = await connection.query(
      "SELECT COUNT(*) as count FROM sisters WHERE created_by = ?",
      [userId]
    );
    const [journeys] = await connection.query(
      "SELECT COUNT(*) as count FROM vocation_journey WHERE supervisor_id = ?",
      [userId]
    );

    console.log("\nBản ghi liên quan:");
    console.log("- audit_logs:", auditLogs[0].count);
    console.log("- evaluations:", evaluations[0].count);
    console.log("- sisters:", sisters[0].count);
    console.log("- vocation_journey:", journeys[0].count);

    // Thử xóa
    console.log("\nThử xóa user...");
    const [result] = await connection.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);

    console.log("Kết quả xóa:");
    console.log("- affectedRows:", result.affectedRows);
    console.log("✅ Xóa thành công!");

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
})();
