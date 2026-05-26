import { authStore } from "../store/authStore.js";
import { navigateTo } from "../router/router.js";

export function renderNavbar() {
  const user = authStore.getUser();

  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="nav-brand">⚡ RiwiFlow</div>
    <div class="nav-info">
      <span class="nav-user">${user.name}</span>
      <span class="nav-role badge-${user.role}">${user.role}</span>
      ${user.role === "admin" ? `<button class="btn-secondary" id="createBtn">+ New Task</button>` : ""}
      <button class="btn-logout" id="logoutBtn">Logout</button>
    </div>
  `;

  nav.querySelector("#logoutBtn").addEventListener("click", () => {
    authStore.logout();
    navigateTo("/");
  });

  if (user.role === "admin") {
    nav.querySelector("#createBtn").addEventListener("click", () => {
      navigateTo("/create-task");
    });
  }

  return nav;
}