import { ui } from "../ui/classes";

export default function Checkout() {
    return (
        <div className={ui.page}>
            <div className={ui.container}>
                <h1 className="text-2xl font-semibold mt-6">Checkout</h1>
                <p className="text-white/60 mt-2">
                    Next: cart items + buyer details + payment flow.
                </p>
            </div>
        </div>
    );
}
