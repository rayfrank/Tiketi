import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Ticket,
  CreditCard,
  ShieldCheck,
  QrCode,
  Mail,
  Phone,
  Plus,
  Filter,
  ArrowRight,
  Users,
} from "lucide-react";

// Tiketi UI Preview (single-file)
// - Pure UI demo: no Firebase wiring yet
// - Tailwind used for styling (works in preview)

type Category = "All" | "Concert" | "Tech" | "Sports" | "Education";

type EventItem = {
  id: string;
  title: string;
  category: Exclude<Category, "All">;
  venue: string;
  location: string;
  startsAt: string;
  priceKes: number;
  capacity: number;
  ticketsSold: number;
  description: string;
};

type CartLine = { eventId: string; qty: number };

type TicketItem = {
  id: string;
  ticketCode: string;
  eventTitle: string;
  startsAt: string;
  venue: string;
  location: string;
  status: "Valid" | "Checked-in";
};

const sampleEvents: EventItem[] = [
  {
    id: "ev_001",
    title: "Nairobi Night Drive: Car Culture Meetup",
    category: "Tech",
    venue: "The Alchemist",
    location: "Westlands, Nairobi",
    startsAt: "Sat, Feb 14 • 6:00 PM",
    priceKes: 1500,
    capacity: 300,
    ticketsSold: 128,
    description:
      "A Nairobi car-culture + creator meetup: short talks, photo walk, and a safe night drive convoy. Bring your camera, your crew, and your best fit.",
  },
  {
    id: "ev_002",
    title: "Afro-Fusion Live: Rooftop Session",
    category: "Concert",
    venue: "Broadway Rooftop",
    location: "Kiambu Road, Nairobi",
    startsAt: "Fri, Mar 6 • 7:30 PM",
    priceKes: 2500,
    capacity: 180,
    ticketsSold: 160,
    description:
      "An intimate rooftop performance featuring Afro-fusion artists, live band, and curated cocktails. Limited capacity.",
  },
  {
    id: "ev_003",
    title: "USIU IT Club: Cyberverse Demo Day",
    category: "Education",
    venue: "USIU Auditorium",
    location: "Thika Rd, Nairobi",
    startsAt: "Wed, Apr 1 • 2:00 PM",
    priceKes: 0,
    capacity: 500,
    ticketsSold: 342,
    description:
      "Student showcase for cybersecurity learning games. See live demos, meet teams, and vote for the best track.",
  },
  {
    id: "ev_004",
    title: "Padel & Chill Tournament",
    category: "Sports",
    venue: "Vipingo Ridge Courts",
    location: "Kilifi County",
    startsAt: "Sun, Apr 19 • 9:00 AM",
    priceKes: 1200,
    capacity: 120,
    ticketsSold: 77,
    description:
      "Friendly bracket tournament + brunch. Beginners welcome. Pair up or get matched on arrival.",
  },
];

const sampleTickets: TicketItem[] = [
  {
    id: "t_001",
    ticketCode: "TCK-9X2KQ-KE",
    eventTitle: "Afro-Fusion Live: Rooftop Session",
    startsAt: "Fri, Mar 6 • 7:30 PM",
    venue: "Broadway Rooftop",
    location: "Kiambu Road, Nairobi",
    status: "Valid",
  },
  {
    id: "t_002",
    ticketCode: "TCK-4H7LM-KE",
    eventTitle: "USIU IT Club: Cyberverse Demo Day",
    startsAt: "Wed, Apr 1 • 2:00 PM",
    venue: "USIU Auditorium",
    location: "Thika Rd, Nairobi",
    status: "Checked-in",
  },
];

function kes(n: number) {
  return new Intl.NumberFormat("en-KE").format(n);
}

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const Chip: React.FC<{ active?: boolean; children: React.ReactNode; onClick?: () => void }>
  = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={clsx(
        "px-3 py-1.5 rounded-full border text-sm transition",
        active
          ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );

const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: string }>
  = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-white/70">{icon}</div>
      <div className="leading-tight">
        <div className="text-[11px] text-white/60">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );

