import db from "./db";
import bcrypt from "bcryptjs";

const hash = bcrypt.hashSync("admin123", 10);
db.prepare(
    `INSERT OR IGNORE INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)`
).run("admin@devpanel.com", hash, "Admin", "admin", "active");
