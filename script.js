
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const toolCards = document.querySelectorAll(".tool-card");
    const countElement = document.getElementById("count");
    const yearElement = document.getElementById("year");

    let currentFilter = "all";

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    function filterTools() {
        const keyword = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        toolCards.forEach(card => {
            const category = card.dataset.category || "";
            const title = card.querySelector("h3")?.textContent || "";
            const description = card.querySelector("p")?.textContent || "";

            const content = `${title} ${description}`.toLowerCase();

            const matchesCategory =
                currentFilter === "all" || category === currentFilter;

            const matchesKeyword = content.includes(keyword);

            const visible = matchesCategory && matchesKeyword;

            card.style.display = visible ? "" : "none";

            if (visible) {
                visibleCount++;
            }
        });

        if (countElement) {
            countElement.textContent = `${visibleCount} 个工具`;
        }

        let emptyState = document.querySelector(".empty-state");

        if (visibleCount === 0 && toolCards.length > 0) {
            if (!emptyState) {
                emptyState = document.createElement("div");
                emptyState.className = "empty-state";
                emptyState.textContent = "没有找到符合条件的工具，试试其他关键词吧。";

                const grid = document.querySelector(".tool-grid");

                if (grid) {
                    grid.appendChild(emptyState);
                }
            }

            emptyState.style.display = "block";
        } else if (emptyState) {
            emptyState.style.display = "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterTools);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            currentFilter = button.dataset.filter || "all";

            filterTools();
        });
    });

    filterTools();
});