const SectionTitle: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }>
  = ({ title, subtitle, right }) => (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-white/60 mt-1">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );

const Field: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}> = ({ label, placeholder, value, onChange, type = "text" }) => (
  <label className="block">
    <div className="text-xs text-white/60 mb-1">{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
    />
  </label>
);

const Select: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}> = ({ label, value, onChange, options }) => (
  <label className="block">
    <div className="text-xs text-white/60 mb-1">{label}</div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-slate-900">
          {o.label}
        </option>
      ))}
    </select>
  </label>
);

const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
      disabled
        ? "bg-white/10 text-white/40 cursor-not-allowed"
        : "bg-emerald-500 text-slate-900 hover:bg-emerald-400",
      className
    )}
  >
    {children}
  </button>
);

const GhostButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition border",
      "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
      className
    )}
  >
    {children}
  </button>
);

const EventCard: React.FC<{
  ev: EventItem;
  onOpen: () => void;
  onAdd: () => void;
}> = ({ ev, onOpen, onAdd }) => {
  const pct = Math.min(100, Math.round((ev.ticketsSold / ev.capacity) * 100));
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/7 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs rounded-full border border-white/10 bg-black/20 px-2 py-1 text-white/70">
              {ev.category}
            </span>
            {ev.priceKes === 0 ? (
              <span className="text-xs rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                Free
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-base font-semibold text-white leading-snug">
            {ev.title}
          </h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Calendar className="h-4 w-4" />
              <span>{ev.startsAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4" />
              <span>{ev.venue} • {ev.location}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">From</div>
          <div className="text-lg font-bold text-white">KES {kes(ev.priceKes)}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>{ev.ticketsSold} sold</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-emerald-400/60" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <GhostButton onClick={onOpen} className="flex-1">
          View <ArrowRight className="h-4 w-4" />
        </GhostButton>
        <PrimaryButton onClick={onAdd} className="flex-1">
          <Ticket className="h-4 w-4" /> Add
        </PrimaryButton>
      </div>

      <div className="mt-3 text-xs text-white/50">
        Secure checkout • ticket sent via Email + SMS
      </div>
    </div>
  );
};

const Drawer: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }>
  = ({ open, onClose, title, children }) => (
    <div className={clsx("fixed inset-0 z-40", open ? "" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/60 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={clsx(
          "absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-slate-950/90 backdrop-blur-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Tiketi</div>
            <div className="text-lg font-semibold text-white">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );

const QRMock: React.FC = () => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between">
      <div className="text-sm font-semibold text-white">QR Ticket</div>
      <QrCode className="h-5 w-5 text-white/70" />
    </div>
    <div className="mt-3 grid place-items-center">
      <div className="h-44 w-44 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 grid place-items-center">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                "h-4 w-4 rounded-sm",
                [0, 1, 3, 4, 5, 7, 10, 12, 14, 15, 17, 19, 22, 24].includes(i)
                  ? "bg-emerald-300/80"
                  : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>
    </div>
    <div className="mt-3 text-xs text-white/60">
      Present this QR at the gate • Offline scanning supported
    </div>
  </div>
);

export default function TiketiUIPreview() {
  type View = "Explore" | "Checkout" | "My Tickets" | "Admin";
  const [view, setView] = useState<View>("Explore");
  const [category, setCategory] = useState<Category>("All");
  const [queryText, setQueryText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);

  const selectedEvent = useMemo(
    () => sampleEvents.find((e) => e.id === selectedId) || null,
    [selectedId]
  );

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return sampleEvents
      .filter((e) => (category === "All" ? true : e.category === category))
      .filter((e) =>
        q
          ? [e.title, e.venue, e.location, e.description]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true
      );
  }, [category, queryText]);

  const cartLines = useMemo(() => {
    return cart
      .map((line) => {
        const ev = sampleEvents.find((e) => e.id === line.eventId);
        if (!ev) return null;
        return { ev, qty: line.qty, lineTotal: ev.priceKes * line.qty };
      })
      .filter(Boolean) as { ev: EventItem; qty: number; lineTotal: number }[];
  }, [cart]);

  const cartTotal = useMemo(
    () => cartLines.reduce((s, x) => s + x.lineTotal, 0),
    [cartLines]
  );

  const addToCart = (eventId: string) => {
    setCart((prev) => {
      const found = prev.find((p) => p.eventId === eventId);
      if (found) return prev.map((p) => (p.eventId === eventId ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { eventId, qty: 1 }];
    });
  };

  const inc = (eventId: string) => {
    setCart((prev) => prev.map((p) => (p.eventId === eventId ? { ...p, qty: p.qty + 1 } : p)));
  };

  const dec = (eventId: string) => {
    setCart((prev) =>
      prev
        .map((p) => (p.eventId === eventId ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeLine = (eventId: string) => {
    setCart((prev) => prev.filter((p) => p.eventId !== eventId));
  };

  const cartCount = useMemo(() => cart.reduce((s, x) => s + x.qty, 0), [cart]);

  // --- Auth mock UI state
  const [authMode, setAuthMode] = useState<"Login" | "Signup">("Login");
  const [isAuthed, setIsAuthed] = useState(true);

  // checkout form mock
  const [buyerName, setBuyerName] = useState("Rayfrank");
  const [buyerEmail, setBuyerEmail] = useState("ray@example.com");
  const [buyerPhone, setBuyerPhone] = useState("+2547XXXXXXXX");

  // admin form mock
  const [adminTitle, setAdminTitle] = useState("USIU IT Club: Cyberverse Demo Day");
  const [adminCat, setAdminCat] = useState<Exclude<Category, "All">>("Education");
  const [adminVenue, setAdminVenue] = useState("USIU Auditorium");
  const [adminLocation, setAdminLocation] = useState("Thika Rd, Nairobi");
  const [adminDate, setAdminDate] = useState("2026-04-01 14:00");
  const [adminPrice, setAdminPrice] = useState("0");
  const [adminCap, setAdminCap] = useState("500");

  const topStats = (
    <div className="flex flex-wrap gap-2">
      <StatPill icon={<ShieldCheck className="h-4 w-4" />} label="Security" value="Webhook Verified" />
      <StatPill icon={<Mail className="h-4 w-4" />} label="Delivery" value="Email Ticket" />
      <StatPill icon={<Phone className="h-4 w-4" />} label="Delivery" value="SMS Ticket" />
      <StatPill icon={<QrCode className="h-4 w-4" />} label="Entry" value="QR Scan" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950/20 text-white">
      {/* Top Nav */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400/15 border border-emerald-300/20 grid place-items-center">
              <Ticket className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-xs text-white/60">Ticketing Platform</div>
              <div className="text-lg font-semibold tracking-tight">Tiketi</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {(["Explore", "Checkout", "My Tickets", "Admin"] as View[]).map((t) => (
              <Chip key={t} active={view === t} onClick={() => setView(t)}>
                {t}
              </Chip>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("Checkout")}
              className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Cart
              </span>
              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-2 h-6 min-w-6 px-1 grid place-items-center rounded-full bg-emerald-400 text-slate-900 text-xs font-bold">
                  {cartCount}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setIsAuthed((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10"
              title="Toggle auth (preview)"
            >
              {isAuthed ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <ShieldCheck className="h-4 w-4" /> Secure payments • instant ticket delivery
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Find events. Pay. Get your ticket by <span className="text-emerald-200">Email + SMS</span>.
            </h1>
            <p className="mt-3 text-white/65 max-w-2xl">
              A clean ticketing UI for Kenya: explore events, checkout fast, and scan QR at the gate.
              This is a preview-only build (no Firebase wired yet).
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Search events, venues, locations…"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/35 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="h-4 w-4 text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="pl-10 pr-10 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm text-white outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  >
                    {(["All", "Concert", "Tech", "Sports", "Education"] as Category[]).map((c) => (
                      <option key={c} value={c} className="bg-slate-950">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <PrimaryButton onClick={() => setView("Explore")}>
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
              </div>
            </div>

            <div className="mt-6">{topStats}</div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60">Checkout Preview</div>
                  <div className="text-base font-semibold">How delivery works</div>
                </div>
                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-black/20 grid place-items-center">
                  <Mail className="h-5 w-5 text-white/75" />
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <CreditCard className="h-4 w-4 text-emerald-200" /> Pay securely
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    Payment is verified via webhook before we issue tickets.
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Mail className="h-4 w-4 text-emerald-200" /> Email ticket
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    PDF or link ticket gets delivered instantly.
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Phone className="h-4 w-4 text-emerald-200" /> SMS backup
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    Ticket code + QR link sent to your phone number.
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <GhostButton onClick={() => setView("Checkout")} className="w-full">
                  Go to Checkout UI <ArrowRight className="h-4 w-4" />
                </GhostButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {view === "Explore" ? (
          <>
            <SectionTitle
              title="Explore Events"
              subtitle="Browse, filter, and add tickets to cart."
              right={<div className="text-sm text-white/60">{filtered.length} results</div>}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((ev) => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  onOpen={() => setSelectedId(ev.id)}
                  onAdd={() => addToCart(ev.id)}
                />
              ))}
            </div>
          </>
        ) : null}

        {view === "Checkout" ? (
          <>
            <SectionTitle
              title="Checkout"
              subtitle="Confirm details, then pay. After verification, we deliver your ticket by Email + SMS."
            />

            {!isAuthed ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/60">Authentication</div>
                      <div className="text-lg font-semibold">{authMode}</div>
                    </div>
                    <Chip onClick={() => setAuthMode((m) => (m === "Login" ? "Signup" : "Login"))}>
                      Switch to {authMode === "Login" ? "Signup" : "Login"}
                    </Chip>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {authMode === "Signup" ? (
                      <Field label="Full name" value={buyerName} onChange={setBuyerName} placeholder="Your name" />
                    ) : null}
                    <Field label="Email" value={buyerEmail} onChange={setBuyerEmail} placeholder="you@example.com" />
                    <Field label="Password" value={""} onChange={() => {}} placeholder="••••••••" type="password" />
                    {authMode === "Signup" ? (
                      <Field label="Phone" value={buyerPhone} onChange={setBuyerPhone} placeholder="+2547…" />
                    ) : null}
                  </div>

                  <PrimaryButton
                    className="w-full mt-4"
                    onClick={() => setIsAuthed(true)}
                  >
                    {authMode === "Login" ? "Login" : "Create account"}
                    <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>

                  <div className="mt-3 text-xs text-white/55">
                    (Preview) In the real app this connects to Firebase Auth.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold">Your cart</div>
                  <div className="mt-3 text-sm text-white/60">Login to proceed with payment.</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-7">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/60">Buyer details</div>
                        <div className="text-lg font-semibold">Confirm your delivery info</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                        Saved to account
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Full name" value={buyerName} onChange={setBuyerName} />
                      <Field label="Phone" value={buyerPhone} onChange={setBuyerPhone} />
                      <div className="md:col-span-2">
                        <Field label="Email" value={buyerEmail} onChange={setBuyerEmail} />
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                      Tickets will be sent to your email and also by SMS as a backup.
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/60">Cart</div>
                        <div className="text-lg font-semibold">Review tickets</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Users className="h-4 w-4" /> {cartCount} tickets
                      </div>
                    </div>

                    {cartLines.length === 0 ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
                        Your cart is empty. Go back to Explore and add an event.
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {cartLines.map(({ ev, qty, lineTotal }) => (
                          <div
                            key={ev.id}
                            className="rounded-2xl border border-white/10 bg-black/20 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold">{ev.title}</div>
                                <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
                                  <Calendar className="h-4 w-4" /> {ev.startsAt}
                                </div>
                                <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
                                  <MapPin className="h-4 w-4" /> {ev.venue} • {ev.location}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-white/60">Line total</div>
                                <div className="text-lg font-bold">KES {kes(lineTotal)}</div>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                <button
                                  onClick={() => dec(ev.id)}
                                  className="h-8 w-8 rounded-lg border border-white/10 bg-black/20 hover:bg-white/10"
                                >
                                  −
                                </button>
                                <div className="text-sm font-semibold w-10 text-center">{qty}</div>
                                <button
                                  onClick={() => inc(ev.id)}
                                  className="h-8 w-8 rounded-lg border border-white/10 bg-black/20 hover:bg-white/10"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeLine(ev.id)}
                                className="text-sm text-white/60 hover:text-white"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-xs text-white/60">Summary</div>
                    <div className="text-lg font-semibold">Total</div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>Subtotal</span>
                        <span>KES {kes(cartTotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-white/70 mt-2">
                        <span>Fees</span>
                        <span>KES 0</span>
                      </div>
                      <div className="h-px bg-white/10 my-3" />
                      <div className="flex items-center justify-between text-base font-bold">
                        <span>Total</span>
                        <span>KES {kes(cartTotal)}</span>
                      </div>
                    </div>

                    <PrimaryButton
                      className="w-full mt-4"
                      disabled={cartTotal <= 0}
                      onClick={() => setView("My Tickets")}
                    >
                      Pay Now <CreditCard className="h-4 w-4" />
                    </PrimaryButton>

                    <div className="mt-3 text-xs text-white/55">
                      (Preview) This button would redirect to your payment provider.
                      After webhook verification, tickets appear in “My Tickets”.
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <QRMock />
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold">Security note</div>
                      <div className="text-xs text-white/60 mt-1">
                        Tickets are issued only after the backend webhook confirms payment.
                        This prevents fake “success pages”.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}

        {view === "My Tickets" ? (
          <>
            <SectionTitle
              title="My Tickets"
              subtitle="View your purchased tickets and show QR at the gate."
              right={<Chip onClick={() => setView("Explore")}>Buy more</Chip>}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sampleTickets.map((t) => (
                    <div key={t.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs text-white/60">Ticket code</div>
                          <div className="text-base font-semibold">{t.ticketCode}</div>
                        </div>
                        <span
                          className={clsx(
                            "text-xs rounded-full px-2 py-1 border",
                            t.status === "Valid"
                              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                              : "border-white/10 bg-black/20 text-white/60"
                          )}
                        >
                          {t.status}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-semibold">{t.eventTitle}</div>
                        <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {t.startsAt}
                        </div>
                        <div className="mt-1 text-xs text-white/60 flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> {t.venue} • {t.location}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <PrimaryButton className="flex-1" onClick={() => setSelectedId("ev_002")}>
                          Show QR <QrCode className="h-4 w-4" />
                        </PrimaryButton>
                        <GhostButton className="flex-1" onClick={() => setView("Explore")}>
                          Event
                        </GhostButton>
                      </div>

                      <div className="mt-3 text-xs text-white/55">
                        Delivered to: Email + SMS
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-white/60">Tip</div>
                  <div className="text-lg font-semibold">Gate scanning</div>
                  <div className="mt-2 text-sm text-white/65">
                    Staff scans your QR (or uses your ticket code) to validate entry.
                    Your ticket can be marked <b>Checked-in</b> to prevent reuse.
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <QrCode className="h-4 w-4 text-emerald-200" /> QR contains a secure ticket ID
                      </div>
                      <div className="text-xs text-white/60 mt-1">Your backend verifies it in Firestore.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-emerald-200" /> Anti-fraud
                      </div>
                      <div className="text-xs text-white/60 mt-1">Tickets are created only after webhook payment confirmation.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {view === "Admin" ? (
          <>
            <SectionTitle
              title="Admin"
              subtitle="Create and publish events (preview UI)."
              right={
                <PrimaryButton onClick={() => setView("Explore")}>
                  Back to Explore <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/60">Create event</div>
                      <div className="text-lg font-semibold">New listing</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                      Admin only
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <Field label="Title" value={adminTitle} onChange={setAdminTitle} />
                    </div>
                    <Select
                      label="Category"
                      value={adminCat}
                      onChange={(v) => setAdminCat(v as any)}
                      options={
                        (["Concert", "Tech", "Sports", "Education"] as Exclude<Category, "All">[]).map((c) => ({
                          label: c,
                          value: c,
                        }))
                      }
                    />
                    <Field label="Date & time" value={adminDate} onChange={setAdminDate} placeholder="YYYY-MM-DD HH:mm" />
                    <Field label="Venue" value={adminVenue} onChange={setAdminVenue} />
                    <Field label="Location" value={adminLocation} onChange={setAdminLocation} />
                    <Field label="Price (KES)" value={adminPrice} onChange={setAdminPrice} type="number" />
                    <Field label="Capacity" value={adminCap} onChange={setAdminCap} type="number" />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm font-semibold">Poster upload</div>
                    <div className="text-xs text-white/60 mt-1">
                      In the real app this uploads to Firebase Storage and saves the URL in Firestore.
                    </div>
                    <div className="mt-3">
                      <input type="file" className="block w-full text-sm text-white/70" />
                    </div>
                  </div>

                  <PrimaryButton
                    className="w-full mt-4"
                    onClick={() => {
                      // preview only
                      setView("Explore");
                    }}
                  >
                    <Plus className="h-4 w-4" /> Publish event
                  </PrimaryButton>

                  <div className="mt-3 text-xs text-white/55">
                    (Preview) Firestore rules restrict this to admins.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs text-white/60">Organizer tools</div>
                  <div className="text-lg font-semibold">At-a-glance</div>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Sales</div>
                        <span className="text-xs text-white/60">Today</span>
                      </div>
                      <div className="mt-2 text-2xl font-bold">KES 84,000</div>
                      <div className="text-xs text-white/60 mt-1">(Mock) Based on ticket orders</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Check-ins</div>
                        <span className="text-xs text-white/60">Gate</span>
                      </div>
                      <div className="mt-2 text-2xl font-bold">112</div>
                      <div className="text-xs text-white/60 mt-1">(Mock) QR scanner app updates ticket status</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="h-4 w-4 text-emerald-200" /> Anti-fraud controls
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        Webhook-confirmed issuance + one-time check-in prevents duplicates.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Event Details Drawer */}
      <Drawer
        open={!!selectedEvent}
        onClose={() => setSelectedId(null)}
        title={selectedEvent ? selectedEvent.title : "Event"}
      >
        {selectedEvent ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs rounded-full border border-white/10 bg-black/20 px-2 py-1 text-white/70">
                {selectedEvent.category}
              </span>
              <span className="text-xs rounded-full border border-white/10 bg-black/20 px-2 py-1 text-white/70">
                Capacity {selectedEvent.capacity}
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Calendar className="h-4 w-4" /> {selectedEvent.startsAt}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/75">
                <MapPin className="h-4 w-4" /> {selectedEvent.venue} • {selectedEvent.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/75">
                <Ticket className="h-4 w-4" /> From KES {kes(selectedEvent.priceKes)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              {selectedEvent.description}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">What you get</div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-200" /> Email ticket</li>
                  <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-200" /> SMS backup</li>
                  <li className="flex items-center gap-2"><QrCode className="h-4 w-4 text-emerald-200" /> QR for scanning</li>
                </ul>
              </div>
              <QRMock />
            </div>

            <div className="flex gap-2">
              <PrimaryButton
                className="flex-1"
                onClick={() => {
                  addToCart(selectedEvent.id);
                  setSelectedId(null);
                  setView("Checkout");
                }}
              >
                <Ticket className="h-4 w-4" /> Add to cart
              </PrimaryButton>
              <GhostButton
                className="flex-1"
                onClick={() => {
                  setSelectedId(null);
                  setView("Explore");
                }}
              >
                Continue browsing
              </GhostButton>
            </div>
          </div>
        ) : null}
      </Drawer>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-4 gap-2">
          {(["Explore", "Checkout", "My Tickets", "Admin"] as View[]).map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={clsx(
                "rounded-xl px-2 py-2 text-xs border transition",
                view === t
                  ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                  : "bg-white/5 border-white/10 text-white/75"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
