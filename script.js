document.addEventListener("DOMContentLoaded", function () {
  function clockUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("clock").textContent = timeString;
  }
  setInterval(clockUpdate, 1000);
  clockUpdate();
});
