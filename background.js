// background.js
// Initialize default values
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    timerRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    endTime: 0,
    blockedSites: [
      "instagram.com",
      "x.com",
      "linkedin.com",
      "youtube.com",
      "facebook.com",
      "reddit.com",
    ],
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startTimer") {
    startTimer();
  } else if (message.action === "resetTimer") {
    resetTimer();
  }
});

// Set up alarms for timer
function startTimer() {
  chrome.storage.local.get(["timeLeft"], function (result) {
    const timeLeft = result.timeLeft || 25 * 60;
    const endTime = Date.now() + timeLeft * 1000;

    chrome.storage.local.set({
      timerRunning: true,
      endTime: endTime,
    });

    // Create an alarm that fires each second
    chrome.alarms.create("pomodoroTick", { periodInMinutes: 1 / 60 });

    // Create a temporary badge to show timer is running
    chrome.action.setBadgeText({ text: "🔒" });
    chrome.action.setBadgeBackgroundColor({ color: "#d32f2f" }); // Darker red
  });
}

function resetTimer() {
  chrome.alarms.clear("pomodoroTick");

  chrome.storage.local.set({
    timerRunning: false,
    timeLeft: 25 * 60,
    endTime: 0,
  });

  chrome.action.setBadgeText({ text: "" });

  // Notify popup that timer is reset
  chrome.runtime.sendMessage({
    action: "timerUpdated",
    timeLeft: 25 * 60,
  });
}

// Handle alarm events (timer ticks)
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "pomodoroTick") {
    updateTimer();
  }
});

// Update timer on tick
function updateTimer() {
  chrome.storage.local.get(["timerRunning", "endTime"], function (result) {
    if (!result.timerRunning) return;

    const endTime = result.endTime || 0;
    const timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));

    // Update storage
    chrome.storage.local.set({ timeLeft: timeLeft });

    // Send message to popup to update UI
    chrome.runtime.sendMessage({
      action: "timerUpdated",
      timeLeft: timeLeft,
    });

    // Update badge with minutes:seconds format when less than 5 minutes
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (minutes < 5) {
      chrome.action.setBadgeText({
        text: `${minutes}:${String(seconds).padStart(2, "0")}`,
      });
    } else {
      chrome.action.setBadgeText({ text: `${minutes}m` });
    }

    // Make badge red when time is almost up (less than 2 minutes)
    if (minutes < 2) {
      chrome.action.setBadgeBackgroundColor({ color: "#b71c1c" });
    } else {
      chrome.action.setBadgeBackgroundColor({ color: "#d32f2f" });
    }

    // Check if timer has finished
    if (timeLeft <= 0) {
      timerFinished();
    }
  });
}

// Handle timer completion
function timerFinished() {
  chrome.alarms.clear("pomodoroTick");

  chrome.storage.local.set({
    timerRunning: false,
    timeLeft: 25 * 60,
    endTime: 0,
  });

  chrome.action.setBadgeText({ text: "✓" });
  chrome.action.setBadgeBackgroundColor({ color: "#4fd364" }); // Success color

  // Show simple timer completion message
  chrome.tabs.create({
    url: chrome.runtime.getURL("completed/completed.html"),
  });

  // Notify popup that timer is finished
  chrome.runtime.sendMessage({
    action: "timerFinished",
  });
}

// Check URLs for blocking
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  chrome.storage.local.get(["timerRunning", "blockedSites"], function (result) {
    if (!result.timerRunning) return;

    const url = new URL(details.url);
    const hostname = url.hostname;

    // Check if the site should be blocked
    const blockedSites = result.blockedSites || [];
    const shouldBlock = blockedSites.some((site) => hostname.includes(site));

    if (shouldBlock) {
      // Redirect to a block page with updated path
      chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL("blocked/blocked.html"),
      });
    }
  });
});
