/**
 * SRM Auto Login — Background Service Worker
 * Listens for closeTab message from content.js and closes the portal tab.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["enabled"], (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true });
    }
  });
});

// Listen for message from content.js to close the tab
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "closeTab" && sender.tab?.id) {
    // Small delay so the success page briefly flashes (feels natural)
    setTimeout(() => {
      chrome.tabs.remove(sender.tab.id);
    }, 800);
  }
});
