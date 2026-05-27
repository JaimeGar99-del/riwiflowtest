import { app } from "../app.js";
import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";
import { getTaskById, updateTask } from "../services/taskService.js";
import { renderSidebar } from "../components/sidebar.js";

const STATUSES = ["todo", "in progress", "in review", "done"];

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

  app.innerHTML = `<div class="bg-background text-on-background overflow-hidden h-screen flex relative" id="layout"></div>`;
  const layout = document.getElementById("layout");

  // Blob background
  const blobs = document.createElement("div");
  blobs.className = "pointer-events-none absolute inset-0 overflow-hidden z-0";
  blobs.innerHTML = `
    <div style="position:absolute;top:-12%;right:-8%;width:42%;height:42%;background:rgba(235,221,255,0.35);filter:blur(100px);border-radius:50%"></div>
    <div style="position:absolute;bottom:-12%;left:-8%;width:32%;height:32%;background:rgba(227,225,237,0.25);filter:blur(90px);border-radius:50%"></div>
    <div style="position:absolute;top:40%;left:30%;width:25%;height:25%;background:rgba(83,0,183,0.06);filter:blur(80px);border-radius:50%"></div>
  `;
  layout.appendChild(blobs);

  layout.appendChild(renderSidebar());

  const main = document.createElement("main");
  main.className = "flex-1 flex flex-col overflow-auto relative z-10";
  main.innerHTML = `
    <header class="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface/80 backdrop-blur-sm shrink-0">
      <div>
        <h2 class="font-headline-md text-headline-md text-on-surface">Edit Task</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Update the task information below</p>
      </div>
      <button id="cancelBtnHeader"
        class="flex items-center gap-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </header>

    <div class="flex-1 flex items-start justify-center px-xl py-xl">
      <div class="w-full max-w-[520px]">
        <div class="bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant rounded-xl p-xl space-y-lg shadow-sm">

          <div class="space-y-xs">
            <h3 class="font-title-sm text-title-sm text-on-surface">Task details</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">
              ${isAdmin ? "You can update all fields as admin." : "As a coder you can only update description and status."}
            </p>
          </div>

          <div class="border-t border-outline-variant"></div>

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

            <div class="border-t border-outline-variant"></div>

            <div class="flex gap-md justify-end">
              <button type="button" id="cancelBtn"
                class="px-lg py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button type="submit"
                class="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-[0.98] flex items-center gap-sm">
                <span class="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  layout.appendChild(main);

  document.getElementById("cancelBtn").addEventListener("click", () => navigateTo("/dashboard"));
  document.getElementById("cancelBtnHeader")?.addEventListener("click", () => navigateTo("/dashboard"));
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Saving...";
    const patch = {
      description: document.getElementById("description").value.trim(),
      status: document.getElementById("status").value,
    };
    if (isAdmin) patch.title = document.getElementById("title").value.trim();
    await updateTask(id, patch);
    navigateTo("/dashboard");
  });
}