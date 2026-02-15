"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Cpu,
    Database,
    Globe,
    Shield,
    Zap,
    Activity,
    Server,
    Command,
    Terminal
} from "lucide-react";

const BLUEPRINTS = [
    {
        id: "erp",
        name: "Enterprise ERP",
        nodes: ["Database", "Server", "Shield", "Activity"],
        stats: { resilience: 98, velocity: 85, depth: 92 },
        description: "High-consistency financial & operational engine.",
        color: "cyan"
    },
    {
        id: "saas",
        name: "SaaS Ecosystem",
        nodes: ["Globe", "Zap", "Database", "Command"],
        stats: { resilience: 88, velocity: 99, depth: 82 },
        description: "Scale-first platform for global distributed users.",
        color: "purple"
    },
    {
        id: "ai-lab",
        name: "AI Genesis Lab",
        nodes: ["Cpu", "Zap", "Terminal", "Shield"],
        stats: { resilience: 92, velocity: 94, depth: 98 },
        description: "Neural-driven architecture for predictive modeling.",
        color: "emerald"
    }
];

const NODE_ICONS: Record<string, any> = {
    Database,
    Server,
    Shield,
    Activity,
    Globe,
    Zap,
    Cpu,
    Command,
    Terminal
};

export default function GenesisEngine() {
    const [selected, setSelected] = useState(BLUEPRINTS[0]);
    const [isAssembling, setIsAssembling] = useState(false);

    useEffect(() => {
        setIsAssembling(true);
        const timer = setTimeout(() => setIsAssembling(false), 800);
        return () => clearTimeout(timer);
    }, [selected]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 lg:p-12 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Control & Stats */}
                <div className="space-y-10 order-2 lg:order-1">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-4">Nexus Genesis Engine</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Orchestrate your system's architecture. Select a core blueprint to see how Nexus assembles the operational stack in real-time.
                        </p>
                    </div>

                    {/* Blueprint Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {BLUEPRINTS.map((bp) => (
                            <button
                                key={bp.id}
                                onClick={() => setSelected(bp)}
                                className={`p-4 rounded-2xl border text-left transition-all duration-300 ${selected.id === bp.id
                                        ? `bg-${bp.color}-500/10 border-${bp.color}-500/50 scale-[1.02]`
                                        : "bg-white/5 border-white/10 hover:border-white/20 grayscale hover:grayscale-0"
                                    }`}
                            >
                                <span className={`text-xs font-mono mb-2 block uppercase tracking-tighter ${selected.id === bp.id ? `text-${bp.color}-400` : "text-gray-500"
                                    }`}>
                                    Blueprint 0{BLUEPRINTS.indexOf(bp) + 1}
                                </span>
                                <h4 className="text-white font-bold text-sm">{bp.name}</h4>
                            </button>
                        ))}
                    </div>

                    {/* Metrics Display */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        {Object.entries(selected.stats).map(([label, value]) => (
                            <div key={label} className="space-y-2">
                                <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-gray-500">
                                    <span>{label}</span>
                                    <span className="text-white">{value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${value}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className={`h-full bg-gradient-to-r ${selected.color === 'cyan' ? 'from-cyan-500 to-blue-500' :
                                                selected.color === 'purple' ? 'from-purple-500 to-pink-500' :
                                                    'from-emerald-500 to-teal-500'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual Orchestration */}
                <div className="relative aspect-square order-1 lg:order-2 flex items-center justify-center p-8 bg-black/40 rounded-[40px] border border-white/5 shadow-inner">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

                    {/* Central Core */}
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: isAssembling ? 0.9 : 1
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.5 }
                        }}
                        className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                    >
                        <div className={`w-16 h-16 rounded-full blur-2xl opacity-50 bg-${selected.color}-500 animate-pulse`}></div>
                        <Command className="w-10 h-10 text-white relative z-20" />
                    </motion.div>

                    {/* Nodes Ring */}
                    <AnimatePresence>
                        {!isAssembling && selected.nodes.map((node, i) => {
                            const Icon = NODE_ICONS[node];
                            const angle = (i * (360 / selected.nodes.length)) * (Math.PI / 180);
                            const radius = 120;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;

                            return (
                                <React.Fragment key={`${selected.id}-${node}-${i}`}>
                                    {/* Connection Line */}
                                    <motion.div
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.3 }}
                                        className="absolute z-0 pointer-events-none"
                                        style={{
                                            left: '50%',
                                            top: '50%',
                                            width: radius,
                                            height: 1,
                                            background: `linear-gradient(90deg, transparent, ${selected.color === 'emerald' ? '#10b981' : selected.color === 'purple' ? '#a855f7' : '#06b6d4'})`,
                                            transformOrigin: '0% 50%',
                                            transform: `rotate(${i * (360 / selected.nodes.length)}deg)`
                                        }}
                                    />

                                    {/* Node */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        animate={{ opacity: 1, scale: 1, x, y }}
                                        exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                                        className="absolute z-20 w-12 h-12 rounded-xl bg-[#0B0F19] border border-white/20 flex items-center justify-center text-white shadow-lg overflow-hidden group"
                                    >
                                        <div className={`absolute inset-0 bg-${selected.color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                        <Icon size={20} className="relative z-10" />
                                    </motion.div>
                                </React.Fragment>
                            );
                        })}
                    </AnimatePresence>

                    {/* HUD Info */}
                    <div className="absolute bottom-6 right-6 text-right">
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Architecture Depth</div>
                        <div className="text-xl font-bold font-mono text-white">XN-{selected.id.toUpperCase()}-09</div>
                    </div>
                    <div className="absolute top-6 left-6 text-left">
                        <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Stack Status</div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-mono text-white uppercase tracking-tighter">Genesis Loaded</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
