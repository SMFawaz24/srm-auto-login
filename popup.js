/**
 * SRM Auto Login — Popup Script
 */

const elUsername = document.getElementById("username");
const elPassword = document.getElementById("password");
const elToggle   = document.getElementById("toggle-enabled");
const elStatus   = document.getElementById("toggle-status");
const elSaveBtn  = document.getElementById("btn-save");
const elShowPass = document.getElementById("show-pass");
const elBar      = document.getElementById("status-bar");
const elBarMsg   = document.getElementById("status-msg");
const elBarIcon  = document.getElementById("status-icon");

// ── Load saved data on popup open ───────────────────────────────────────────

chrome.storage.local.get(["username", "password", "enabled"], (data) => {
  if (data.username) elUsername.value = data.username;
  if (data.password) elPassword.value = data.password;

  const isEnabled = data.enabled !== false; // default true
  elToggle.checked = isEnabled;
  updateToggleLabel(isEnabled);
});

// ── Toggle auto-login on/off ─────────────────────────────────────────────────

elToggle.addEventListener("change", () => {
  const enabled = elToggle.checked;
  chrome.storage.local.set({ enabled }, () => {
    updateToggleLabel(enabled);
    showStatus(
      enabled ? "✓ Auto-login enabled" : "Auto-login paused",
      enabled ? "success" : "error"
    );
  });
});

function updateToggleLabel(enabled) {
  elStatus.textContent = enabled
    ? "Will auto-login when portal is detected"
    : "Disabled — click to re-enable";
}

// ── Save credentials ─────────────────────────────────────────────────────────

elSaveBtn.addEventListener("click", () => {
  const username = elUsername.value.trim();
  const password = elPassword.value;

  if (!username) {
    showStatus("⚠ Please enter your username", "error");
    elUsername.focus();
    return;
  }
  if (!password) {
    showStatus("⚠ Please enter your password", "error");
    elPassword.focus();
    return;
  }

  elSaveBtn.textContent = "Saving...";
  elSaveBtn.disabled = true;

  chrome.storage.local.set({ username, password }, () => {
    elSaveBtn.textContent = "Save Credentials";
    elSaveBtn.disabled = false;
    showStatus("✓ Credentials saved! Auto-login is ready.", "success");
  });
});

// ── Show/hide password ───────────────────────────────────────────────────────

elShowPass.addEventListener("click", () => {
  const isHidden = elPassword.type === "password";
  elPassword.type = isHidden ? "text" : "password";
  elShowPass.textContent = isHidden ? "🙈" : "👁";
});

// ── Status bar helper ────────────────────────────────────────────────────────

let statusTimer = null;

function showStatus(msg, type = "success") {
  elBarMsg.textContent = msg;
  elBar.className = `status-bar ${type} show`;

  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    elBar.classList.remove("show");
  }, 3000);
}

// ── Allow saving with Enter key ──────────────────────────────────────────────

[elUsername, elPassword].forEach(el => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") elSaveBtn.click();
  });
});
