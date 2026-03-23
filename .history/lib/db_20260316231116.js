/**
 * PostgreSQL connection and queries for Horoscope 2026.
 * Uses pg Pool; set DATABASE_URL in .env.
 */
require("dotenv").config();
const { Pool } = require("pg");

function getPgConfig() {
    const connectionString =
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        "postgresql://postgres:@localhost:5432/horoscope2026";
    try {
        const url = new URL(connectionString);
        const config = {
            host: url.hostname,
            port: url.port || 5432,
            user: url.username || "postgres",
            password: url.password !== undefined ? url.password : "",
            database: url.pathname.slice(1) || "horoscope2026",
        };
        return config;
    } catch {
        return { connectionString };
    }
}

const config = getPgConfig();
if (config.password === undefined) config.password = "";
const pool = new Pool(config);

function getPool() {
    return pool;
}

/**
 * @returns {Promise<Array<{ month_id: number, name: string }>>}
 */
async function getMonths() {
    const result = await pool.query(
        "SELECT month_id, name FROM months ORDER BY month_id",
    );
    return result.rows;
}

/**
 * @param {string} sign
 * @param {number} monthId
 * @param {string} category
 * @returns {Promise<{ id, sign, month_id, category, prediction } | null>}
 */
async function getPrediction(sign, monthId, category) {
    const result = await pool.query(
        `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
     WHERE sign = $1 AND month_id = $2 AND category = $3`,
        [sign, monthId, category],
    );
    return result.rows[0] || null;
}

/**
 * @param {string} sign
 * @param {number | null} monthId - if null, returns all months for sign
 * @returns {Promise<Array<{ id, sign, month_id, category, prediction }>>}
 */
async function getPredictionsForSignMonth(sign, monthId) {
    if (monthId !== null && monthId !== undefined) {
        const result = await pool.query(
            `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
       WHERE sign = $1 AND month_id = $2 ORDER BY category`,
            [sign, monthId],
        );
        return result.rows;
    }
    const result = await pool.query(
        `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
     WHERE sign = $1 ORDER BY month_id, category`,
        [sign],
    );
    return result.rows;
}

module.exports = {
    getPool,
    getMonths,
    getPrediction,
    getPredictionsForSignMonth,
};
