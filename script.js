import { GetWeather } from "./JS/weather.js";

document.addEventListener("DOMContentLoaded", function () {
  GetWeather(); // Runs the GetWeather function from weather.js
  fetchLesson();
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

  //Function for the title----------------------------
  /*Made a function to hold a placeholder when title is empty, and to handle rows when hitting enter.*/

  const titleElement = document.getElementById("title__edit");

  titleElement.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      titleElement.blur();
    }
  });
  //Saves the title to local storage
  function saveTitle() {
    const title = titleElement.textContent.trim();
    localStorage.setItem("dashboardTitle", title);
  }

  // Check if there is a saved title
  function loadTitle() {
    const savedTitle = localStorage.getItem("dashboardTitle");
    if (savedTitle) {
      titleElement.textContent = savedTitle;
    }
  }

  function checkTitle() {
    if (titleElement.textContent.trim() === "") {
      titleElement.classList.add("empty");
    } else {
      titleElement.classList.remove("empty");
    }
  }

  titleElement.addEventListener("input", () => {
    checkTitle();
    saveTitle();
  });

  loadTitle();
  /*---------------function to fetch random background from unsplash or default first visit---------------*/

  const defaultBackground = "./back.jpg";
  const accessKey = "bUcIPNWneomXsMItMG8imXP-Ba1zPQ7SNX-thDBJPpg";
  const button = document.getElementById("random__background-button");

  button.addEventListener("click", () => {
    fetchBackground();
  });

  loadBackground();
  //Loads the background from localstorage or sets to default first visit.
  function loadBackground() {
    const savedBackground = localStorage.getItem("dashboardBackground");

    if (savedBackground) {
      document.body.style.backgroundImage = `url(${savedBackground})`;
    } else {
      document.body.style.backgroundImage = `url(${defaultBackground})`;
    }
  }

  async function fetchBackground() {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=${accessKey}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.urls.full;
        document.body.style.backgroundImage = `url(${imageUrl})`;

        localStorage.setItem("dashboardBackground", imageUrl);
      })
      .catch((error) => {
        console.error("Error: Could not fetch background image.", error);
      });
  }

  //Code for the modal and favourite links----------------------------

  const openModalButton = document.getElementById("link__Modal-Button");
  const linkModal = document.getElementById("link__Modal");
  const closeModalButton = document.querySelector(".close");
  const addLinkForm = document.getElementById("addLink");
  const linkURLInput = document.getElementById("linkURL");
  const linkTitleInput = document.getElementById("linkTitle");
  const linkList = document.getElementById("links");

  let savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];

  // Modal messing might check this later.
  window.onload = function () {
    document.getElementById("link__Modal").style.display = "none";
  };

  function saveLinks() {
    localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
  }

  function renderLinks() {
    linkList.innerHTML = "";

    savedLinks.forEach((link, index) => {
      const li = document.createElement("li");
      li.style.marginBottom = "10px";

      const linkContainer = document.createElement("div");
      linkContainer.classList.add("link-item");
      linkContainer.style.display = "flex";
      linkContainer.style.alignItems = "center";
      linkContainer.style.justifyContent = "space-between";
      linkContainer.style.gap = "10px";

      const favicon = document.createElement("img");
      favicon.src = `https://www.google.com/s2/favicons?domain=${link.url}`;
      favicon.alt = "Favicon";

      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.textContent = link.title;
      linkElement.target = "_blank";

      linkContainer.appendChild(favicon);
      linkContainer.appendChild(linkElement);

      const delete__ButtonContainer = document.createElement("div");
      delete__ButtonContainer.classList.add("delete__ButtonContainer");

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete__Button");

      const icon = document.createElement("i");
      icon.classList.add("fas", "fa-minus-circle");
      icon.alt = "X"; // X as delete if icon fails.

      deleteButton.appendChild(icon);

      deleteButton.addEventListener("click", () => {
        deleteLink(index);
      });

      linkContainer.appendChild(deleteButton);

      li.appendChild(linkContainer);

      linkList.appendChild(li);
    });
  }

  openModalButton.addEventListener("click", () => {
    linkModal.style.display = "flex";
  });

  closeModalButton.addEventListener("click", () => {
    linkModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === linkModal) {
      linkModal.style.display = "none";
    }
  });

  addLinkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const url = linkURLInput.value.trim();
    const title = linkTitleInput.value.trim();

    if (!url || !title) {
      alert("Please fill out both fields.");
      return;
    }

    const newLink = {
      url,
      title,
    };

    savedLinks.push(newLink);

    saveLinks();
    renderLinks();

    addLinkForm.reset();
    linkModal.style.display = "none";
  });

  function deleteLink(index) {
    savedLinks.splice(index, 1);
    saveLinks();
    renderLinks();
  }

  renderLinks();

  /*-----------------Save Notes---------------------*/

  const notesElement = document.getElementById("notes");

  function saveNotes() {
    const notesContent = notesElement.value.trim();
    localStorage.setItem("userNotes", notesContent);
  }

  function loadNotes() {
    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) {
      notesElement.value = savedNotes;
    }
  }

  notesElement.addEventListener("input", () => {
    saveNotes();
  });

  loadNotes();
});

/*-----------------LIFE LESSONS API----------------*/

const fetchLesson = async () => {
  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();
    const lesson = data.slip.advice;

    // Visa rådet på sidan
    document.getElementById("lesson__Content").textContent = lesson;
  } catch (error) {
    console.error("Error fetching advice:", error);
  }
};
window.onload = fetchLesson;

document
  .getElementById("lesson__Button")
  .addEventListener("click", fetchLesson);
