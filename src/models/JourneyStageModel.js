// src/models/JourneyStageModel.js
const BaseModel = require("./BaseModel");

class JourneyStageModel extends BaseModel {
  constructor() {
    super({ tableName: "journey_stages", primaryKey: "id" });
    this.allowedFields = [
      "code",
      "name",
      "description",
      "display_order",
      "color",
      "is_active",
    ];
    this.requiredFields = ["code", "name"];
  }

  async findByCode(code) {
    const sql = `SELECT * FROM ${this.tableName} WHERE code = ? LIMIT 1`;
    const rows = await this.executeQuery(sql, [code]);
    return rows[0] || null;
  }

  async getActiveStages() {
    const sql = `SELECT * FROM ${this.tableName} WHERE is_active = 1 ORDER BY display_order ASC`;
    return this.executeQuery(sql, []);
  }

  async getAll() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY display_order ASC`;
    return this.executeQuery(sql, []);
  }
}

module.exports = new JourneyStageModel();
