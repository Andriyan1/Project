const toggleBtn = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
});