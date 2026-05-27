import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import {
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  Package,
  Globe,
  Zap,
  CheckCircle2,
  TrendingUp,
  Timer,
  Star,
  Package2,
  Truck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── data ────────────────────────────────────────────────── */

const MARQUEE_ITEMS = [
  "SAME-DAY LOCAL",
  "REAL-TIME TRACKING",
  "FULLY INSURED",
  "36 STATES COVERED",
  "48-HR INTERSTATE",
  "INSTANT RECEIPT",
  "PHOTO DELIVERY PROOF",
  "24/7 SUPPORT",
];

const ZONES = [
  {
    name: "Local",
    tagline: "Within your city",
    time: "Same day",
    from: "₦1,720",
    icon: MapPin,
    features: ["Door-to-door pickup", "Same-day delivery", "Live GPS tracking"],
    highlight: false,
  },
  {
    name: "Interstate",
    tagline: "City to city",
    time: "24 – 48 hrs",
    from: "₦4,293",
    icon: Truck,
    features: ["Scheduled pickup", "Insured transit", "Status notifications"],
    highlight: true,
  },
  {
    name: "International",
    tagline: "Cross-border",
    time: "5 – 7 days",
    from: "₦14,295",
    icon: Globe,
    features: ["Customs clearance", "Full insurance cover", "Priority handling"],
    highlight: false,
  },
];

const BENTO_FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    body: "Same-day local & 48-hr interstate, guaranteed.",
    span: "col-span-1",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    body: "Follow every status change in real time from pickup to drop-off.",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    body: "Comprehensive transit coverage on every shipment we handle.",
    span: "col-span-1 md:col-span-2",
  },
  {
    icon: Package,
    title: "Any Package",
    body: "Small parcels to heavy freight — all categories handled safely.",
    span: "col-span-1",
  },
  {
    icon: Globe,
    title: "Nationwide",
    body: "All 36 Nigerian states plus international destinations.",
    span: "col-span-1",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    body: "Round-the-clock help to resolve any delivery concern instantly.",
    span: "col-span-1",
  },
];

const STATS = [
  { value: "10K+", label: "Businesses served", icon: Users },
  { value: "98%", label: "On-time delivery rate", icon: TrendingUp },
  { value: "36", label: "States covered", icon: Globe },
  { value: "< 2m", label: "Avg. booking time", icon: Timer },
];

const STEPS = [
  {
    n: "01",
    title: "Book Online",
    body: "Fill in sender & recipient details, package info and pay securely in minutes.",
  },
  {
    n: "02",
    title: "We Collect",
    body: "A verified driver arrives at your doorstep to collect the package.",
  },
  {
    n: "03",
    title: "Track Live",
    body: "Watch every status change on your dashboard or public tracking page.",
  },
  {
    n: "04",
    title: "Delivered",
    body: "Recipient receives the package with a photo proof-of-delivery.",
  },
];

const TESTIMONIALS = [
  {
    name: "Chidi Okonkwo",
    role: "Operations Manager",
    company: "Lagos Retail Co.",
    quote:
      "SwiftHaul cut our delivery complaints by 60%. The live tracking alone changed everything for us.",
    rating: 5,
  },
  {
    name: "Amara Osei",
    role: "Founder",
    company: "Kente Kreations",
    quote:
      "Booking takes two minutes, packages arrive the same day. I don't use anyone else anymore.",
    rating: 5,
  },
  {
    name: "Tunde Adeleke",
    role: "Supply Chain Lead",
    company: "PharmaDistrib NG",
    quote:
      "The photo proof-of-delivery feature ended our disputes with clients entirely. Brilliant product.",
    rating: 5,
  },
];

