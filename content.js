/**
 * SRM Auto Login — Content Script
 * Automatically fills and submits the SRM network portal login form.
 */

const FIELD_USERNAME  = "LoginUserPassword_auth_username";
const FIELD_PASSWORD  = "LoginUserPassword_auth_password";
const BTN_LOGIN       = "UserCheck_Login_Button";

const WAIT_TIMEOUT    = 8000;
const WAIT_INTERVAL   = 200;

function waitForElement(id, timeout, interval) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el) { 
        clearInterval(timer); 
        resolve(el); 
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(new Error(`Element #${id} not found`));
      }
    }, interval);
  });
}

async function autoLogin(username, password) {
  try {
    // Wait for all form elements to load
    const userField = await waitForElement(FIELD_USERNAME, WAIT_TIMEOUT, WAIT_INTERVAL);
    const passField = await waitForElement(FIELD_PASSWORD, WAIT_TIMEOUT, WAIT_INTERVAL);
    const loginBtn  = await waitForElement(BTN_LOGIN, WAIT_TIMEOUT, WAIT_INTERVAL);

    // Small delay to ensure page JS is ready
    await new Promise(r => setTimeout(r, 500));

    // Fill username
    userField.value = username;
    userField.dispatchEvent(new Event("input", { bubbles: true }));
    userField.dispatchEvent(new Event("change", { bubbles: true }));

    // Fill password
    passField.value = password;
    passField.dispatchEvent(new Event("input", { bubbles: true }));
    passField.dispatchEvent(new Event("change", { bubbles: true }));

    // Brief pause before submitting
    await new Promise(r => setTimeout(r, 300));

    // Submit the form
    loginBtn.click();
    console.log("[SRM Auto Login] ✓ Credentials submitted successfully!");

  } catch (err) {
    console.warn("[SRM Auto Login] Error:", err.message);
  }
}

// Check storage and auto-login if enabled
chrome.storage.local.get(["username", "password", "enabled"], (data) => {
  if (data.enabled === false) {
    console.log("[SRM Auto Login] Auto-login is disabled.");
    return;
  }
  
  if (!data.username || !data.password) {
    console.warn("[SRM Auto Login] No credentials saved. Click the extension icon to set them.");
    return;
  }
  
  console.log("[SRM Auto Login] Portal detected — auto-filling credentials...");
  autoLogin(data.username, data.password);
});
