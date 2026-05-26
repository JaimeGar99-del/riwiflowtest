import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";

export function renderSidebar() {
  const user = authStore.getUser();
  const aside = document.createElement("aside");
  aside.className = "hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0";

  aside.innerHTML = `
    <div class="px-gutter mb-xl">
      <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Product Team</p>
    </div>

    <nav class="flex-1 space-y-1">
      <a id="navDashboard"
        class="flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3 font-body-sm text-body-sm transition-all scale-[0.98] cursor-pointer">
        <span class="material-symbols-outlined mr-3">dashboard</span>
        <span>Dashboard</span>
      </a>
      <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">assignment</span>
        <span>Projects</span>
      </a>
      <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">group</span>
        <span>Team</span>
      </a>
      <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">bar_chart</span>
        <span>Reports</span>
      </a>
      <a class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 font-body-sm text-body-sm rounded-lg transition-all cursor-pointer">
        <span class="material-symbols-outlined mr-3">settings</span>
        <span>Settings</span>
      </a>
    </nav>

    <div class="px-4 mt-auto">
      ${user.role === "admin" ? `
      <button id="navCreate"
        class="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity mb-2">
        <span class="material-symbols-outlined">add</span>
        New Task
      </button>` : ""}
      <button id="logoutBtn"
        class="w-full flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">
        <span class="material-symbols-outlined text-[18px]">logout</span>
        Logout
      </button>
    </div>
  `;

  aside.querySelector("#navDashboard")?.addEventListener("click", () => navigateTo("/dashboard"));
  aside.querySelector("#navCreate")?.addEventListener("click", () => navigateTo("/create-task"));
  aside.querySelector("#logoutBtn").addEventListener("click", () => {
    authStore.logout();
    navigateTo("/");
  });

  return aside;
}