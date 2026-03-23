import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "./supabase-env";

export type Prediction = {
    id: number;
    sign: string;
    month_id: number;
    category: string;
    prediction: string;
    created_at?: string;
};

export type Month = { month_id: number; name: string };

function getConnectionString(): string {
    return (
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        "postgresql://postgres:@localhost:5432/horoscope2026"
    );
}

/** Hosts other than localhost use TLS; relax chain verify for cloud DBs (fixes Supabase / some proxies). */
function isLocalDatabase(connectionString: string): boolean {
    try {
        const u = new URL(
            connectionString.replace(/^postgres(ql)?:\/\//i, "http://"),
        );
        return u.hostname === "localhost" || u.hostname === "127.0.0.1";
    } catch {
        return false;
    }
}

/**
 * Query sslmode=require is currently treated like verify-full in node-pg and can ignore
 * rejectUnauthorized: false. Strip ssl-related params and set ssl on the Pool instead.
 */
function stripSslQueryParams(connectionString: string): string {
    const q = connectionString.indexOf("?");
    if (q === -1) return connectionString;
    const base = connectionString.slice(0, q);
    const params = new URLSearchParams(connectionString.slice(q + 1));
    params.delete("sslmode");
    params.delete("ssl");
    const rest = params.toString();
    return rest ? `${base}?${rest}` : base;
}

let pool: Pool | null = null;

function getPool(): Pool {
    if (!pool) {
        const raw = getConnectionString();
        const local = isLocalDatabase(raw);
        pool = new Pool(
            local
                ? {
                      connectionString: raw,
                      max: Number(process.env.PGPOOL_MAX) || 10,
                  }
                : {
                      connectionString: stripSslQueryParams(raw),
                      max: Number(process.env.PGPOOL_MAX) || 10,
                      ssl: { rejectUnauthorized: false },
                  },
        );
    }
    return pool;
}

export async function getMonths(): Promise<Month[]> {
    const result = await getPool().query(
        "SELECT month_id, name FROM months ORDER BY month_id",
    );
    return result.rows;
}

export async function getMonthsFromSupabase(): Promise<Month[]> {
    const supabase = createClient(getSupabaseUrl(), getSupabasePublishableKey());

    const { data, error } = await supabase
        .from("months")
        .select("month_id, name")
        .order("month_id", { ascending: true });

    if (error) {
        console.error("Error fetching months from Supabase:", error);
        return [];
    }

    return data || [];
}

export async function getPrediction(
    sign: string,
    monthId: number,
    category: string,
): Promise<Prediction | null> {
    const result = await getPool().query(
        `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
     WHERE sign = $1 AND month_id = $2 AND category = $3`,
        [sign, monthId, category],
    );
    return result.rows[0] ?? null;
}

export async function getPredictionFromSupabase(
    sign: string,
    monthId: number,
    category: string,
): Promise<Prediction | null> {
    const supabase = createClient(getSupabaseUrl(), getSupabasePublishableKey());

    const { data, error } = await supabase
        .from("zodiac_predictions_2026")
        .select("id, sign, month_id, category, prediction")
        .eq("sign", sign)
        .eq("month_id", monthId)
        .eq("category", category)
        .single();

    if (error) {
        console.error("Error fetching prediction from Supabase:", error);
        return null;
    }

    return data || null;
}

export async function getPredictionsForSignMonth(
    sign: string,
    monthId: number | null,
): Promise<Prediction[]> {
    if (monthId !== null && monthId !== undefined) {
        const result = await getPool().query(
            `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
       WHERE sign = $1 AND month_id = $2 ORDER BY category`,
            [sign, monthId],
        );
        return result.rows;
    }
    const result = await getPool().query(
        `SELECT id, sign, month_id, category, prediction FROM zodiac_predictions_2026
     WHERE sign = $1 ORDER BY month_id, category`,
        [sign],
    );
    return result.rows;
}

export async function getPredictionsForSignMonthFromSupabase(
    sign: string,
    monthId: number | null,
): Promise<Prediction[]> {
    const supabase = createClient(getSupabaseUrl(), getSupabasePublishableKey());

    let query = supabase
        .from("zodiac_predictions_2026")
        .select("id, sign, month_id, category, prediction")
        .eq("sign", sign);

    if (monthId !== null && monthId !== undefined) {
        query = query
            .eq("month_id", monthId)
            .order("category", { ascending: true });
    } else {
        query = query
            .order("month_id", { ascending: true })
            .order("category", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching predictions from Supabase:", error);
        return [];
    }

    return data || [];
}

export async function getDistinctSigns(): Promise<string[]> {
    const result = await getPool().query(
        "SELECT DISTINCT sign FROM zodiac_predictions_2026 ORDER BY sign",
    );
    return result.rows.map((row: { sign: string }) => row.sign);
}

export async function getDistinctSignsFromSupabase(): Promise<string[]> {
    const supabase = createClient(getSupabaseUrl(), getSupabasePublishableKey());

    const { data, error } = await supabase
        .from("zodiac_predictions_2026")
        .select("sign")
        .order("sign", { ascending: true });

    if (error) {
        console.error("Error fetching signs from Supabase:", error);
        return [];
    }

    const signs = new Set(data?.map((row: { sign: string }) => row.sign) || []);
    return Array.from(signs);
}
