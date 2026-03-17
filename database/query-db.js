require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        "postgres://postgres:postgres@localhost:5432/horoscope2026",
});

async function query() {
    const [sign, monthId, category] = process.argv.slice(2);

    let result;

    if (sign && monthId && category) {
        result = await pool.query(
            `
      SELECT prediction
      FROM zodiac_predictions_2026
      WHERE sign = $1 AND month_id = $2 AND category = $3
      `,
            [sign, parseInt(monthId, 10), category],
        );
    } else if (sign && monthId) {
        result = await pool.query(
            `
      SELECT category, prediction
      FROM zodiac_predictions_2026
      WHERE sign = $1 AND month_id = $2
      ORDER BY category
      `,
            [sign, parseInt(monthId, 10)],
        );
    } else if (sign) {
        result = await pool.query(
            `
      SELECT month_id, category, prediction
      FROM zodiac_predictions_2026
      WHERE sign = $1
      ORDER BY month_id, category
      `,
            [sign],
        );
    } else {
        result = await pool.query(
            `
      SELECT sign, COUNT(*) AS count
      FROM zodiac_predictions_2026
      GROUP BY sign
      ORDER BY sign
      `,
        );
    }

    console.log(JSON.stringify(result.rows, null, 2));
    await pool.end();
}

query().catch((err) => {
    console.error(err);
    process.exit(1);
});
