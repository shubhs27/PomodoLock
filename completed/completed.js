document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("closeBtn").addEventListener("click", function () {
    window.close();
  });

  // Automatically close after 20 sec
  setTimeout(function () {
    window.close();
  }, 20000);
});
