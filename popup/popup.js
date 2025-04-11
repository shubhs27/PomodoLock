// popup/popup.js
document.addEventListener("DOMContentLoaded", function () {
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const siteList = document.getElementById("siteList");
  const newSiteInput = document.getElementById("newSite");
  const addSiteBtn = document.getElementById("addSiteBtn");

  // Default blocked sites
  const defaultSites = [
    "instagram.com",
    "x.com",
    "linkedin.com",
    "youtube.com",
    "facebook.com",
    "reddit.com",
  ];

  // Initialize blocked sites in storage if not already set
  chrome.storage.local.get(["blockedSites"], function (result) {
    if (!result.blockedSites) {
      chrome.storage.local.set({ blockedSites: defaultSites }, function () {
        updateSiteList(defaultSites);
      });
    } else {
      updateSiteList(result.blockedSites);
    }
  });

  // Initialize timer state
  updateTimerUI();

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);
  addSiteBtn.addEventListener("click", addSite);
  newSiteInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addSite();
    }
  });

  // Update UI based on timer state
  function updateTimerUI() {
    chrome.storage.local.get(["timerRunning", "timeLeft"], function (result) {
      const timerRunning = result.timerRunning || false;

      if (timerRunning) {
        startBtn.disabled = true; // Disable Start button when timer is running
        timerDisplay.classList.add("timer-active");
        const timeLeft = result.timeLeft || 25 * 60;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      } else {
        startBtn.disabled = false; // Enable Start button when timer is not running
        timerDisplay.classList.remove("timer-active");
        const timeLeft = result.timeLeft || 25 * 60;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      }
    });
  }

  // Start timer
  function startTimer() {
    chrome.storage.local.get(["timerRunning"], function (result) {
      if (!result.timerRunning) {
        chrome.runtime.sendMessage({ action: "startTimer" });
        timerDisplay.classList.add("timer-active");
        startBtn.disabled = true; // Disable Start button when timer is running
      }
    });
  }

  // Reset timer
  function resetTimer() {
    chrome.runtime.sendMessage({ action: "resetTimer" });
    timerDisplay.classList.remove("timer-active");
    startBtn.disabled = false; // Enable Start button when timer is reset
    updateTimerUI();
  }

  // Add a new site to block list
  function addSite() {
    const newSite = newSiteInput.value.trim();
    if (!newSite) return;

    // Get current list and add new site
    chrome.storage.local.get(["blockedSites"], function (result) {
      const sites = result.blockedSites || [];
      if (!sites.includes(newSite)) {
        sites.push(newSite);
        chrome.storage.local.set({ blockedSites: sites }, function () {
          updateSiteList(sites);
          newSiteInput.value = "";
          // Show add confirmation with subtle animation
          const originalText = addSiteBtn.textContent;
          addSiteBtn.textContent = "Added!";
          addSiteBtn.style.backgroundColor = "#16a34a";
          setTimeout(() => {
            addSiteBtn.textContent = originalText;
            addSiteBtn.style.backgroundColor = "";
          }, 1000);
        });
      } else {
        newSiteInput.value = "";
        const originalText = addSiteBtn.textContent;
        addSiteBtn.textContent = "Already Added";
        addSiteBtn.style.backgroundColor = "#dc2626";
        setTimeout(() => {
          addSiteBtn.textContent = originalText;
          addSiteBtn.style.backgroundColor = "";
        }, 1000);
      }
    });
  }

  // Delete a site from block list
  function deleteSite(site) {
    chrome.storage.local.get(["blockedSites"], function (result) {
      const sites = result.blockedSites || [];
      const updatedSites = sites.filter((s) => s !== site);
      chrome.storage.local.set({ blockedSites: updatedSites }, function () {
        updateSiteList(updatedSites);
      });
    });
  }

  // Update the site list in the UI
  function updateSiteList(sites) {
    siteList.innerHTML = "";

    if (sites.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "site-item";
      emptyMessage.style.justifyContent = "center";
      emptyMessage.style.color = "var(--text-secondary)";
      emptyMessage.textContent = "No websites added yet";
      siteList.appendChild(emptyMessage);
      return;
    }

    sites.forEach((site) => {
      const siteElement = document.createElement("div");
      siteElement.className = "site-item";

      const siteText = document.createElement("span");
      siteText.textContent = site;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deleteSite(site);
      });

      siteElement.appendChild(siteText);
      siteElement.appendChild(deleteButton);
      siteList.appendChild(siteElement);
    });
  }

  // Listen for timer updates from background script
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "timerUpdated") {
      const timeLeft = message.timeLeft;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }

    if (message.action === "timerFinished") {
      updateTimerUI();
    }
  });
});
