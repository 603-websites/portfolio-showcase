"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  client_id: string | null;
}

interface ClientRef {
  id: string;
  name: string;
}

const COLUMNS = [
  { id: "todo", label: "To Do", color: "border-text-dim" },
  { id: "in_progress", label: "In Progress", color: "border-accent" },
  { id: "review", label: "Review", color: "border-amber" },
  { id: "done", label: "Done", color: "border-success" },
];

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "bg-error/10 text-error",
  high: "bg-amber/10 text-amber",
  medium: "bg-accent/10 text-accent",
  low: "bg-dark-lighter text-text-dim",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<ClientRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const [tasksRes, clientsRes] = await Promise.all([
      supabase.from("tasks").select("*").order("sort_order"),
      supabase.from("clients").select("id, name"),
    ]);
    setTasks(tasksRes.data || []);
    setClients(clientsRes.data || []);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTask = async (status: string) => {
    const title = newTask[status]?.trim();
    if (!title) return;

    const { data } = await supabase
      .from("tasks")
      .insert({ title, status, priority: "medium" })
      .select()
      .single();

    if (data) {
      setTasks((prev) => [...prev, data]);
      setNewTask((prev) => ({ ...prev, [status]: "" }));
    }
  };

  const updateStatus = async (taskId: string, newStatus: string) => {
    await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const getClientName = (clientId: string | null) =>
    clients.find((c) => c.id === clientId)?.name;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-text-muted mt-1">
          {tasks.filter((t) => t.status !== "done").length} open tasks
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-dark-light border border-dark-border rounded-xl p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedTask) {
                  updateStatus(draggedTask, col.id);
                  setDraggedTask(null);
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full border-2 ${col.color}`}
                  />
                  <h3 className="text-sm font-semibold text-text">
                    {col.label}
                  </h3>
                  <span className="text-xs text-text-dim bg-dark-lighter rounded-full px-2 py-0.5">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTask(task.id)}
                    className="bg-dark-lighter border border-dark-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-accent/50 transition"
                  >
                    <p className="text-sm text-text mb-2">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.client_id && (
                        <span className="text-xs text-text-dim">
                          {getClientName(task.client_id)}
                        </span>
                      )}
                    </div>
                    {task.due_date && (
                      <p className="text-xs text-text-dim mt-1">
                        Due: {task.due_date}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Add task input */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newTask[col.id] || ""}
                  onChange={(e) =>
                    setNewTask((prev) => ({
                      ...prev,
                      [col.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addTask(col.id)}
                  placeholder="Add task..."
                  className="flex-1 bg-dark border border-dark-border rounded-lg px-3 py-1.5 text-sm text-text placeholder-text-dim focus:border-accent outline-none"
                />
                <button
                  onClick={() => addTask(col.id)}
                  className="p-1.5 text-text-dim hover:text-accent transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
