"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Flag, User, Clock, ChevronRight } from "lucide-react";
import { KanbanAPI } from "@/lib/api";

type Priority = "HIGH" | "MEDIUM" | "LOW";
type ColumnId = "backlog" | "in-progress" | "review" | "done";

interface Task {
    id: string;
    title: string;
    client: string;
    priority: Priority;
    assignee: string;
    dueDate: string;
    tags: string[];
}

interface Column {
    id: ColumnId;
    title: string;
    color: string;
    tasks: Task[];
}

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string }> = {
    HIGH: { color: "text-red-400", dot: "bg-red-500" },
    MEDIUM: { color: "text-amber-400", dot: "bg-amber-400" },
    LOW: { color: "text-blue-400", dot: "bg-blue-400" },
};

const INITIAL_COLUMNS: Column[] = [
    {
        id: "backlog",
        title: "Backlog",
        color: "border-gray-700",
        tasks: [
            { id: "t1", title: "Set up CDN config for Coastal Pharma", client: "Coastal Pharma", priority: "MEDIUM", assignee: "JD", dueDate: "Jul 10", tags: ["DevOps"] },
            { id: "t2", title: "Write API reference docs for Nexus", client: "Nexus-MFG", priority: "LOW", assignee: "AM", dueDate: "Jul 15", tags: ["Docs"] },
            { id: "t3", title: "SEO audit for BioLink platform", client: "BioLink Tech", priority: "LOW", assignee: "KO", dueDate: "Jul 20", tags: ["SEO"] },
        ],
    },
    {
        id: "in-progress",
        title: "In Progress",
        color: "border-cyan-500/40",
        tasks: [
            { id: "t4", title: "Backend API integration — Apex Logistics", client: "Apex Logistics Ltd.", priority: "HIGH", assignee: "JD", dueDate: "Jun 28", tags: ["Backend", "API"] },
            { id: "t5", title: "Database schema review & migration", client: "Apex Logistics Ltd.", priority: "HIGH", assignee: "AM", dueDate: "Jun 25", tags: ["Database"] },
            { id: "t6", title: "Mobile responsive fixes", client: "StarTech Holdings", priority: "MEDIUM", assignee: "KO", dueDate: "Jun 30", tags: ["Frontend"] },
        ],
    },
    {
        id: "review",
        title: "In Review",
        color: "border-purple-500/40",
        tasks: [
            { id: "t7", title: "Staging environment validation — Nexus-MFG", client: "Nexus-MFG", priority: "HIGH", assignee: "JD", dueDate: "Jun 24", tags: ["QA", "Staging"] },
            { id: "t8", title: "Security penetration audit", client: "System", priority: "HIGH", assignee: "AM", dueDate: "Jun 23", tags: ["Security"] },
        ],
    },
    {
        id: "done",
        title: "Completed",
        color: "border-emerald-500/30",
        tasks: [
            { id: "t9", title: "Discovery workshop — Coastal Pharma", client: "Coastal Pharma", priority: "MEDIUM", assignee: "KO", dueDate: "Jun 10", tags: ["Discovery"] },
            { id: "t10", title: "UI prototypes — Apex Logistics", client: "Apex Logistics Ltd.", priority: "HIGH", assignee: "AM", dueDate: "Jan 28", tags: ["Design"] },
            { id: "t11", title: "Production handover — BioLink", client: "BioLink Tech", priority: "HIGH", assignee: "JD", dueDate: "May 15", tags: ["Launch"] },
        ],
    },
];

function TaskCard({ task }: { task: Task }) {
    const pCfg = PRIORITY_CONFIG[task.priority];
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[#0d1420] border border-white/5 hover:border-white/10 cursor-grab active:cursor-grabbing group transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-medium text-gray-200 group-hover:text-white leading-snug">{task.title}</p>
                <div className={`flex-shrink-0 mt-0.5 flex items-center gap-1 text-[10px] font-bold ${pCfg.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`}></div>
                    {task.priority}
                </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
                {task.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 text-gray-400 border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span className="truncate max-w-[120px]">{task.client}</span>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span className="font-mono">{task.dueDate}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-gray-300">
                        {task.assignee}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

const STATUS_TO_COL: Record<string, ColumnId> = {
    BACKLOG: "backlog",
    IN_PROGRESS: "in-progress",
    REVIEW: "review",
    DEPLOYED: "done",
};

export default function KanbanModule() {
    const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

    useEffect(() => {
        KanbanAPI.getTasks().then((apiTasks: any[]) => {
            if (!apiTasks || apiTasks.length === 0) return;
            const mapped: Task[] = apiTasks.map((t: any) => ({
                id: t.id,
                title: t.title,
                client: t.project?.client?.companyName || "General",
                priority: (t.priority?.toUpperCase() || "MEDIUM") as Priority,
                assignee: "TM",
                dueDate: "—",
                tags: [],
            }));
            const newCols = INITIAL_COLUMNS.map(col => ({
                ...col,
                tasks: mapped.filter(t => {
                    const colId = STATUS_TO_COL[apiTasks.find(at => at.id === t.id)?.status || "BACKLOG"] || "backlog";
                    return colId === col.id;
                }),
            }));
            setColumns(newCols.some(c => c.tasks.length > 0) ? newCols : INITIAL_COLUMNS);
        }).catch(() => {});
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm">
                {columns.map(col => (
                    <div key={col.id} className="flex items-center gap-2 text-gray-400">
                        <span className="font-medium text-white">{col.tasks.length}</span>
                        <span>{col.title}</span>
                    </div>
                ))}
                <div className="ml-auto">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]">
                        <Plus size={16} /> New Task
                    </button>
                </div>
            </div>

            {/* Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
                {columns.map(col => (
                    <div key={col.id} className="space-y-3">
                        {/* Column Header */}
                        <div className={`flex items-center justify-between px-4 py-3 rounded-2xl bg-[#111827] border-l-2 ${col.color}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{col.title}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{col.tasks.length}</span>
                            </div>
                            <button className="text-gray-600 hover:text-gray-400 transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>

                        {/* Task Cards */}
                        <div className="space-y-3">
                            {col.tasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>

                        {/* Add Task Placeholder */}
                        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/10 text-gray-600 hover:text-gray-400 hover:border-white/20 transition-all text-sm">
                            <Plus size={14} /> Add task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
