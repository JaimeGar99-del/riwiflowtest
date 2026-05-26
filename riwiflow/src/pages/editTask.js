import { app } from "../app.js";
import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";
import { getTaskById, updateTask } from "../services/taskService.js";
import { renderSidebar } from "../components/sidebar.js";

const STATUSES = ["to do", "in progress", "in review", "done"];

export async function editTaskPage() {
  const user = authStore.getUser();
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) { navigateTo("/dashboard"); return; }

  const task = await getTaskById(id);

  if (user.role === "coder" && task.userId !== user.id) {
    navigateTo("/dashboard");
    return;
  }

  const isAdmin = user.role === "admin";

  app.innerHTML = `<div class="bg-background text-on-background overflow-hidden h-screen flex" id="layout"></div>`;
  const layout = document.getElementById("layout");
  layout.appendChild(renderSidebar());

  const main = document.createElement("main");
  main.className = "flex-1 flex flex-col overflow-auto";
  main.innerHTML = `
    <header class="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface shrink-0">
      <h2 class="font-headline-md text-headline-md text-on-surface">Edit Task</h2>
    </header>
    <div class="flex-1 flex items-start justify-center px-xl py-xl">
      <div class="w-full max-w-[520px] bg-surface-container-lowest border border-outline-variant rounded-xl p-xl space-y-lg">
        <form id="editForm" class="space-y-lg">
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Title</label>
            <input id="title" type="text" value="${task.title}" ${!isAdmin ? "disabled" : ""} required
              class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Description</label>
            <textarea id="description" rows="4"
              class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all resize-none">${task.description}</textarea>
          </div>
          <div class="space-y-sm">
            <label class="font-label-md text-label-md text-on-surface">Status</label>
            <select id="status"
              class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
              ${STATUSES.map(s => `<option value="${s}" ${task.status === s ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </div>
          ${!isAdmin ? `<p class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm">
            <span class="material-symbols-outlined text-[14px] text-outline">info</span>
            As a coder you can only update description and status.
          </p>` : ""}
          <div class="flex gap-md justify-end pt-sm">
            <button type="button" id="cancelBtn"
              class="px-lg py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit"
              class="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  layout.appendChild(main);

  document.getElementById("cancelBtn").addEventListener("click", () => navigateTo("/dashboard"));
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const patch = {
      description: document.getElementById("description").value.trim(),
      status: document.getElementById("status").value,
    };
    if (isAdmin) patch.title = document.getElementById("title").value.trim();
    await updateTask(id, patch);
    navigateTo("/dashboard");
  });
}