// Script to check evaluator data in database
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mysql = require("mysql2/promise");

async function checkEvaluatorData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Checking evaluator data in evaluations table...\n");

    const [rows] = await connection.execute(`
      SELECT id, sister_id, evaluator, period, evaluation_date
      FROM evaluations
      LIMIT 10
    `);

    console.log("Sample evaluations:");
    console.table(rows);

    // Check if evaluator values are numeric or text
    const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN evaluator REGEXP '^[0-9]+$' THEN 1 ELSE 0 END) as numeric_count,
        SUM(CASE WHEN evaluator NOT REGEXP '^[0-9]+$' AND evaluator IS NOT NULL THEN 1 ELSE 0 END) as text_count,
        SUM(CASE WHEN evaluator IS NULL THEN 1 ELSE 0 END) as null_count
      FROM evaluations
    `);

    console.log("\nEvaluator data statistics:");
    console.table(stats);

    // Show some examples of text evaluators
    const [textEvaluators] = await connection.execute(`
      SELECT id, evaluator, period
      FROM evaluations
      WHERE evaluator NOT REGEXP '^[0-9]+$' AND evaluator IS NOT NULL
      LIMIT 5
    `);

    if (textEvaluators.length > 0) {
      console.log("\nExamples of TEXT evaluator values:");
      console.table(textEvaluators);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkEvaluatorData();
