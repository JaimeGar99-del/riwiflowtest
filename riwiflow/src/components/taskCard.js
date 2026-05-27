import { navigateTo } from "../router/router.js";
import { authStore } from "../store/authStore.js";
import { deleteTask } from "../services/taskService.js";


const STATUS_STYLES = {
  "todo":        { badge: "bg-surface-container-high text-on-surface-variant",   border: "",                            counter: "bg-surface-container-high text-on-surface-variant" },
  "in progress": { badge: "bg-primary-fixed text-on-primary-fixed-variant",      border: "border-l-4 border-l-primary", counter: "bg-primary-container text-on-primary" },
  "in review":   { badge: "bg-primary-fixed text-on-primary-fixed-variant",      border: "",                            counter: "bg-surface-container-high text-on-surface-variant" },
  "done":        { badge: "bg-secondary-container text-secondary",               border: "",                            counter: "bg-surface-container-high text-on-surface-variant" },
};

const ROLE_LABEL = {
  admin:  "Ops",
  coder:  "Engineering",
};

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function TaskCard(task, users = [], onDelete, onDragStart) {
  const user     = authStore.getUser();
  const assigned = users.find((u) => String(u.id) === String(task.userId));
  const canEdit  = user.role === "admin" || (user.role === "coder" && String(task.userId) === String(user.id));
  const canDrag  = user.role === "admin" || (user.role === "coder" && String(task.userId) === String(user.id));
  const isDone   = task.status === "done";
  const isInProgress = task.status === "in progress";

  const styles  = STATUS_STYLES[task.status] ?? STATUS_STYLES["todo"];
  const category = ROLE_LABEL[assigned?.role] ?? assigned?.role ?? "Task";

  const card = document.createElement("div");
  card.className = [
    "task-card bg-surface border border-outline-variant rounded-xl p-md shadow-sm",
    isDone ? "opacity-80" : "",
    isInProgress ? styles.border : "",
    canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-default",
  ].filter(Boolean).join(" ");
  card.setAttribute("draggable", canDrag ? "true" : "false");

  const topIconHtml = isDone
    ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings:'FILL' 1">check_circle</span>`
    : isInProgress
      ? `<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings:'FILL' 1">star</span>`
      : "";

  const avatarHtml = `
    <div class="flex items-center gap-xs">
      <div class="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 border-2 border-surface">
        <span class="font-label-sm text-on-primary-fixed-variant" style="font-size:10px">${initials(assigned?.name)}</span>
      </div>
      <div class="flex flex-col leading-tight min-w-0">
        <span class="font-label-md text-label-md text-on-surface truncate" style="font-size:12px">${escapeHtml(assigned?.name ?? "Unassigned")}</span>
        ${assigned ? `<span class="font-body-sm text-on-surface-variant capitalize" style="font-size:10px">${escapeHtml(assigned.role)}</span>` : ""}
      </div>
    </div>`;

  let actionHtml = "";
  if (isDone) {
    actionHtml = `<span class="font-label-sm text-label-sm text-outline">Completed</span>`;
  } else if (task.status === "in review" && canEdit) {
    actionHtml = `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline" data-id="${task.id}">Review now</button>`;
  } else if (task.status === "in progress") {
    actionHtml = `
      <span class="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
        <span class="material-symbols-outlined text-sm">hourglass_empty</span>
        Today
      </span>`;
  } else {

    actionHtml = `
      <div class="flex items-center gap-xs">
        ${canEdit  ? `<button class="btn-edit text-primary font-label-sm text-label-sm hover:underline" data-id="${task.id}">Edit</button>` : ""}
        ${user.role === "admin" ? `<button class="btn-delete material-symbols-outlined text-[18px] text-outline hover:text-error transition-colors" data-id="${task.id}">delete</button>` : ""}
      </div>`;
  }

  card.innerHTML = `
    <div class="flex items-start justify-between mb-xs">
      <span class="${styles.badge} px-2 py-0.5 rounded-full font-label-sm text-label-sm">${escapeHtml(category)}</span>
      ${topIconHtml}
    </div>

    <h4 class="font-label-md text-label-md text-on-surface mb-xs ${isDone ? "line-through" : ""}">${escapeHtml(task.title)}</h4>
    <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${escapeHtml(task.description)}</p>

    <div class="mt-md flex items-center justify-between">
      ${avatarHtml}
      ${actionHtml}
    </div>
  `;

  card.addEventListener("dragstart", (e) => {
    if (!canDrag) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(task.id);
  });

  card.querySelector(".btn-edit")?.addEventListener("click", () => navigateTo(`/edit-task?id=${task.id}`));

  // Delete
  if (user.role === "admin") {
    card.querySelector(".btn-delete")?.addEventListener("click", async () => {
      await deleteTask(task.id);
      onDelete?.();
    });
  }

  return card;
}