function updateTimer() {
  chrome.storage.local.get(["endTime"], function (result) {
    const endTime = result.endTime || 0;
    const timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").textContent = `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;

    if (timeLeft > 0) {
      setTimeout(updateTimer, 1000);
    }
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateTimer();

  document.getElementById("returnBtn").addEventListener("click", function () {
    history.back();
  });

  document.getElementById("overrideBtn").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "resetTimer" });
    history.back();
  });
});
