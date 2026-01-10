import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ encoding: "utf8", path: ".env", debug: false });

const limit = 20; // number of most recent messages to be sent to LLM

//validation (if you use a empty password just comment the line i marked below)
const requiredEnv = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_DATABASE",
  "MYSQL_PASSWORD", //comment this line if you use empty password
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required MYSQL_ env vars: ${missingEnv.join(", ")}`);
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export default class Database {
  static async insertChatHistory(userId, role, content) {
    const query =
      "INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)";
    await pool.query(query, [userId, role, content]);
  }

  static async getChatHistory(userId) {
    const query = `
      (SELECT role, content, id FROM chat_history 
       WHERE user_id = ? AND role = 'system' 
       ORDER BY id ASC LIMIT 1)
      UNION
      (SELECT role, content, id FROM 
        (SELECT role, content, id FROM chat_history 
         WHERE user_id = ? AND role != 'system' 
         ORDER BY id DESC LIMIT ?) as recent_msgs
      )
      ORDER BY id ASC
    `;

    const [rows] = await pool.query(query, [userId, userId, limit]);

    return rows.map(({ role, content }) => ({ role, content }));
  }

  static async checkUserExists(userId) {
    const query =
      "SELECT COUNT(*) AS count FROM chat_history WHERE user_id = ?";
    const [rows] = await pool.query(query, [userId]);
    return rows[0].count > 0;
  }

  static async checkConnection() {
    try {
      await pool.query("SELECT 1");
      console.log("DB is connected");
    } catch (error) {
      throw new Error("Database connection failed: " + error.message);
    }
  }
  static async close() {
    await pool.end();
  }
}
