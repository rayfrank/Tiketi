import { NavLink } from "react-router-dom";
import { Compass, CreditCard, QrCode } from "lucide-react";
import { cx } from "../ui/classes";

const item = "flex flex-col items-center gap-1 py-2 text-xs tap";
const active = "text-kenya-green";
const idle = "text-white/70";

export default function BottomNav() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-kenya-black/90 backdrop-blur">
            <div className="mx-auto max-w-[980px] px-4 grid grid-cols-3">
                <NavLink to="/" className={({ isActive }) => cx(item, isActive ? active : idle)}>
                    <Compass className="h-5 w-5" />
                    Explore
                </NavLink>
                <NavLink to="/checkout" className={({ isActive }) => cx(item, isActive ? active : idle)}>
                    <CreditCard className="h-5 w-5" />
                    Checkout
                </NavLink>
                <NavLink to="/tickets" className={({ isActive }) => cx(item, isActive ? active : idle)}>
                    <QrCode className="h-5 w-5" />
                    Tickets
                </NavLink>
            </div>
        </div>
    );
}
