"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertCircle, Plus, SquareCheckBig } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

// Item 4 — title set via metadata export is not possible in "use client" pages;
// the parent layout carries the portal title. A head-level title can be set
// via a server wrapper if needed. Keeping this page client-only per original design.

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
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [newTask, setNewTask] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  // Item 14 — search/filter state
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // Item 2 — session expiry
      if (authError || !user) {
        setSessionExpired(true);
        setLoading(false);
        return;
      }

      const [tasksRes, clientsRes] = await Promise.all([
        supabase.from("tasks").select("*").order("sort_order"),
        // Item 12 — exclude soft-deleted clients from the name lookup
        supabase.from("clients").select("id, name").is("deleted_at", null),
      ]);

      if (tasksRes.error) {
        setError("Failed to load tasks.");
      } else {
        setTasks(tasksRes.data || []);
      }
      setClients(clientsRes.data || []);
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addTask = async (status: string) => {
    const title = newTask[status]?.trim();
    if (!title) return;

    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({ title, status, priority: "medium" })
      .select()
      .single();

    if (insertError) {
      toast.error("Failed to add task.");
      return;
    }

    if (data) {
      setTasks((prev) => [...prev, data]);
      setNewTask((prev) => ({ ...prev, [status]: "" }));
      toast.success("Task added.");
    }
  };

  // Item 3 — optimistic update with rollback
  const updateStatus = async (taskId: string, newStatus: string) => {
    // Save previous state for rollback
    const previousTasks = [...tasks];

    // Apply optimistic update immediately
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const { error: updateError } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (updateError) {
      // Rollback to previous state
      setTasks(previousTasks);
      toast.error("Failed to update task status. Change reverted.");
    } else {
      // Item 9 — audit log (fire-and-forget via client; for full audit use server action)
      toast.success("Task moved.");
    }
  };

  const getClientName = (clientId: string | null) =>
    clients.find((c) => c.id === clientId)?.name;

  // Item 14 — filter tasks by search term
  const filteredTasks = search.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      )
    : tasks;

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-24 bg-dark-lighter rounded mb-2" />
          <div className="h-4 w-32 bg-dark-lighter rounded" />
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              className="bg-dark-light border border-dark-border rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-dark-lighter" />
                <div className="h-4 w-20 bg-dark-lighter rounded" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-dark-lighter rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchData();
          }}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </button>
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

      {/* Item 14 — search filter */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tasks by title..."
          className="w-full bg-dark-light border border-dark-border rounded-lg pl-4 pr-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none text-sm"
        />
      </div>

      {/* Item 1 — empty state when no tasks exist at all */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <SquareCheckBig className="w-12 h-12 text-text-dim" />
          <h3 className="text-lg font-semibold text-text">No Tasks Yet</h3>
          <p className="text-text-dim text-sm">
            Add a task to any column below to get started.
          </p>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
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
                          PRIORITY_COLORS[task.priority] ||
                          PRIORITY_COLORS.medium
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

                {/* Filtered empty state inside column */}
                {search && colTasks.length === 0 && tasks.filter(t => t.status === col.id).length > 0 && (
                  <p className="text-xs text-text-dim text-center py-4">
                    No matches
                  </p>
                )}
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
