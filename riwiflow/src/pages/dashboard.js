import { app } from "../app.js";
import { renderSidebar } from "../components/sidebar.js";
import { KanbanBoard } from "../components/kanbanBoard.js";
import { getTasks, getUsers } from "../services/taskService.js";
import { authStore } from "../store/authStore.js";

export async function dashboardPage() {
  const user = authStore.getUser();

  app.innerHTML = `
    <div class="bg-background text-on-background overflow-hidden h-screen flex" id="layout">
    </div>
  `;

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
    <div class="flex-1 overflow-hidden px-gutter py-lg" id="boardContainer">
      <p class="text-on-surface-variant font-body-md animate-pulse">Loading tasks...</p>
    </div>
  `;

  layout.appendChild(main);
  await loadBoard(document.getElementById("boardContainer"));
}

async function loadBoard(container) {
  const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
  container.innerHTML = "";
  container.appendChild(KanbanBoard(tasks, users, () => loadBoard(container)));
}