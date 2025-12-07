// src/models/SisterStatusModel.js
const BaseModel = require("./BaseModel");

class SisterStatusModel extends BaseModel {
  constructor() {
    super({ tableName: "sister_statuses", primaryKey: "id" });
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

  async getActiveStatuses() {
    const sql = `SELECT * FROM ${this.tableName} WHERE is_active = 1 ORDER BY display_order ASC`;
    return this.executeQuery(sql, []);
  }

  async getAll() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY display_order ASC`;
    return this.executeQuery(sql, []);
  }
}

module.exports = new SisterStatusModel();
