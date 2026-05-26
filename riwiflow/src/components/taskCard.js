import { navigateTo } from "../router/router.js";
import { authStore } from "../store/authStore.js";
import { deleteTask } from "../services/taskService.js";

export function TaskCard(task, users = [], onDelete) {
  const user = authStore.getUser();
  const assigned = users.find((u) => u.id === task.userId);
  const canEdit = user.role === "admin" || (user.role === "coder" && task.userId === user.id);
  const isDone = task.status === "done";
  const isInProgress = task.status === "in progress";

  const card = document.createElement("div");
  card.className = `task-card bg-surface${isDone ? "/60 opacity-80" : ""} border ${isInProgress ? "border-l-4 border-l-primary" : ""} border-outline-variant rounded-xl p-md shadow-sm`;

  card.innerHTML = `
    <div class="flex items-start justify-between mb-xs">
      <span class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm capitalize">
        ${task.status}
      </span>
      ${isDone
        ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings:'FILL' 1">check_circle</span>`
        : isInProgress
          ? `<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings:'FILL' 1">star</span>`
          : ""
      }
    </div>
    <h4 class="font-label-md text-label-md text-on-surface mb-xs ${isDone ? "line-through" : ""}">${task.title}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${task.description}</p>
    <div class="mt-md flex items-center justify-between">
      <div class="flex -space-x-2">
        <div class="w-6 h-6 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary-fixed-variant" style="font-size:14px">person</span>
        </div>
      </div>
      <div class="flex items-center gap-xs">
        ${canEdit
          ? `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline" data-id="${task.id}">Edit</button>`
          : `<span class="font-label-sm text-label-sm text-outline">${isDone ? "Completed" : assigned?.name ?? "Unassigned"}</span>`
        }
        ${user.role === "admin"
          ? `<button class="btn-delete material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors" data-id="${task.id}">delete</button>`
          : ""
        }
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