/* ─── component ───────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pt-6 pb-0">
        <div className="max-w-7xl mx-auto">
          <Card className="relative overflow-hidden border-white/[0.06] bg-[#09090b] min-h-[620px]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[100px]" />

            <div className="relative flex flex-col lg:flex-row min-h-[620px]">
              {/* Left */}
              <div className="flex-1 flex flex-col justify-center p-8 md:p-14 z-10">

                {/* Badge */}
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary tracking-wide mb-8 animate-fade-in">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse_soft" />
                  LIVE · Trusted by 10,000+ businesses
                </div>

                {/* Headline */}
                <h1 className="font-display font-bold leading-[1.0] tracking-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <span className="block text-5xl md:text-6xl lg:text-7xl text-white/90">
                    The fastest way
                  </span>
                  <span className="block text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent mt-1">
                    to deliver
                  </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl text-white/50 mt-2">
                    anything in Nigeria.
                  </span>
                </h1>

                <p className="text-white/50 text-base md:text-lg max-w-md leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  Door-to-door courier with live tracking, instant PDF receipts,
                  and delivery photo proof — across all 36 states.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <Button
                    asChild
                    size="lg"
                    className="gap-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                  >
                    <Link href="/register">
                      Start Shipping Free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link
                    href="/track"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:border-white/25 transition-all"
                  >
                    <Package2 className="h-4 w-4" />
                    Track a Package
                  </Link>
                </div>

                {/* Trust pills */}
                <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.4s" }}>
                  {["No hidden fees", "Insured delivery", "Real-time updates", "Instant receipt"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs text-white/40">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — 3D scene */}
              <div className="flex-1 relative min-h-[320px] lg:min-h-0">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="absolute inset-0 w-full h-full"
                />
                {/* Bottom fade so it blends into page */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className="relative flex overflow-hidden border-y border-border/60 bg-muted/30 py-3.5 my-10">
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-6 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {item}
              <span className="h-1 w-1 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="group relative rounded-2xl border border-border/70 bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4.5 w-4.5 text-primary h-[18px] w-[18px]" />
              </div>
              <p className="font-display text-3xl font-bold text-foreground tracking-tight">{value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Delivery Zones
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Choose your service
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Transparent pricing, no surprises. Every package ships with full tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ZONES.map(({ name, tagline, time, from, icon: Icon, features, highlight }) => (
              <div
                key={name}
                className={cn(
                  "relative rounded-2xl border p-7 flex flex-col gap-5 transition-all duration-300",
                  highlight
                    ? "border-primary bg-[#09090b] shadow-2xl shadow-primary/10 scale-[1.02]"
                    : "border-border/70 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
              >
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[10px] font-bold text-primary-foreground tracking-widest uppercase">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl mb-4",
                    highlight ? "bg-primary/20" : "bg-primary/10"
                  )}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className={cn("font-display text-xl font-bold", highlight && "text-white")}>
                    {name}
                  </h3>
                  <p className={cn("text-sm mt-0.5", highlight ? "text-white/50" : "text-muted-foreground")}>
                    {tagline}
                  </p>
                </div>

                <div>
                  <span className={cn("font-display text-3xl font-bold", highlight && "text-white")}>
                    {from}
                  </span>
                  <span className={cn("text-sm ml-1.5", highlight ? "text-white/40" : "text-muted-foreground")}>
                    from
                  </span>
                  <div className={cn(
                    "mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    highlight
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  )}>
                    <Clock className="h-3 w-3" /> {time}
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className={cn("flex items-center gap-2 text-sm", highlight ? "text-white/70" : "text-muted-foreground")}>
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={cn(
                    "w-full font-semibold",
                    highlight
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "variant-outline border-border"
                  )}
                  variant={highlight ? "default" : "outline"}
                >
                  <Link href="/register">Book Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Why SwiftHaul
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Built different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BENTO_FEATURES.map(({ icon: Icon, title, body, span }) => (
              <div
                key={title}
                className={cn(
                  "group relative rounded-2xl border border-border/70 bg-card p-7 flex flex-col gap-4 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-default",
                  span
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{body}</p>
                </div>
                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-20 bg-[#09090b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ship in 4 steps
            </h2>
            <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">
              From booking to proof-of-delivery — the whole flow takes minutes to start.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ n, title, body }, idx) => (
              <div key={n} className="relative group">
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-white/10 via-primary/30 to-transparent" />
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display font-bold text-sm text-primary-foreground shadow-lg shadow-primary/30 z-10">
                    {n}
                    <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-20 transition-opacity blur-md" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white text-base">{title}</h3>
                    <p className="text-white/40 text-sm mt-1.5 leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="px-4 md:px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Social Proof
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Loved by businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, role, company, quote, rating }) => (
              <Card key={name} className="border-border/70 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-7 flex flex-col gap-5">
                  <div className="flex gap-0.5">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 flex-1">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-1 border-t border-border/60">
                    <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary font-display">
                      {name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground">{role}, {company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-10 md:p-16 text-center">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-600/20 blur-2xl" />

            <div className="relative z-10">
              <p className="text-xs font-bold tracking-widest uppercase text-amber-900/70 mb-4">
                Get Started Today
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-amber-950 leading-tight mb-4">
                Ready to ship smarter?
              </h2>
              <p className="text-amber-900/65 max-w-lg mx-auto mb-8 text-base md:text-lg leading-relaxed">
                Join 10,000+ businesses that trust SwiftHaul to move their goods across Nigeria — fast, safe, and tracked.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-950 text-amber-100 hover:bg-amber-900 font-bold text-base gap-2 shadow-lg shadow-amber-900/30"
                >
                  <Link href="/register">
                    Create Free Account <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-amber-900/25 bg-amber-50/20 px-6 py-2.5 text-base font-semibold text-amber-950 hover:bg-amber-50/30 transition-colors"
                >
                  Track Shipment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/40">
              <Package2 className="h-4 w-4 text-primary-foreground" />
            </div>
            SwiftHaul
          </Link>

          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} SwiftHaul Ltd. All rights reserved.
          </p>

          <nav className="flex gap-6 text-sm text-white/40">
            <Link href="/track" className="hover:text-white transition-colors">Track</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
