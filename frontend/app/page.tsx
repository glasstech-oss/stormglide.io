"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GenesisEngine from "@/components/GenesisEngine";
import GlowyWaves from "@/components/GlowyWaves";

const SERVICES = [
  {
    icon: "⚡",
    label: "Business Platforms",
    sub: "ERP, ops dashboards & internal tools",
    color: "rgba(90,209,255,0.08)",
    border: "rgba(90,209,255,0.18)",
  },
  {
    icon: "🌍",
    label: "Custom Software",
    sub: "Built for African markets & realities",
    color: "rgba(150,120,255,0.08)",
    border: "rgba(150,120,255,0.18)",
  },
  {
    icon: "✦",
    label: "AI Integration",
    sub: "Smart automation & predictive analytics",
    color: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.18)",
  },
];

const BAR_HEIGHTS = [38, 64, 48, 88, 72, 100];

const reveal = (delay: number) => ({
  initial: { y: "115%" },
  animate: { y: 0 },
  transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Home() {
  const parallaxBrowser = useRef<HTMLDivElement>(null);
  const parallaxOps = useRef<HTMLDivElement>(null);
  const parallaxPhone = useRef<HTMLDivElement>(null);
  const revenueEl = useRef<HTMLSpanElement>(null);
  const balanceEl = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>(Array(6).fill(null));

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let raf: number;
    const startT = performance.now();

    const eo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -9 * t));
    const prog = (now: number, delay: number, dur: number) => {
      const t = (now - startT - delay) / dur;
      return t < 0 ? 0 : t > 1 ? 1 : t;
    };

    const isMobile = () => window.innerWidth < 768;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = (now: number) => {
      const hw = window.innerWidth / 2;
      const hh = window.innerHeight / 2;

      // Parallax (desktop only)
      if (!isMobile()) {
        const ox = (mx - hw) / hw;
        const oy = (my - hh) / hh;
        if (parallaxBrowser.current) {
          parallaxBrowser.current.style.transform = `translate3d(${-ox * 13}px,${-oy * 13}px,0)`;
        }
        if (parallaxOps.current) {
          parallaxOps.current.style.transform = `translate3d(${-ox * 25}px,${-oy * 25}px,0)`;
        }
        if (parallaxPhone.current) {
          parallaxPhone.current.style.transform = `translate3d(${-ox * 38}px,${-oy * 38}px,0)`;
        }
      }

      // Animated counters
      const elapsed = now - startT;
      if (elapsed > 400 && revenueEl.current) {
        const p = eo(prog(now, 400, 1100));
        revenueEl.current.textContent = `₦${(2.4 * p).toFixed(1)}M`;
      }
      if (elapsed > 560 && balanceEl.current) {
        const p = eo(prog(now, 560, 1200));
        balanceEl.current.textContent = `₦${Math.round(842300 * p).toLocaleString()}`;
      }

      // Bar chart animation
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const delay = 520 + i * 50;
        const p = eo(prog(now, delay, 700));
        bar.style.height = `${BAR_HEIGHTS[i] * p}%`;
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="aurora-page bg-[#060709] text-[#f3f5f8]">
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] overflow-hidden">
        
        {/* Interactive Wave Canvas Background */}
        <GlowyWaves />

        {/* Content grid */}
        <div className="relative z-10 grid md:grid-cols-2 items-center min-h-[100svh] px-6 sm:px-10 md:px-16 pt-28 md:pt-24 pb-32 md:pb-16 gap-10 md:gap-12">

          {/* ── LEFT: Copy ── */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5 font-spmono text-[11px] tracking-[0.24em] text-[#5ad1ff] mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5ad1ff] animate-pulse" />
              SOFTWARE BUILT FOR AFRICA
            </motion.div>

            <h1 className="font-grotesk font-semibold leading-[0.94] tracking-[-0.035em] mb-6 text-[clamp(48px,6.5vw,92px)]">
              <span className="block overflow-hidden pb-[0.05em]">
                <motion.span className="block" {...reveal(0.08)}>Software built</motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.05em]">
                <motion.span className="block" {...reveal(0.2)}>
                  for&nbsp;<span className="text-[#5ad1ff] italic">Africa.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              className="font-manrope text-[rgba(243,245,248,0.66)] text-[clamp(15px,1.2vw,17px)] leading-relaxed max-w-sm mb-8"
            >
              Platforms, internal tools & AI for African business.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 items-center"
            >
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-[#5ad1ff] text-[#04181f] font-manrope font-semibold text-[15px] hover:shadow-[0_0_0_8px_rgba(90,209,255,0.16)] transition-all duration-300"
              >
                Start a project →
              </Link>
              <Link
                href="/portfolio"
                className="px-7 py-3.5 rounded-full border border-white/20 text-[#f3f5f8] font-manrope font-medium text-[15px] hover:border-white/50 transition-all duration-300"
              >
                See our work
              </Link>
            </motion.div>

            {/* Mobile: scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="md:hidden flex items-center gap-2 mt-10 font-spmono text-[11px] tracking-[0.16em] text-white/30"
            >
              <span className="w-8 h-px bg-white/20" />
              SCROLL TO EXPLORE
            </motion.div>
          </div>

          {/* ── RIGHT: Floating UI (desktop) ── */}
          <div className="hidden md:block relative h-[540px]">

            {/* Browser card */}
            <div ref={parallaxBrowser} className="absolute left-5 top-0 w-[414px] z-10 will-change-transform">
              <div className="sg-float-browser rounded-[14px] overflow-hidden bg-[#101622] border border-white/[0.09] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.03]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                  <div className="ml-2 flex-1 h-[19px] rounded bg-white/5 flex items-center px-2.5 font-spmono text-[10px] text-white/40">
                    app.stormglide.io
                  </div>
                </div>
                {/* Simulated dark UI screenshot */}
                <div className="h-[196px] bg-[#0a0f17] overflow-hidden relative">
                  <img src="/aurora.png" alt="" className="w-full h-full object-cover opacity-90" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  {/* Fallback gradient UI when image doesn't load */}
                  <div className="absolute inset-0 flex flex-col p-4 gap-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-16 h-2 rounded bg-[#5ad1ff]/30" />
                      <div className="w-24 h-2 rounded bg-white/10" />
                    </div>
                    <div className="flex gap-3 mt-1">
                      {[60,45,72,38,90,55].map((h,i)=>(
                        <div key={i} className="flex-1 rounded-sm bg-[#5ad1ff]/20" style={{height: h/2}} />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="h-14 rounded-lg bg-white/5 border border-white/5 p-2">
                        <div className="w-10 h-1.5 bg-[#5ad1ff]/30 rounded mb-1.5" />
                        <div className="w-16 h-3 bg-white/20 rounded font-grotesk text-xs text-white/70" />
                      </div>
                      <div className="h-14 rounded-lg bg-white/5 border border-white/5 p-2">
                        <div className="w-10 h-1.5 bg-purple-400/30 rounded mb-1.5" />
                        <div className="w-16 h-3 bg-white/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ops dashboard card */}
            <div ref={parallaxOps} className="absolute left-0 bottom-0 w-[258px] z-[3] will-change-transform">
              <div className="sg-float-ops rounded-[16px] bg-[#0d141e] border border-white/[0.09] shadow-[0_34px_64px_-26px_rgba(0,0,0,0.75)] p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-spmono text-[11px] text-white/50 tracking-[0.05em]">OPERATIONS</span>
                  <span className="flex items-center gap-1.5 font-spmono text-[11px] text-[#5ad1ff]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5ad1ff] animate-pulse" />
                    live
                  </span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span ref={revenueEl} className="font-grotesk font-semibold text-[30px] tracking-[-0.02em]">₦0.0M</span>
                  <span className="font-manrope text-xs text-[#4ade80] font-semibold pb-1.5">▲ 18%</span>
                </div>
                <div className="font-spmono text-[11px] text-white/40 mb-3">Revenue · this month</div>
                <div className="flex gap-1.5 items-end h-[54px] mb-3">
                  {BAR_HEIGHTS.map((_, i) => (
                    <span
                      key={i}
                      ref={(el) => { barsRef.current[i] = el; }}
                      className="flex-1 rounded-[3px]"
                      style={{
                        height: "0%",
                        background: i === 5 ? "#5ad1ff" : `rgba(90,209,255,${0.28 + i * 0.03})`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2 rounded-[9px] bg-[rgba(90,209,255,0.08)] border border-[rgba(90,209,255,0.18)] font-spmono text-[11px] text-[rgba(243,245,248,0.85)]">
                  <span className="text-[#5ad1ff]">✦</span>
                  Ask AI
                  <span className="text-white/40">— forecast</span>
                  <span className="sg-caret ml-auto w-1.5 h-3 bg-[#5ad1ff] inline-block" />
                </div>
              </div>
            </div>

            {/* Phone card */}
            <div ref={parallaxPhone} className="absolute -right-2 top-[60px] w-[144px] z-[4] will-change-transform">
              <div className="sg-float-phone rounded-[28px] bg-[#0a0f17] border border-white/[0.12] shadow-[0_40px_70px_-22px_rgba(0,0,0,0.78)] p-1.5">
                <div className="relative rounded-[22px] overflow-hidden h-[286px] bg-gradient-to-b from-[#121822]/60 to-[#0a0f17] px-3 pt-6 pb-3">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-lg bg-[#050608]" />
                  <div className="font-spmono text-[9px] text-white/45 tracking-[0.08em]">BALANCE</div>
                  <span ref={balanceEl as React.RefObject<HTMLSpanElement>} className="block font-grotesk font-semibold text-[20px] mt-0.5 mb-3">₦0</span>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-[7px] bg-[rgba(90,209,255,0.18)]" />
                      <span className="flex-1">
                        <span className="block text-[10px] text-[#f3f5f8]">Paystack</span>
                        <span className="block text-[9px] text-white/40">payout</span>
                      </span>
                      <span className="text-[10px] text-[#4ade80]">+₦62k</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-[7px] bg-[rgba(150,120,255,0.2)]" />
                      <span className="flex-1">
                        <span className="block text-[10px] text-[#f3f5f8]">Suppliers</span>
                        <span className="block text-[9px] text-white/40">batch</span>
                      </span>
                      <span className="text-[10px] text-white/60">−₦18k</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 px-2.5 py-2 rounded-[9px] bg-[rgba(90,209,255,0.1)] font-spmono text-[10px] text-[#5ad1ff]">
                    <span>✦</span>
                    3 insights ready
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE: Cards row (visible below CTA) ── */}
          <div className="md:hidden -mx-6 sm:-mx-10 overflow-x-auto">
            <div className="flex gap-4 px-6 sm:px-10 pb-4" style={{ width: "max-content" }}>

              {/* Browser card — mobile */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="sg-float-browser w-[260px] rounded-[14px] overflow-hidden bg-[#101622] border border-white/[0.09] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.03]">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                  <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                  <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                  <div className="ml-2 flex-1 h-[16px] rounded bg-white/5 flex items-center px-2 font-spmono text-[9px] text-white/40">
                    app.stormglide.io
                  </div>
                </div>
                <div className="h-[140px] bg-[#0a0f17] p-3 flex flex-col gap-2">
                  <div className="flex gap-1.5 items-end h-10">
                    {[60,45,72,38,90,55,68].map((h,i)=>(
                      <div key={i} className="flex-1 rounded-sm bg-[#5ad1ff]/25" style={{height:`${h}%`}} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-10 rounded-md bg-white/5 border border-white/5 p-1.5">
                      <div className="w-8 h-1 bg-[#5ad1ff]/30 rounded mb-1" />
                      <div className="w-12 h-2 bg-white/15 rounded" />
                    </div>
                    <div className="h-10 rounded-md bg-white/5 border border-white/5 p-1.5">
                      <div className="w-8 h-1 bg-purple-400/30 rounded mb-1" />
                      <div className="w-12 h-2 bg-white/15 rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ops card — mobile */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                className="sg-float-ops w-[200px] shrink-0 rounded-[16px] bg-[#0d141e] border border-white/[0.09] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] p-3.5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-spmono text-[10px] text-white/50 tracking-[0.05em]">OPERATIONS</span>
                  <span className="flex items-center gap-1 font-spmono text-[10px] text-[#5ad1ff]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5ad1ff] animate-pulse" />live
                  </span>
                </div>
                <div className="font-grotesk font-semibold text-[22px] tracking-[-0.02em]">₦2.4M</div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="font-manrope text-[11px] text-[#4ade80] font-semibold">▲ 18%</span>
                  <span className="font-spmono text-[10px] text-white/30">this month</span>
                </div>
                <div className="flex gap-1 items-end h-10 mb-2">
                  {[38,64,48,88,72,100].map((h,i)=>(
                    <span key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background: i===5?"#5ad1ff":`rgba(90,209,255,${0.25+i*0.04})`}} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-[8px] bg-[rgba(90,209,255,0.08)] border border-[rgba(90,209,255,0.18)] font-spmono text-[10px] text-[#5ad1ff]">
                  <span>✦</span> Ask AI
                </div>
              </motion.div>

              {/* Phone card — mobile */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                className="sg-float-phone w-[120px] shrink-0">
                <div className="rounded-[24px] bg-[#0a0f17] border border-white/[0.12] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.78)] p-1.5">
                  <div className="relative rounded-[18px] overflow-hidden h-[230px] bg-gradient-to-b from-[#121822]/60 to-[#0a0f17] px-2.5 pt-5 pb-2.5">
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-lg bg-[#050608]" />
                    <div className="font-spmono text-[8px] text-white/40 tracking-[0.08em]">BALANCE</div>
                    <div className="font-grotesk font-semibold text-[16px] mt-0.5 mb-2.5">₦842k</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-[6px] bg-[rgba(90,209,255,0.18)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] text-[#f3f5f8] truncate">Paystack</div>
                          <div className="text-[8px] text-white/40">payout</div>
                        </div>
                        <span className="text-[8px] text-[#4ade80] shrink-0">+62k</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-[6px] bg-[rgba(150,120,255,0.2)] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] text-[#f3f5f8] truncate">Suppliers</div>
                          <div className="text-[8px] text-white/40">batch</div>
                        </div>
                        <span className="text-[8px] text-white/50 shrink-0">−18k</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2.5 px-2 py-1.5 rounded-[7px] bg-[rgba(90,209,255,0.1)] font-spmono text-[8px] text-[#5ad1ff]">
                      <span>✦</span> 3 insights
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060709] to-transparent pointer-events-none" />
      </section>

      {/* ════════════════════════════════════════
          SERVICES — minimal visual cards
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-[#060709]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="font-spmono text-[11px] tracking-[0.22em] text-[#5ad1ff] mb-4">WHAT WE BUILD</p>
            <h2 className="font-grotesk font-semibold text-[clamp(28px,3.5vw,48px)] tracking-[-0.03em]">
              One team. Full stack.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl border transition-all duration-300"
                style={{ background: s.color, borderColor: s.border }}
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </div>
                <h3 className="font-grotesk font-semibold text-lg mb-2 text-[#f3f5f8]">{s.label}</h3>
                <p className="font-manrope text-sm text-white/50">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════ */}
      <section className="py-12 px-6 md:px-16 bg-[#060709] border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Products shipped" },
            { value: "₦2.4M+", label: "Revenue tracked" },
            { value: "5+", label: "Industries served" },
            { value: "100%", label: "Africa-first focus" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="font-grotesk font-semibold text-[clamp(28px,3.5vw,42px)] tracking-[-0.03em] text-[#5ad1ff]">
                {stat.value}
              </div>
              <div className="font-spmono text-[11px] text-white/40 tracking-[0.1em] mt-1 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          GENESIS ENGINE
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 md:px-8 bg-[#060709]">
        <GenesisEngine />
      </section>

      {/* ════════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-[#060709] text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(90,209,255,0.06), transparent)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-xl mx-auto"
        >
          <p className="font-spmono text-[11px] tracking-[0.22em] text-[#5ad1ff] mb-4">READY TO BUILD?</p>
          <h2 className="font-grotesk font-semibold text-[clamp(28px,4vw,52px)] tracking-[-0.03em] mb-6">
            Let's build something
            <br />
            <span className="text-[#5ad1ff] italic">exceptional.</span>
          </h2>
          <p className="font-manrope text-white/50 text-[15px] mb-8 leading-relaxed">
            Tell us what you need. We'll ship it fast.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-[#5ad1ff] text-[#04181f] font-manrope font-semibold text-[15px] hover:shadow-[0_0_0_10px_rgba(90,209,255,0.12)] transition-all duration-300"
          >
            Start a project →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
