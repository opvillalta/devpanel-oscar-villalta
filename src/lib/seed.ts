import db from "./db";
import bcrypt from "bcryptjs";

const seedUsers = [
    {
        email: "admin@devpanel.com",
        name: "Admin User",
        role: "admin",
        status: "active",
    },
    {
        email: "manager@devpanel.com",
        name: "Juan Perez",
        role: "manager",
        status: "active",
    },
    {
        email: "user@devpanel.com",
        name: "Ana Maria",
        role: "user",
        status: "active",
    },
    {
        email: "guest@devpanel.com",
        name: "Maria Lopez",
        role: "user",
        status: "inactive",
    }
];

const seedDatabase = () => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const defaultHash = bcrypt.hashSync("password123", saltRounds);

    const insertStmt = db.prepare(
        `INSERT OR IGNORE INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)`
    );

    const insertMany = db.transaction((users) => {
        for (const user of users) {
            insertStmt.run(user.email, defaultHash, user.name, user.role, user.status);
        }
    });

    console.log("Sembrando usuarios de prueba en la base de datos...");
    insertMany(seedUsers);
    console.log("¡Seeding de usuarios completado con éxito!");
};

try {
    seedDatabase();
} catch (error) {
    console.error("Error durante el seeding:", error);
    process.exit(1);
}
