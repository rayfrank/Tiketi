import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Calendar, Ticket, CheckCircle2 } from "lucide-react";
import { ui, cx } from "../ui/classes";
import { events, type EventCategory, type EventItem } from "../data/events";
import { kes } from "../lib/money";

type CategoryFilter = EventCategory | "All";

const categories: CategoryFilter[] = [
    "All",
    "Concerts",
    "Campus",
    "Tech",
    "Sports",
    "Comedy",
    "Culture",
    "Business",
];

function Poster({ hint }: { hint: EventItem["posterHint"] }) {
    const band =
        hint === "Coast"
            ? "from-kenya-green/35 via-white/5 to-kenya-red/25"
            : hint === "Campus"
                ? "from-kenya-red/28 via-white/5 to-kenya-green/35"
                : hint === "Arena"
                    ? "from-kenya-gold/25 via-white/5 to-kenya-green/22"
                    : "from-white/10 via-white/5 to-kenya-green/18";

    return (
        <div className="h-24 w-24 rounded-2xl border border-white/10 bg-black/30 overflow-hidden relative soft-pulse poster-light">
            <div className={cx("absolute inset-0 bg-gradient-to-br", band)} />
            <div className="absolute inset-0 bg-black/25" />

            {/* Kenyan bars */}
            <div className="absolute bottom-2 left-2 h-2 w-10 rounded-full bg-kenya-green/80" />
            <div className="absolute bottom-2 left-[3.2rem] h-2 w-6 rounded-full bg-kenya-red/80" />

            {/* subtle corner badge */}
            <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-white/35" />
        </div>
    );
}

function Chip({
    active,
    children,
    onClick,
}: {
    active?: boolean;
    children: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cx(
                "tap bounce sheen px-3 py-2 rounded-full text-xs border transition whitespace-nowrap",
                active
                    ? "bg-kenya-green/18 border-kenya-green/45 text-white glow-green"
                    : "bg-white/5 border-white/10 text-white/75"
            )}
        >
            {children}
        </button>
    );
}

export default function Explore() {
    const [cat, setCat] = useState<CategoryFilter>("All");
    const [q, setQ] = useState("");
    const [cart, setCart] = useState<Record<string, number>>({});

    // Toast
    const [toast, setToast] = useState<string | null>(null);
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 1400);
        return () => clearTimeout(t);
    }, [toast]);

    const list = useMemo(() => {
        const query = q.trim().toLowerCase();
        return events
            .filter((e) => (cat === "All" ? true : e.category === cat))
            .filter((e) => {
                if (!query) return true;
                const blob = `${e.title} ${e.venue} ${e.town} ${e.tags.join(" ")}`.toLowerCase();
                return blob.includes(query);
            });
    }, [cat, q]);

    const cartCount = useMemo(
        () => Object.values(cart).reduce((s, n) => s + n, 0),
        [cart]
    );

    const add = (id: string, title: string) => {
        setCart((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
        setToast(`Added: ${title}`);
    };

    return (
        <div className={ui.page}>
            {/* Grain overlay */}
            <div className="pointer-events-none fixed inset-0 bg-grain" />

            <div className={ui.container}>
                {/* Header */}
                <div className="mt-5">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="text-xs text-white/60">Discover</div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Events near you
                            </h1>
                        </div>

                        <div className="text-right">
                            <div className="text-xs text-white/60">Cart</div>
                            <div className="text-sm font-bold">
                                <span className="text-kenya-green">{cartCount}</span>{" "}
                                <span className="text-white/70">tickets</span>
                            </div>
                        </div>
                    </div>

                    {/* Kenyan accent strip */}
                    <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-kenya-green/85 glow-green" />
                        <div className="h-1.5 w-10 rounded-full bg-white/20" />
                        <div className="h-1.5 w-8 rounded-full bg-kenya-red/85 glow-red" />
                    </div>

                    {/* Search */}
                    <div className="mt-3 border-grad rounded-2xl">
                        <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl focus-within:border-kenya-green/45 focus-within:ring-2 focus-within:ring-kenya-green/15 transition">
                            <Search className="h-4 w-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search Nairobi, USIU, Vipingo, comedy…"
                                className={cx(ui.input, "pl-9 bg-transparent border-0 focus:ring-0")}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                        {categories.map((c) => (
                            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
                                {c}
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* Events list */}
                <div className="mt-4 space-y-3">
                    {list.map((e, i) => (
                        <div
                            key={e.id}
                            className={cx(
                                ui.card,
                                "p-4 flex gap-3 border-grad lift fade-up shimmer energy-ring"
                            )}
                            style={{ animationDelay: `${i * 45}ms` }}
                        >
                            <Poster hint={e.posterHint} />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="text-xs text-white/60">{e.category}</div>
                                        <div className="text-base font-semibold leading-snug truncate">
                                            {e.title}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-white/60">From</div>
                                        <div className="text-sm font-bold">
                                            {e.priceKes === 0 ? (
                                                <span className="text-kenya-green">Free</span>
                                            ) : (
                                                <>KES {kes(e.priceKes)}</>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-col gap-1 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{e.dateLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">
                                            {e.venue} • {e.town}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="flex gap-2 flex-wrap">
                                        {e.tags.slice(0, 2).map((t) => (
                                            <span
                                                key={t}
                                                className="text-[11px] rounded-full border border-white/10 bg-black/25 px-2 py-1 text-white/70"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => add(e.id, e.title)}
                                        className={cx(
                                            ui.btnPrimary,
                                            "inline-flex items-center gap-2 sheen bounce glow-green"
                                        )}
                                    >
                                        <Ticket className="h-4 w-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {list.length === 0 ? (
                        <div className={cx(ui.card, "p-5 text-white/70")}>
                            No events found. Try a different keyword or category.
                        </div>
                    ) : null}
                </div>

                <div className="h-10" />
            </div>

            {/* Toast */}
            {toast ? (
                <div className="fixed bottom-20 left-0 right-0 px-4 z-50">
                    <div className="mx-auto max-w-[520px] toast-in">
                        <div className="rounded-2xl border border-white/10 bg-kenya-black/90 backdrop-blur px-4 py-3 flex items-center gap-2 glow-green">
                            <CheckCircle2 className="h-5 w-5 text-kenya-green" />
                            <div className="text-sm text-white/90 truncate">{toast}</div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
