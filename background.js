/**
 * SRM Auto Login — Background Service Worker
 * Minimal background script for extension initialization
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["enabled"], (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
  });
  console.log("[SRM Auto Login] Extension installed successfully.");
});
