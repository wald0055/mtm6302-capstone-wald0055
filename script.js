const NASA_API_KEY = "g9TmtpcPre7C9i5zJSrb64x9ZBXHMFyadcilimnZ";
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

      currentApod = data;
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

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const localDate = today.toISOString().split("T")[0];
  dateInput.value = localDate;
  fetchApod(localDate);

  loadBtn.addEventListener("click", () => {
    const selectedDate = dateInput.value;
    if (!selectedDate) return alert("Please choose a date first.");
    fetchApod(selectedDate);
  });

  saveBtn.addEventListener("click", () => {
    if (!currentApod) return alert("No image loaded yet.");

    const saved = JSON.parse(localStorage.getItem("savedApods") || "[]");

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