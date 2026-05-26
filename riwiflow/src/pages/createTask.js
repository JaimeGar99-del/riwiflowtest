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
  main.className = "flex-1 flex flex-col min-w-0";
  main.innerHTML = `
    <header class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant z-40">
      <div class="flex items-center gap-4 flex-1">
        <div class="relative max-w-md w-full">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            class="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-full font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Search tasks or files..."
            type="text"
          />
        </div>
      </div>
      <div class="flex items-center gap-4 ml-4">
        <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
          notifications
        </button>
        <button class="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
          help_outline
        </button>
        <div class="flex items-center gap-2">
          <img
            alt="User profile"
            class="w-8 h-8 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-sF_Qd9jEF33fUrS3vMvdoA8rbw2_a6jzv7r_6oDikCkrertidHwLgqAtWuKvLnRx7Lcsi79ZYj4FBaL_pETFxeyeF27_PhXy-KnuioiYgCwYTKcWDEuZoRksSf8Jb0_ZmsxJkpTFGZ2bW8aTl5fhcA4DOHQQal_vu1KVBcizoM56dHRc7Ce_vkUul2aL96DSeDmqR4YdfGUuoIQkUF_F8AX45U05tmCFg7YyPH6xtgAx7e31u5_5e2rQxm_tgBEgnhV-LsqsEDH"
          />
          <span class="font-label-md text-label-md text-on-surface">${user.name}</span>
        </div>
      </div>
    </header>
    <div class="flex-1 flex flex-col overflow-auto">
      <div class="px-gutter py-lg border-b border-outline-variant bg-surface shrink-0">
        <h2 class="font-headline-md text-headline-md text-on-surface">Create New Task</h2>
      </div>
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