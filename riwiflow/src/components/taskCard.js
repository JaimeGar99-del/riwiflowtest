import { navigateTo } from "../router/router.js";
import { authStore } from "../store/authStore.js";
import { deleteTask } from "../services/taskService.js";

const STATUS_COLORS = {
  "todo": "bg-surface-container-high text-on-surface-variant",
  "in progress": "bg-primary-fixed text-on-primary-fixed-variant",
  "in review": "bg-primary-fixed text-on-primary-fixed-variant",
  "done": "bg-secondary-container text-secondary",
};

export function TaskCard(task, users = [], onDelete) {
  const user = authStore.getUser();
  const assigned = users.find((u) => u.id === task.userId);
  const canEdit = user.role === "admin" || (user.role === "coder" && task.userId === user.id);
  const isDone = task.status === "done";

  const card = document.createElement("div");
  card.className = `task-card bg-surface${isDone ? "/60 opacity-80" : ""} border border-outline-variant rounded-xl p-md shadow-sm`;

  const statusBadge = STATUS_COLORS[task.status] ?? "bg-surface-container-high text-on-surface-variant";

  card.innerHTML = `
    <div class="flex items-start justify-between mb-xs">
      <span class="${statusBadge} px-2 py-0.5 rounded-full font-label-sm text-label-sm capitalize">
        ${task.status}
      </span>
      ${isDone ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings:'FILL' 1">check_circle</span>` : ""}
    </div>
    <h4 class="font-label-md text-label-md text-on-surface mb-xs ${isDone ? "line-through" : ""}">${task.title}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant mb-0">${task.description}</p>
    <div class="mt-md flex items-center justify-between">
      <span class="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-xs">
        <span class="material-symbols-outlined text-[16px]">person</span>
        ${assigned?.name ?? "Unassigned"}
      </span>
      <div class="flex items-center gap-xs">
        ${canEdit ? `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline" data-id="${task.id}">Edit</button>` : ""}
        ${user.role === "admin" ? `<button class="btn-delete material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors" data-id="${task.id}">delete</button>` : ""}
      </div>
    </div>
  `;

  canEdit && card.querySelector(".btn-edit")?.addEventListener("click", () => navigateTo(`/edit-task?id=${task.id}`));
  user.role === "admin" && card.querySelector(".btn-delete")?.addEventListener("click", async () => {
    await deleteTask(task.id);
    onDelete?.();
  });

  return card;
}