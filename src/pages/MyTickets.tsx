import { ui } from "../ui/classes";

export default function MyTickets() {
    return (
        <div className={ui.page}>
            <div className={ui.container}>
                <h1 className="text-2xl font-semibold mt-6">My Tickets</h1>
                <p className="text-white/60 mt-2">
                    Next: QR ticket cards + download/share.
                </p>
            </div>
        </div>
    );
}
