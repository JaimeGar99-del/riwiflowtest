import { TaskCard } from "./taskCard.js";
import { updateTask } from "../services/taskService.js";
import { authStore } from "../store/authStore.js";

const COLUMNS = [
  { id: "todo",        label: "To Do" },
  { id: "in progress", label: "In Progress" },
  { id: "in review",   label: "In Review" },
  { id: "done",        label: "Done" },
];

export function KanbanBoard(tasks, users, onDelete) {
  const board = document.createElement("div");
  board.className = "flex gap-gutter h-full overflow-x-auto pb-md";

  const currentUser = authStore.getUser();
  let draggedTaskId = null;

  COLUMNS.forEach(({ id, label }) => {
    const filtered = tasks.filter((t) => t.status === id);

    const col = document.createElement("div");
    col.className = "kanban-column flex flex-col w-1/4 h-full";
    col.dataset.status = id;

    col.innerHTML = `
      <div class="flex items-center justify-between mb-md">
        <div class="flex items-center gap-2">
          <h3 class="font-title-sm text-title-sm text-on-surface">${label}</h3>
          <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm col-count">${filtered.length}</span>
        </div>
      </div>
      <div class="col-list flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar transition-colors duration-200"></div>
    `;

    const list = col.querySelector(".col-list");

    // Drag over — highlight drop zone
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      list.classList.add("bg-primary-fixed/30", "ring-2", "ring-primary");
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary");
    });

    // Drop — update task status
    list.addEventListener("drop", async (e) => {
      e.preventDefault();
      list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary");

      if (!draggedTaskId) return;
      const task = tasks.find((t) => String(t.id) === String(draggedTaskId));
      if (!task || task.status === id) return;

      // Coders can only move their own tasks
      if (currentUser.role === "coder" && String(task.userId) !== String(currentUser.id)) return;

      await updateTask(draggedTaskId, { status: id });
      onDelete?.(); // reload board
    });

    filtered.forEach((task) => {
      const card = TaskCard(task, users, onDelete, (id) => { draggedTaskId = id; });
      list.appendChild(card);
    });

    board.appendChild(col);
  });

  return board;
}