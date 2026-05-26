import { authStore } from "../store/authStore.js";
import { loginPage } from "../pages/login.js";
import { dashboardPage } from "../pages/dashboard.js";
import { createTaskPage } from "../pages/createTask.js";
import { editTaskPage } from "../pages/editTask.js";
import { app } from "../app.js";

const routes = {
  "/": loginPage,
  "/dashboard": dashboardPage,
  "/create-task": createTaskPage,
  "/edit-task": editTaskPage,
};

export function navigateTo(path) {
  history.pushState(null, null, path);
  renderRoute();
}

function renderRoute() {
  const path = window.location.pathname;
  const user = authStore.getUser();

  if (path !== "/" && !user) { navigateTo("/"); return; }
  if (path === "/" && user) { navigateTo("/dashboard"); return; }

  const page = routes[path] ?? routes["/"];
  app.innerHTML = "";
  page();
}

window.addEventListener("popstate", renderRoute);

export function initRouter() {
  renderRoute();
}