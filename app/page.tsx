"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Category = "school" | "shift";
type Status = "To do" | "In progress" | "Done";
type Task = { id: string; title: string; category: Category; status: Status };

const STATUS_OPTIONS: Status[] = ["To do", "In progress", "Done"];

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
        <input id={`${category}-task`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={category === "school" ? "Add an assignment…" : "Add a shift task…"} />
        <button type="submit" aria-label={`Add ${title} task`}>+</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 && <div className="empty"><span>✦</span><p>All clear here.</p><small>Add something above when it comes up.</small></div>}
        {tasks.map((task) => (
          <article className={`task ${task.status === "Done" ? "complete" : ""}`} key={task.id}>
            <button className="check" onClick={() => onStatus(task.id, task.status === "Done" ? "To do" : "Done")} aria-label={task.status === "Done" ? `Mark ${task.title} as to do` : `Mark ${task.title} complete`}>{task.status === "Done" ? "✓" : ""}</button>
            <div className="task-copy"><h3>{task.title}</h3><span>{category === "school" ? "School" : "Shift"}</span></div>
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

  useEffect(() => {
    const saved = window.localStorage.getItem("neve-tasks");
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch { /* keep a clean list */ }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem("neve-tasks", JSON.stringify(tasks));
  }, [tasks, ready]);

  const done = tasks.filter((task) => task.status === "Done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const grouped = useMemo(() => ({
    school: tasks.filter((task) => task.category === "school"),
    shift: tasks.filter((task) => task.category === "shift"),
  }), [tasks]);

  function addTask(title: string, category: Category) {
    setTasks((current) => [{ id: crypto.randomUUID(), title, category, status: "To do" }, ...current]);
  }

  function updateStatus(id: string, status: Status) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task));
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main>
      <nav><div className="mini-mark">NRP</div><p>My little task garden</p><span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span></nav>
      <section className="hero">
        <div className="spark one">✦</div><div className="spark two">✿</div>
        <p className="eyebrow">A soft place to get things done</p>
        <h1>Neve R. Palmeri</h1>
        <div className="summary">
          <p><strong>{tasks.length - done}</strong> things left</p>
          <div className="progress" aria-label={`${progress}% complete`}><i style={{ width: `${progress}%` }} /></div>
          <p><strong>{progress}%</strong> complete</p>
        </div>
      </section>

      <div className="board">
        <TaskColumn category="school" title="School" subtitle="Learn & grow" icon="✎" tasks={grouped.school} onAdd={addTask} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn category="shift" title="Shift to-do" subtitle="On the clock" icon="☼" tasks={grouped.shift} onAdd={addTask} onStatus={updateStatus} onDelete={deleteTask} />
      </div>
      <footer><span>One thing at a time.</span><p>Made just for Neve ♡</p></footer>
    </main>
  );
}
