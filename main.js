import { initApplicant } from "./modules/applicant.js";
import { initApprover } from "./modules/approver.js";
import { initManager } from "./modules/manager.js";

const roleButtons = document.querySelectorAll(".role-toggle button");
const panels = document.querySelectorAll(".panel");
const toast = document.getElementById("toast");

let toastTimer = null;
const showToast = (message, duration = 1600) => {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), duration);
};

const switchRole = (role) => {
  roleButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.role === role));
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === role));
};

roleButtons.forEach((btn) => {
  btn.addEventListener("click", () => switchRole(btn.dataset.role));
});

initApplicant(showToast);
initApprover(showToast);
initManager(showToast);
switchRole("applicant");
