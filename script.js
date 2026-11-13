const searchInput = document.querySelector("#searchInput");
const filters = [...document.querySelectorAll(".filter")];
const cards = [...document.querySelectorAll(".tool-card")];
const emptyState = document.querySelector("#emptyState");
const toolCount = document.querySelector("#toolCount");
let activeFilter = "all";

function updateTools() {
  const keyword = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
    const textMatch = (card.dataset.search + " " + card.innerText).toLowerCase().includes(keyword);
    const show = categoryMatch && textMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible !== 0;
  toolCount.textContent = `${String(visible).padStart(2, "0")} TOOLS`;
}
filters.forEach(button => button.addEventListener("click", () => {
  filters.forEach(item => item.classList.toggle("active", item === button));
  activeFilter = button.dataset.filter;
  updateTools();
}));
searchInput.addEventListener("input", updateTools);
document.querySelector("#year").textContent = new Date().getFullYear();
updateTools();
