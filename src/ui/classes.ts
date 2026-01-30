export const cx = (...c: Array<string | false | undefined>) =>
    c.filter(Boolean).join(" ");

export const ui = {
    page: "min-h-screen pb-24",
    container: "mx-auto max-w-[980px] px-4",
    card: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
    input:
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-kenya-green/60 focus:ring-2 focus:ring-kenya-green/15 placeholder:text-white/35",
    btnPrimary:
        "rounded-xl bg-kenya-green px-4 py-3 text-sm font-semibold text-kenya-black tap",
    btnGhost:
        "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 tap",
};
