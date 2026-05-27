import { navigateTo } from "../router/router.js";
import { authStore } from "../store/authStore.js";
import { deleteTask } from "../services/taskService.js";

const STATUS_COLORS = {
  "todo":        "bg-surface-container-high text-on-surface-variant",
  "in progress": "bg-primary-fixed text-on-primary-fixed-variant",
  "in review":   "bg-primary-fixed text-on-primary-fixed-variant",
  "done":        "bg-secondary-container text-secondary",
};

// Returns initials from a name
function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function TaskCard(task, users = [], onDelete, onDragStart) {
  const user = authStore.getUser();
  // Compare as strings to handle id:"2" vs userId:2 mismatch from db.json
  const assigned = users.find((u) => String(u.id) === String(task.userId));
  const canEdit = user.role === "admin" || (user.role === "coder" && String(task.userId) === String(user.id));
  const isDone = task.status === "done";

  const card = document.createElement("div");
  card.className = `task-card bg-surface${isDone ? "/60 opacity-80" : ""} border border-outline-variant rounded-xl p-md shadow-sm cursor-grab active:cursor-grabbing`;
  card.setAttribute("draggable", "true");

  const statusBadge = STATUS_COLORS[task.status] ?? "bg-surface-container-high text-on-surface-variant";

  card.innerHTML = `
    <div class="flex items-start justify-between mb-xs">
      <span class="${statusBadge} px-2 py-0.5 rounded-full font-label-sm text-label-sm capitalize">
        ${task.status}
      </span>
      ${isDone ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings:'FILL' 1">check_circle</span>` : ""}
    </div>

    <h4 class="font-label-md text-label-md text-on-surface mb-xs ${isDone ? "line-through" : ""}">${task.title}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant mb-md">${task.description}</p>

    <!-- Assignee row -->
    <div class="flex items-center gap-xs bg-surface-container-low rounded-lg px-sm py-xs mb-md">
      <div class="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
        <span class="font-label-sm text-on-primary-fixed-variant" style="font-size:10px">${initials(assigned?.name)}</span>
      </div>
      <div class="flex flex-col leading-tight min-w-0">
        <span class="font-label-md text-label-md text-on-surface truncate">${assigned?.name ?? "Unassigned"}</span>
        ${assigned ? `<span class="font-body-sm text-on-surface-variant capitalize" style="font-size:11px">${assigned.role}</span>` : ""}
      </div>
    </div>

    <div class="flex items-center justify-end gap-xs">
      ${canEdit ? `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline" data-id="${task.id}">Edit</button>` : ""}
      ${user.role === "admin" ? `<button class="btn-delete material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors" data-id="${task.id}">delete</button>` : ""}
    </div>
  `;

  // Drag start — pass task id up
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(task.id);
  });

  canEdit && card.querySelector(".btn-edit")?.addEventListener("click", () => navigateTo(`/edit-task?id=${task.id}`));
  user.role === "admin" && card.querySelector(".btn-delete")?.addEventListener("click", async () => {
    await deleteTask(task.id);
    onDelete?.();
  });

  return card;
}