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
  main.className = "flex-1 flex flex-col overflow-hidden";
  main.innerHTML = `
    <header class="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface shrink-0">
      <div>
        <h2 class="font-headline-md text-headline-md text-on-surface">Project Board</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Logged in as <span class="text-primary font-label-md">${user.name}</span></p>
      </div>
    </header>
    <div class="flex-1 overflow-hidden px-xl py-lg" id="boardContainer">
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