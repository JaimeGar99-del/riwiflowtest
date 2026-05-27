import { app } from "../app.js";
import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";
import { createTask, getUsers } from "../services/taskService.js";
import { renderSidebar } from "../components/sidebar.js";

export async function createTaskPage() {
  const user = authStore.getUser();
  if (user.role !== "admin") { navigateTo("/dashboard"); return; }

  const users = await getUsers();

  app.innerHTML = `<div class="bg-background text-on-background overflow-hidden h-screen flex relative" id="layout"></div>`;
  const layout = document.getElementById("layout");

  // Blob background — rendered behind content with z-0, content on z-10
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
        <h2 class="font-headline-md text-headline-md text-on-surface">Create New Task</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Add a new task to the project board</p>
      </div>
      <button id="cancelBtnHeader"
        class="flex items-center gap-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </header>

    <div class="flex-1 flex items-start justify-center px-xl py-xl">
      <div class="w-full max-w-[520px]">

        <!-- Card -->
        <div class="bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant rounded-xl p-xl space-y-lg shadow-sm">

          <div class="space-y-xs">
            <h3 class="font-title-sm text-title-sm text-on-surface">Task details</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Fill in the information below to create the task.</p>
          </div>

          <div class="border-t border-outline-variant"></div>

          <form id="createForm" class="space-y-lg">
            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface">Title</label>
              <input id="title" type="text" placeholder="Task title" required
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline" />
            </div>

            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface">Description</label>
              <textarea id="description" placeholder="Describe the task..." required rows="4"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all placeholder:text-outline resize-none"></textarea>
            </div>

            <div class="space-y-sm">
              <label class="font-label-md text-label-md text-on-surface">Assign to</label>
              <select id="userId"
                class="w-full px-md py-md bg-white border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface input-focus-ring transition-all">
                ${users.map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`).join("")}
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
                <span class="material-symbols-outlined text-[18px]">add_task</span>
                Create Task
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
  document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("[type=submit]");
    btn.disabled = true;
    btn.textContent = "Creating...";
    await createTask({
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      status: "todo",
      userId: Number(document.getElementById("userId").value),
    });
    navigateTo("/dashboard");
  });
}