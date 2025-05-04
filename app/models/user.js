const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {

    id;
    email;
    password;
    username;
    name;
    address;
    contact;

    constructor(email, username = null, name = null, address = null, contact = null) {
        this.email = email;
        this.username = username;
        this.name = name;
        this.address = address;
        this.contact = contact;
    }

    async getIdFromEmail() {
        const sql = "SELECT id FROM Users WHERE email = ?";
        const result = await db.query(sql, [this.email]);
        if (result.length > 0) {
            this.id = result[0].id;
            return this.id;
        } else {
            return false;
        }
    }

    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        const sql = "UPDATE Users SET password = ? WHERE id = ?";
        await db.query(sql, [pw, this.id]);
        return true;
    }

    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO Users (email, password, username, name, address, contact)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [
            this.email,
            pw,
            this.username,
            this.name,
            this.address,
            this.contact
        ]);
        this.id = result.insertId;
        return true;
    }

    async authenticate(submitted) {
        const sql = "SELECT password FROM Users WHERE id = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].password);
        return match;
    }
}

module.exports = {
    User
}
