document.addEventListener("DOMContentLoaded", function () {
  //Function for the clock in headerr----------------------------
  function clockUpdate() {
    const now = new Date();
    /*Time variables*/
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    /*Date variables*/
    const day = now.getDay().toString().padStart(2, "0");
    const month = now.toLocaleString("sv-SE", { month: "long" });
    const year = now.getFullYear();
    const dateString = `${day} ${month} ${year}`;
    /*Combined variables to represent time & date*/
    const clockElement = `${timeString}   ${dateString}`;
    /*Seperated time & date to span to easily adjust the css*/
    document.getElementById("clock").innerHTML = `
    <span class="time">${timeString}</span>
    <span class="date">${dateString}</span>`;
  }
  setInterval(clockUpdate, 1000);
  clockUpdate();

  const titleElement = document.getElementById("title__edit");
  /*Added so enter doesnt make new rows only accepts title*/
  titleElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      titleElement.blur();
    }
  });

  function checkTitle() {
    if (titleElement.textContent.trim() === "") {
      titleElement.classList.add("empty");
    } else {
      titleElement.classList.remove("empty");
    }
  }
  checkTitle();
  titleElement.addEventListener("input", checkTitle);
});
