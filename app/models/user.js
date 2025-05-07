// models/user.js

const db = require('../services/db');
const bcrypt = require('bcryptjs');

class User {
  id;
  email;
  password;
  username;
  name;
  address;
  contact;
  isAdmin;

  constructor(email, username = null, name = null, address = null, contact = null) {
    this.email    = email;
    this.username = username;
    this.name     = name;
    this.address  = address;
    this.contact  = contact;
  }

  /**  
   * Look up this.email in Users, populate this.id and this.isAdmin  
   * @returns {number|false} user id or false if not found  
   */
  async getIdFromEmail() {
    const sql    = 'SELECT id, is_admin FROM Users WHERE email = ?';
    const rows   = await db.query(sql, [this.email]);
    if (rows.length > 0) {
      this.id      = rows[0].id;
      this.isAdmin = rows[0].is_admin === 1;
      return this.id;
    }
    return false;
  }

  /**
   * Hash & update this.id’s password  
   * @param {string} password  Plain‐text new password  
   * @returns {Promise<boolean>}  
   */
  async setUserPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    const sql  = 'UPDATE Users SET password = ? WHERE id = ?';
    await db.query(sql, [hash, this.id]);
    return true;
  }

  /**
   * Create a new user row  
   * @param {string} password  Plain‐text password to hash/store  
   * @returns {Promise<boolean>}  
   */
  async addUser(password) {
    const hash = await bcrypt.hash(password, 10);
    const sql  = `
      INSERT INTO Users (email, password, username, name, address, contact)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await db.query(sql, [
      this.email,
      hash,
      this.username,
      this.name,
      this.address,
      this.contact
    ]);
    this.id = result.insertId;
    return true;
  }

  /**
   * Verify a submitted password against this.id’s stored hash  
   * @param {string} submitted  Plain‐text password to check  
   * @returns {Promise<boolean>} match?  
   */
  async authenticate(submitted) {
    const sql  = 'SELECT password FROM Users WHERE id = ?';
    const rows = await db.query(sql, [this.id]);
    if (rows.length === 0) return false;
    return bcrypt.compare(submitted, rows[0].password);
  }
}

module.exports = { User };
