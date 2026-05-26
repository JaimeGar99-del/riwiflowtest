import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";

export function renderSidebar() {
  const user = authStore.getUser();
  const aside = document.createElement("aside");
  aside.className = "hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0";

  aside.innerHTML = `
    <div class="px-gutter mb-xl">
      <h1 class="font-headline-md text-headline-md font-bold text-primary">Riwiflow</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${user.role === "admin" ? "Admin Workspace" : "Coder Workspace"}</p>
    </div>

    <nav class="flex flex-col gap-xs px-sm flex-1">
      <button id="navDashboard"
        class="flex items-center gap-md px-md py-sm rounded-full bg-secondary-container text-on-surface font-label-md text-label-md w-full text-left">
        <span class="material-symbols-outlined text-primary">dashboard</span>
        Dashboard
      </button>
      ${user.role === "admin" ? `
      <button id="navCreate"
        class="flex items-center gap-md px-md py-sm rounded-full hover:bg-surface-container text-on-surface font-label-md text-label-md w-full text-left transition-colors">
        <span class="material-symbols-outlined text-on-surface-variant">add_circle</span>
        New Task
      </button>` : ""}
    </nav>

    <div class="mt-auto px-sm">
      <div class="flex items-center gap-md px-md py-sm rounded-xl border border-outline-variant">
        <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
          <span class="material-symbols-outlined text-on-primary-fixed-variant text-[18px]">person</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-label-md text-label-md text-on-surface truncate">${user.name}</p>
          <p class="font-body-sm text-body-sm text-on-surface-variant capitalize">${user.role}</p>
        </div>
        <button id="logoutBtn" class="material-symbols-outlined text-outline hover:text-error transition-colors" title="Logout">
          logout
        </button>
      </div>
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