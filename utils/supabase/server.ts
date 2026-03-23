import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
    getSupabasePublishableKey,
    getSupabaseUrl,
} from "../../lib/supabase-env";

export function createClient(cookieStore: any) {
    return createServerClient(
        getSupabaseUrl(),
        getSupabasePublishableKey(),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
}
