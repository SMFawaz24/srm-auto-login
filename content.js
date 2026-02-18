/**
 * SRM Auto Login — Content Script
 * Fills credentials and closes the tab after successful login.
 */

const FIELD_USERNAME  = "LoginUserPassword_auth_username";
const FIELD_PASSWORD  = "LoginUserPassword_auth_password";
const BTN_LOGIN       = "UserCheck_Login_Button";

const WAIT_TIMEOUT    = 8000;
const WAIT_INTERVAL   = 200;
const POST_LOGIN_WAIT = 10000;
const POLL_INTERVAL   = 300;

function waitForElement(id, timeout, interval) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) { clearInterval(timer); resolve(el); }
      else if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(new Error(`#${id} not found`));
      }
    }, interval);
  });
}

async function autoLogin(username, password) {
  try {
    const userField = await waitForElement(FIELD_USERNAME, WAIT_TIMEOUT, WAIT_INTERVAL);
    const passField = await waitForElement(FIELD_PASSWORD, WAIT_TIMEOUT, WAIT_INTERVAL);
    const loginBtn  = await waitForElement(BTN_LOGIN,      WAIT_TIMEOUT, WAIT_INTERVAL);

    await new Promise(r => setTimeout(r, 500));

    userField.value = username;
    userField.dispatchEvent(new Event("input",  { bubbles: true }));
    userField.dispatchEvent(new Event("change", { bubbles: true }));

    passField.value = password;
    passField.dispatchEvent(new Event("input",  { bubbles: true }));
    passField.dispatchEvent(new Event("change", { bubbles: true }));

    await new Promise(r => setTimeout(r, 300));

    loginBtn.click();
    console.log("[SRM Auto Login] Submitted — watching for redirect...");

    // Wait a bit for the form to process
    await new Promise(r => setTimeout(r, 1000));

    const started = Date.now();
    const watcher = setInterval(() => {
      const stillOnLogin = !!document.getElementById(FIELD_USERNAME);

      if (!stillOnLogin) {
        // Page navigated away — login worked
        clearInterval(watcher);
        console.log("[SRM Auto Login] Login successful — closing tab.");
        // Tell background.js to close this tab (window.close won't work here)
        chrome.runtime.sendMessage({ action: "closeTab" });
        return;
      }

      if (Date.now() - started > POST_LOGIN_WAIT) {
        clearInterval(watcher);
        console.warn("[SRM Auto Login] Timed out — check your credentials.");
      }
    }, POLL_INTERVAL);

  } catch (err) {
    console.warn("[SRM Auto Login] Error:", err.message);
  }
}

chrome.storage.local.get(["username", "password", "enabled"], (data) => {
  if (data.enabled === false) return;
  if (!data.username || !data.password) {
    console.warn("[SRM Auto Login] No credentials saved.");
    return;
  }
  console.log("[SRM Auto Login] Portal detected — logging in...");
  autoLogin(data.username, data.password);
});
