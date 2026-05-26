import { TaskCard } from "./taskCard.js";

const COLUMNS = [
  { id: "todo",        label: "To Do" },
  { id: "in progress", label: "In Progress" },
  { id: "in review",   label: "In Review" },
  { id: "done",        label: "Done" },
];

export function KanbanBoard(tasks, users, onDelete) {
  const board = document.createElement("div");
  board.className = "flex gap-gutter h-full overflow-x-auto pb-md";

  COLUMNS.forEach(({ id, label }) => {
    const filtered = tasks.filter((t) => t.status === id);

    const col = document.createElement("div");
    col.className = "kanban-column flex flex-col w-1/4 h-full";

    col.innerHTML = `
      <div class="flex items-center justify-between mb-md">
        <div class="flex items-center gap-2">
          <h3 class="font-title-sm text-title-sm text-on-surface">${label}</h3>
          <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm">${filtered.length}</span>
        </div>
      </div>
      <div class="col-list flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"></div>
    `;

    const list = col.querySelector(".col-list");
    filtered.forEach((task) => list.appendChild(TaskCard(task, users, onDelete)));

    board.appendChild(col);
  });

  return board;
}