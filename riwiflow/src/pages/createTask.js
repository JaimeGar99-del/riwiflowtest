import { app } from "../app.js";
import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";
import { createTask, getUsers } from "../services/taskService.js";
import { renderSidebar } from "../components/sidebar.js";

export async function createTaskPage() {
  const user = authStore.getUser();
  if (user.role !== "admin") { navigateTo("/dashboard"); return; }

  const users = await getUsers();

  app.innerHTML = `<div class="bg-background text-on-background overflow-hidden h-screen flex" id="layout"></div>`;
  const layout = document.getElementById("layout");
  layout.appendChild(renderSidebar());

  const main = document.createElement("main");
  main.className = "flex-1 flex flex-col overflow-auto";
  main.innerHTML = `
    <header class="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface shrink-0">
      <h2 class="font-headline-md text-headline-md text-on-surface">Create New Task</h2>
    </header>
    <div class="flex-1 flex items-start justify-center px-xl py-xl">
      <div class="w-full max-w-[520px] bg-surface-container-lowest border border-outline-variant rounded-xl p-xl space-y-lg">
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
          <div class="flex gap-md justify-end pt-sm">
            <button type="button" id="cancelBtn"
              class="px-lg py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit"
              class="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-[0.98]">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  layout.appendChild(main);

  document.getElementById("cancelBtn").addEventListener("click", () => navigateTo("/dashboard"));
  document.getElementById("createForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await createTask({
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      status: "todo",
      userId: Number(document.getElementById("userId").value),
    });
    navigateTo("/dashboard");
  });
}