// script.js
// Fetch NASA APOD image for the chosen date and allow saving to localStorage.

const NASA_API_KEY = "MZZIJgDxx6L928f2muQCa0GbEBNqyxVLxa7J4nbH";
const API_URL = "https://api.nasa.gov/planetary/apod";

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("apod-date");
  const loadBtn = document.getElementById("load-btn");
  const saveBtn = document.getElementById("save-btn");
  const title = document.getElementById("photo-title");
  const img = document.getElementById("apod-image");
  const caption = document.querySelector(".photo-caption");

  let currentApod = null;

  async function fetchApod(date) {
    try {
      const response = await fetch(`${API_URL}?api_key=${NASA_API_KEY}&date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch APOD.");
      const data = await response.json();

      currentApod = data; // store current photo details
      title.textContent = data.title || "Astronomy Picture of the Day";
      img.src = data.url;
      img.alt = data.title || "NASA APOD image";
      caption.textContent = data.explanation || "";

    } catch (err) {
      console.error(err);
      title.textContent = "Error loading image";
      caption.textContent = "Could not fetch APOD. Please try another date.";
    }
  }

  // Load today's image
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = today;
  fetchApod(today);

  loadBtn.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) return alert("Please choose a date first.");
    fetchApod(selectedDate);
  });

  // Save current APOD
  saveBtn.addEventListener("click", () => {
    if (!currentApod) return alert("No image loaded yet.");

    const saved = JSON.parse(localStorage.getItem("savedApods") || "[]");

    // prevent duplicates
    if (saved.some(item => item.date === currentApod.date)) {
      alert("This image is already saved.");
      return;
    }

    saved.push({
      title: currentApod.title,
      url: currentApod.url,
      date: currentApod.date,
      explanation: currentApod.explanation
    });

    localStorage.setItem("savedApods", JSON.stringify(saved));
    alert("Saved successfully!");
  });
});
