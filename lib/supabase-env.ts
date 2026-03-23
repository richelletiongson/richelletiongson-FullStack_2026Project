/**
 * Supabase public env vars used by this app.
 * Supports both project-specific and Supabase-dashboard-style names.
 */
export function getSupabaseUrl(): string {
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

/** anon / publishable key — same JWT, different env name conventions */
export function getSupabasePublishableKey(): string {
    return (
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        ""
    );
}
