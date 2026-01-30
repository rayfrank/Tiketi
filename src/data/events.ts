export type EventCategory =
    | "Concerts"
    | "Campus"
    | "Tech"
    | "Sports"
    | "Comedy"
    | "Culture"
    | "Business";

export type EventItem = {
    id: string;
    title: string;
    category: EventCategory;
    venue: string;
    town: string;
    dateLabel: string;
    priceKes: number;
    posterHint: "Nairobi" | "Coast" | "Campus" | "Arena";
    tags: string[];
};

export const events: EventItem[] = [
    {
        id: "ev1",
        title: "Nairobi Nights: Amapiano & Afrobeats",
        category: "Concerts",
        venue: "KICC Rooftop",
        town: "CBD, Nairobi",
        dateLabel: "Sat • 7:00 PM",
        priceKes: 2500,
        posterHint: "Nairobi",
        tags: ["18+", "Rooftop", "Dress code"],
    },
    {
        id: "ev2",
        title: "USIU IT Club: Cyberverse Demo Day",
        category: "Campus",
        venue: "USIU Auditorium",
        town: "Thika Rd, Nairobi",
        dateLabel: "Wed • 2:00 PM",
        priceKes: 0,
        posterHint: "Campus",
        tags: ["Free", "Showcase", "Networking"],
    },
    {
        id: "ev3",
        title: "Stand-up Night: Kenyan Comics Live",
        category: "Comedy",
        venue: "The Alchemist",
        town: "Westlands, Nairobi",
        dateLabel: "Fri • 8:30 PM",
        priceKes: 1800,
        posterHint: "Nairobi",
        tags: ["Date night", "Bar"],
    },
    {
        id: "ev4",
        title: "Padel & Chill Tournament",
        category: "Sports",
        venue: "Vipingo Ridge Courts",
        town: "Kilifi County",
        dateLabel: "Sun • 9:00 AM",
        priceKes: 1200,
        posterHint: "Coast",
        tags: ["Beginner friendly", "Brunch"],
    },
    {
        id: "ev5",
        title: "Nairobi Tech Mixer: Startups & Creators",
        category: "Tech",
        venue: "iHub",
        town: "Sarit, Nairobi",
        dateLabel: "Thu • 6:00 PM",
        priceKes: 500,
        posterHint: "Nairobi",
        tags: ["Pitch", "Networking", "Hiring"],
    },
    {
        id: "ev6",
        title: "Culture Day: Food, Fashion & Art",
        category: "Culture",
        venue: "Uhuru Gardens",
        town: "Lang’ata, Nairobi",
        dateLabel: "Sat • 11:00 AM",
        priceKes: 300,
        posterHint: "Arena",
        tags: ["Family", "Food", "Art"],
    },
];
