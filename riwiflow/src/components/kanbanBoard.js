import { TaskCard } from "./taskCard.js";
import { updateTask } from "../services/taskService.js";
import { authStore } from "../store/authStore.js";

const COLUMNS = [
  { id: "todo",        label: "To Do",       counterClass: "bg-surface-container-high text-on-surface-variant" },
  { id: "in progress", label: "In Progress", counterClass: "bg-primary-container text-on-primary" },
  { id: "in review",   label: "In Review",   counterClass: "bg-surface-container-high text-on-surface-variant" },
  { id: "done",        label: "Done",        counterClass: "bg-surface-container-high text-on-surface-variant" },
];

export function KanbanBoard(tasks, users, onDelete) {
  const board = document.createElement("div");
  board.className = "flex gap-gutter h-full overflow-x-auto pb-md";

  const currentUser = authStore.getUser();
  let draggedTaskId = null;

  COLUMNS.forEach(({ id, label, counterClass }) => {
    const filtered = tasks.filter((t) => t.status === id);

    const col = document.createElement("div");
    col.className = "kanban-column flex flex-col w-1/4 h-full";
    col.dataset.status = id;

    col.innerHTML = `
      <div class="flex items-center justify-between mb-md">
        <div class="flex items-center gap-2">
          <h3 class="font-title-sm text-title-sm text-on-surface">${label}</h3>
          <span class="${counterClass} px-2 py-0.5 rounded-full font-label-sm text-label-sm col-count">${filtered.length}</span>
        </div>
        <button class="material-symbols-outlined text-outline">more_horiz</button>
      </div>
      <div class="col-list flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar transition-colors duration-200"></div>
    `;

    const list = col.querySelector(".col-list");

    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      list.classList.add("bg-primary-fixed/30", "ring-2", "ring-primary");
    });

    list.addEventListener("dragleave", () => {
      list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary");
    });

    list.addEventListener("drop", async (e) => {
      e.preventDefault();
      list.classList.remove("bg-primary-fixed/30", "ring-2", "ring-primary");

      if (!draggedTaskId) return;
      const task = tasks.find((t) => String(t.id) === String(draggedTaskId));
      if (!task || task.status === id) return;

      // Coders solo pueden mover sus propias tareas
      if (currentUser.role === "coder" && String(task.userId) !== String(currentUser.id)) return;

      await updateTask(draggedTaskId, { status: id });
      onDelete?.();
    });

    filtered.forEach((task) => {
      const card = TaskCard(task, users, onDelete, (id) => { draggedTaskId = id; });
      list.appendChild(card);
    });

    board.appendChild(col);
  });

  return board;
}