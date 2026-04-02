function formatINR(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showSuccessPopup(message) {
  const modal = document.getElementById("successModal");
  const textEl = document.getElementById("successModalText");
  if (!modal || !textEl) {
    window.alert(message);
    return;
  }
  textEl.textContent = message;
  modal.classList.add("active");
}

function setupSidebar() {
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  if (!toggle || !sidebar) return;
  toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}

function setupModal() {
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.getAttribute("data-open-modal"));
      if (modal) modal.classList.add("active");
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".modal")?.classList.remove("active");
    });
  });

}

function activateNav() {
  const page = document.body.getAttribute("data-page");
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}

function setupDummyButtons() {
  document.querySelectorAll("[data-dummy]").forEach((el) => {
    el.addEventListener("click", () => showToast(el.getAttribute("data-dummy")));
  });
}

function setupAdminInfo() {
  const page = document.body.getAttribute("data-page");
  if (["login", "register"].includes(page)) return;
  if (typeof getCurrentAdmin !== "function") return;
  const admin = getCurrentAdmin();
  if (!admin) return;

  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  let rightWrap = topbar.querySelector(".topbar-right");
  if (!rightWrap) {
    rightWrap = document.createElement("div");
    rightWrap.className = "topbar-right";
    rightWrap.style.display = "flex";
    rightWrap.style.alignItems = "center";
    rightWrap.style.gap = "8px";
    topbar.appendChild(rightWrap);
  }

  const adminChip = document.createElement("span");
  adminChip.className = "badge badge-success";
  adminChip.textContent = `${admin.name}`;
  rightWrap.appendChild(adminChip);

  const logoutBtn = document.createElement("button");
  logoutBtn.className = "btn";
  logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
  logoutBtn.addEventListener("click", logoutAdmin);
  rightWrap.appendChild(logoutBtn);
}

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupModal();
  activateNav();
  setupDummyButtons();
  setupAdminInfo();
});
