const db = require("../src/config/database");

async function fixJourneyStage() {
  try {
    // Update inquiry stage name to Vietnamese
    const [result] = await db.query(
      "UPDATE journey_stages SET name = 'Tìm hiểu' WHERE code = 'inquiry'"
    );
    console.log("Updated inquiry stage:", result.affectedRows);

    // Verify the update
    const [rows] = await db.query(
      "SELECT * FROM journey_stages ORDER BY display_order"
    );
    console.log("\nCurrent journey stages:");
    rows.forEach((row) => {
      console.log(`  ${row.code}: ${row.name} (color: ${row.color})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixJourneyStage();
