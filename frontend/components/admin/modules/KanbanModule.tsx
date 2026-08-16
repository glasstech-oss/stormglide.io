"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, ChevronRight, X, Loader2, Trash2 } from "lucide-react";
import { KanbanAPI, ProjectsAPI } from "@/lib/api";
import { toDate } from "@/lib/firestore";

type Priority = "HIGH" | "MEDIUM" | "LOW";
type Status = "BACKLOG" | "IN_PROGRESS" | "REVIEW" | "DONE";
type ColumnId = "backlog" | "in-progress" | "review" | "done";

interface Task {
    id: string;
    title: string;
    status: Status;
    client: string;
    projectId: string | null;
    priority: Priority;
    assignedTo: string | null;
    dueDate: Date | null;
}

interface Column {
    id: ColumnId;
    status: Status;
    title: string;
    color: string;
}

const COLUMNS: Column[] = [
    { id: "backlog", status: "BACKLOG", title: "Backlog", color: "border-gray-700" },
    { id: "in-progress", status: "IN_PROGRESS", title: "In Progress", color: "border-cyan-500/40" },
    { id: "review", status: "REVIEW", title: "In Review", color: "border-purple-500/40" },
    { id: "done", status: "DONE", title: "Completed", color: "border-emerald-500/30" },
];

const NEXT_STATUS: Record<Status, Status | null> = {
    BACKLOG: "IN_PROGRESS",
    IN_PROGRESS: "REVIEW",
    REVIEW: "DONE",
    DONE: null,
};

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string }> = {
    HIGH: { color: "text-red-400", dot: "bg-red-500" },
    MEDIUM: { color: "text-amber-400", dot: "bg-amber-400" },
    LOW: { color: "text-blue-400", dot: "bg-blue-400" },
};

function TaskCard({ task, onAdvance, onDelete }: { task: Task; onAdvance: () => void; onDelete: () => void }) {
    const pCfg = PRIORITY_CONFIG[task.priority];
    const canAdvance = NEXT_STATUS[task.status] !== null;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[#0d1420] border border-white/5 hover:border-white/10 group transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-medium text-gray-200 group-hover:text-white leading-snug">{task.title}</p>
                <div className={`flex-shrink-0 mt-0.5 flex items-center gap-1 text-[10px] font-bold ${pCfg.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`}></div>
                    {task.priority}
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span className="truncate max-w-[110px]">{task.client}</span>
                <div className="flex items-center gap-2">
                    {task.dueDate && (
                        <div className="flex items-center gap-1">
                            <Clock size={10} />
                            <span className="font-mono">{task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                    {task.assignedTo && (
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-gray-300">
                            {task.assignedTo.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete task">
                    <Trash2 size={12} />
                </button>
                {canAdvance && (
                    <button onClick={onAdvance} className="p-1.5 rounded-lg text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors" title="Move to next stage">
                        <ChevronRight size={12} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

function AddTaskModal({ projects, onClose, onCreated }: { projects: any[]; onClose: () => void; onCreated: () => void }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [projectId, setProjectId] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!title.trim()) return;
        setSaving(true);
        try {
            const project = projects.find((p) => p.id === projectId);
            await KanbanAPI.createTask({
                title: title.trim(),
                priority,
                projectId: projectId || undefined,
                clientId: project?.clientId || undefined,
            });
            onCreated();
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md rounded-3xl bg-[#0d1117] border border-white/10 p-6 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">New task</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5"><X size={16} /></button>
                </div>
                <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    className="w-full rounded-xl bg-[#111827] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
                />
                <div className="grid grid-cols-2 gap-3">
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="rounded-xl bg-[#111827] border border-white/10 px-3 py-2.5 text-sm text-white outline-none"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                    <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="rounded-xl bg-[#111827] border border-white/10 px-3 py-2.5 text-sm text-white outline-none"
                    >
                        <option value="">General</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>{p.client?.companyName || p.projectName}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={submit}
                    disabled={!title.trim() || saving}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {saving ? "Creating..." : "Create task"}
                </button>
            </motion.div>
        </div>
    );
}

export default function KanbanModule() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);

    const load = useCallback(async () => {
        try {
            const [apiTasks, apiProjects] = await Promise.all([KanbanAPI.getTasks(), ProjectsAPI.list()]);
            setProjects(apiProjects || []);
            const projectMap = new Map((apiProjects || []).map((p: any) => [p.id, p.client?.companyName || p.projectName]));
            const mapped: Task[] = (apiTasks || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                status: (t.status || "BACKLOG") as Status,
                client: (t.projectId && projectMap.get(t.projectId)) || "General",
                projectId: t.projectId || null,
                priority: (t.priority?.toUpperCase() || "MEDIUM") as Priority,
                assignedTo: t.assignedTo || null,
                dueDate: toDate(t.dueDate),
            }));
            setTasks(mapped);
        } catch {
            // leave tasks empty — an honest empty board beats stale/fake data
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const advance = async (task: Task) => {
        const next = NEXT_STATUS[task.status];
        if (!next) return;
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
        await KanbanAPI.updateTask(task.id, { status: next });
    };

    const remove = async (task: Task) => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        await KanbanAPI.deleteTask(task.id);
    };

    const columns = useMemo(
        () => COLUMNS.map((col) => ({ ...col, tasks: tasks.filter((t) => t.status === col.status) })),
        [tasks]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 size={28} className="animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm">
                {columns.map((col) => (
                    <div key={col.id} className="flex items-center gap-2 text-gray-400">
                        <span className="font-medium text-white">{col.tasks.length}</span>
                        <span>{col.title}</span>
                    </div>
                ))}
                <div className="ml-auto">
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-[#04181f] text-sm font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(90,209,255,0.2)]"
                    >
                        <Plus size={16} /> New Task
                    </button>
                </div>
            </div>

            {/* Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
                {columns.map((col) => (
                    <div key={col.id} className="space-y-3">
                        <div className={`flex items-center justify-between px-4 py-3 rounded-2xl bg-[#111827] border-l-2 ${col.color}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">{col.title}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{col.tasks.length}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {col.tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onAdvance={() => advance(task)} onDelete={() => remove(task)} />
                                ))}
                            </AnimatePresence>
                            {col.tasks.length === 0 && (
                                <p className="text-center text-xs text-gray-700 py-4">No tasks here.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showAdd && <AddTaskModal projects={projects} onClose={() => setShowAdd(false)} onCreated={load} />}
            </AnimatePresence>
        </div>
    );
}
