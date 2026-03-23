import Image from "next/image";
import { getMonthsFromSupabase } from "@/lib/db";
import LandingSentence from "./components/LandingSentence";

export default async function HomePage() {
    const months = await getMonthsFromSupabase();
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-2xl">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/Logo_LunarCookie.png"
                        alt="Lunar Cookie"
                        width={220}
                        height={48}
                        priority
                    />
                </div>
                <LandingSentence months={months} />
            </div>
        </main>
    );
}
