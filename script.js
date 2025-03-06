document.addEventListener("DOMContentLoaded", function () {
  //Function for the clock in headerr----------------------------
  function clockUpdate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("clock").textContent = timeString;
  }
  setInterval(clockUpdate, 1000);
  clockUpdate();
});
