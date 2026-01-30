import { Ticket } from "lucide-react";
import { ui } from "../ui/classes";

export default function TopBar() {
    return (
        <div className="sticky top-0 z-40 border-b border-white/10 bg-kenya-black/80 backdrop-blur">
            <div className={`${ui.container} py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
                        <Ticket className="h-5 w-5 text-kenya-green" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-xs text-white/60">Rayfrank Kenyan ticketing</div>
                        <div className="text-lg font-semibold tracking-tight">Tiketi</div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <div className="h-2 w-10 rounded-full bg-kenya-green/70" />
                    <div className="h-2 w-6 rounded-full bg-kenya-red/70" />
                </div>
            </div>
        </div>
    );
}
