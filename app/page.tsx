"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Category = "school" | "shift" | "personal";
type Status = "To do" | "In progress" | "Done";
type Task = { id: string; title: string; category: Category; status: Status };

const STATUS_OPTIONS: Status[] = ["To do", "In progress", "Done"];

function parseTasks(saved: string): Task[] {
  const value: unknown = JSON.parse(saved);
  if (!Array.isArray(value) || !value.every((task) => task &&
    typeof task.id === "string" && typeof task.title === "string" &&
    ["school", "shift", "personal"].includes(task.category) &&
    STATUS_OPTIONS.includes(task.status))) {
    throw new Error("Invalid saved task list");
  }
  return value;
}

function TaskColumn({
  category,
  title,
  subtitle,
  icon,
  tasks,
  onAdd,
  onStatus,
  onDelete,
}: {
  category: Category;
  title: string;
  subtitle: string;
  icon: string;
  tasks: Task[];
  onAdd: (title: string, category: Category) => void;
  onStatus: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = draft.trim();
    if (!clean) return;
    onAdd(clean, category);
    setDraft("");
  }

  return (
    <section className={`task-column ${category}`} aria-labelledby={`${category}-title`}>
      <header className="column-header">
        <div className="icon" aria-hidden="true">{icon}</div>
        <div><p>{subtitle}</p><h2 id={`${category}-title`}>{title}</h2></div>
        <span className="count">{tasks.length.toString().padStart(2, "0")}</span>
      </header>

      <form className="add-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`${category}-task`}>Add a {title} task</label>
        <input id={`${category}-task`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={category === "school" ? "Add an assignment…" : category === "shift" ? "Add a shift task…" : "Add a personal task…"} />
        <button type="submit" aria-label={`Add ${title} task`}>+</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 && <div className="empty"><span>✦</span><p>All clear here.</p><small>Add something above when it comes up.</small></div>}
        {tasks.map((task) => (
          <article className={`task ${task.status === "Done" ? "complete" : ""}`} key={task.id}>
            <button className="check" onClick={() => onStatus(task.id, task.status === "Done" ? "To do" : "Done")} aria-label={task.status === "Done" ? `Mark ${task.title} as to do` : `Mark ${task.title} complete`}>{task.status === "Done" ? "✓" : ""}</button>
            <div className="task-copy"><h3>{task.title}</h3><span>{category === "school" ? "School" : category === "shift" ? "Shift" : "Personal"}</span></div>
            <label className="sr-only" htmlFor={`status-${task.id}`}>Status for {task.title}</label>
            <select id={`status-${task.id}`} value={task.status} onChange={(e) => onStatus(task.id, e.target.value as Status)}>
              {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
            </select>
            <button className="delete" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>×</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  const [saveMessage, setSaveMessage] = useState("Loading saved tasks…");

  useEffect(() => {
    function load() {
      try {
        const saved = window.localStorage.getItem("neve-tasks");
        setTasks(saved ? parseTasks(saved) : []);
        setSaveMessage("Saved in this browser · safe to close this tab");
        setReady(true);
      } catch {
        setSaveMessage("Your saved tasks could not be loaded. Please keep this tab open and try again.");
        setReady(false);
      }
    }
    load();
    function sync(event: StorageEvent) {
      if (event.key === "neve-tasks" || event.key === null) load();
    }
    window.addEventListener("storage", sync);
    window.addEventListener("focus", load);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", load);
    };
  }, []);

  function saveChange(change: (current: Task[]) => Task[]) {
    if (!ready) return;
    try {
      // Read the latest saved list so another open tab cannot overwrite new tasks.
      const saved = window.localStorage.getItem("neve-tasks");
      const current = saved ? parseTasks(saved) : tasks;
      const next = change(current);
      // Save before updating the screen, including when a tab is closed immediately.
      window.localStorage.setItem("neve-tasks", JSON.stringify(next));
      setTasks(next);
      setSaveMessage("Saved in this browser · safe to close this tab");
    } catch {
      setSaveMessage("Could not save that change. Please keep this tab open and check browser storage.");
    }
  }

  const done = tasks.filter((task) => task.status === "Done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const grouped = useMemo(() => ({
    school: tasks.filter((task) => task.category === "school"),
    shift: tasks.filter((task) => task.category === "shift"),
    personal: tasks.filter((task) => task.category === "personal"),
  }), [tasks]);

  function addTask(title: string, category: Category) {
    saveChange((current) => [{ id: crypto.randomUUID(), title, category, status: "To do" }, ...current]);
  }

  function updateStatus(id: string, status: Status) {
    saveChange((current) => current.map((task) => task.id === id ? { ...task, status } : task));
  }

  function deleteTask(id: string) {
    saveChange((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main>
      <nav><div className="mini-mark">NRP</div><p>My little task garden</p><span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span></nav>
      <section className="hero">
        <h1>Neve R. Palmeri</h1>
        <div className="summary">
          <p><strong>{tasks.length - done}</strong> things left</p>
          <div className="progress" aria-label={`${progress}% complete`}><i style={{ width: `${progress}%` }} /></div>
          <p><strong>{progress}%</strong> complete</p>
        </div>
      </section>

      <p className="save-status" role="status">{saveMessage}</p>
      <div className="board" aria-busy={!ready}>
        <TaskColumn category="school" title="School" subtitle="Learn & grow" icon="✎" tasks={grouped.school} onAdd={addTask} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn category="shift" title="Shift to-do" subtitle="On the clock" icon="☼" tasks={grouped.shift} onAdd={addTask} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn category="personal" title="Personal" subtitle="Just for me" icon="♡" tasks={grouped.personal} onAdd={addTask} onStatus={updateStatus} onDelete={deleteTask} />
      </div>
      <footer><span>One thing at a time.</span><p>Made just for Neve ♡</p></footer>
    </main>
  );
}
