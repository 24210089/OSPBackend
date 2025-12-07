// Migration: Create lookup tables for journey stages and sister statuses
const pool = require("../config/database");

async function up() {
  const connection = await pool.getConnection();
  
  try {
    console.log("Creating lookup tables...");

    // Create journey_stages table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS journey_stages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        display_order INT DEFAULT 0,
        color VARCHAR(20) DEFAULT '#6c757d',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created journey_stages table");

    // Create sister_statuses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sister_statuses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        display_order INT DEFAULT 0,
        color VARCHAR(20) DEFAULT '#6c757d',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Created sister_statuses table");

    // Insert default journey stages
    const journeyStages = [
      { code: 'aspirant', name: 'Ứng sinh', display_order: 1, color: '#17a2b8' },
      { code: 'postulant', name: 'Tập sinh', display_order: 2, color: '#ffc107' },
      { code: 'novice', name: 'Tập sinh khấn', display_order: 3, color: '#fd7e14' },
      { code: 'temporary_vows', name: 'Khấn tạm', display_order: 4, color: '#6f42c1' },
      { code: 'perpetual_vows', name: 'Khấn trọn', display_order: 5, color: '#28a745' },
      { code: 'final_vows', name: 'Khấn dứt', display_order: 6, color: '#007bff' }
    ];

    for (const stage of journeyStages) {
      await connection.query(`
        INSERT INTO journey_stages (code, name, display_order, color)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), display_order = VALUES(display_order), color = VALUES(color)
      `, [stage.code, stage.name, stage.display_order, stage.color]);
    }
    console.log("✓ Inserted default journey stages");

    // Insert default sister statuses
    const sisterStatuses = [
      { code: 'active', name: 'Đang hoạt động', display_order: 1, color: '#28a745' },
      { code: 'inactive', name: 'Tạm nghỉ', display_order: 2, color: '#ffc107' },
      { code: 'leave', name: 'Đã rời', display_order: 3, color: '#6c757d' },
      { code: 'deceased', name: 'Đã qua đời', display_order: 4, color: '#343a40' }
    ];

    for (const status of sisterStatuses) {
      await connection.query(`
        INSERT INTO sister_statuses (code, name, display_order, color)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), display_order = VALUES(display_order), color = VALUES(color)
      `, [status.code, status.name, status.display_order, status.color]);
    }
    console.log("✓ Inserted default sister statuses");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    connection.release();
  }
}

async function down() {
  const connection = await pool.getConnection();
  
  try {
    await connection.query("DROP TABLE IF EXISTS journey_stages");
    await connection.query("DROP TABLE IF EXISTS sister_statuses");
    console.log("Rollback completed!");
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
