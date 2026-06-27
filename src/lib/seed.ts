import db from "./db";
import bcrypt from "bcryptjs";


const fixedUsers = [
    { email: "admin@devpanel.com", name: "Oscar Villalta", role: "admin", status: "active" },
    { email: "manager@devpanel.com", name: "Juan Pérez", role: "manager", status: "active" },
    { email: "user@devpanel.com", name: "Ana García", role: "user", status: "active" },
];


const names = [
    "Sofía Ramírez", "Carlos Mendoza", "Valentina Torres", "Luis Herrera",
    "Isabella Flores", "Andrés Morales", "Camila Ortega", "Diego Castillo",
    "Martina Vargas", "Sebastián Rivas", "Lucía Pinto", "Mateo Sánchez",
    "Elena Núñez", "Gabriel Rueda", "Paula Medina", "Felipe Acosta",
    "Natalia Guerrero", "Javier Lozano", "Daniela Peña", "Ricardo Salazar",
    "Mariana Espinoza", "Alejandro Fuentes", "Catalina Muñoz", "Emilio Reyes",
    "Fernanda Castro", "Nicolás Romero", "Valeria Suárez", "Santiago Lagos",
    "Paola Vega", "Tomás Ríos", "Adriana Silva", "Raúl Paredes",
];

const roles = ["user", "user", "user", "manager"] as const;
const statuses = ["active", "active", "active", "inactive"] as const;

function buildDynamicUsers() {
    return names.map((name, i) => {
        const slug = name.toLowerCase().replace(/\s/g, ".").replace(/[áéíóúñ]/g,
            (c) => ({ á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n" }[c] ?? c)
        );
        return {
            email: `${slug}@devpanel.com`,
            name,
            role: roles[i % roles.length],
            status: statuses[i % statuses.length],
        };
    });
}

const seedDatabase = () => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const defaultHash = bcrypt.hashSync("password123", saltRounds);

    const insertStmt = db.prepare(
        `INSERT OR IGNORE INTO users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)`
    );

    const allUsers = [...fixedUsers, ...buildDynamicUsers()];

    const insertMany = db.transaction((users: typeof allUsers) => {
        for (const user of users) {
            insertStmt.run(user.email, defaultHash, user.name, user.role, user.status);
        }
    });

    console.log(`Sembrando ${allUsers.length} usuarios en la base de datos...`);
    insertMany(allUsers);
    console.log("¡Seeding completado con éxito!");
};

try {
    seedDatabase();
} catch (error) {
    console.error("Error durante el seeding:", error);
    process.exit(1);
}
