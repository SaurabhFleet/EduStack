// ===== CONFIG =====
const container = document.getElementById("modulesContainer");
const searchInput = document.getElementById("searchInput");
const showMoreBtn = document.getElementById("showMoreBtn");

let visibleCount = 8;
let filteredData = [...classicData];
let visibleBooks = [];

// ===== RENDER CARDS =====
function renderBooks() {
    container.innerHTML = "";

    // const shuffledData = [...filteredData].sort(() => Math.random() - 0.5);
    // visibleBooks = shuffledData.slice(0, visibleCount);
    visibleBooks = filteredData.slice(0, visibleCount);

    if (visibleBooks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px;">
            No books found
        </div>`;
        showMoreBtn.style.display = "none";
        return;
    }

    visibleBooks.forEach((b, index) => {
        const card = `
        <div class="col-lg-3 col-md-6 module-card"
             data-title="${b.title.toLowerCase()}">

            <div class="card shadow border-0 h-100">
                <div class="card-body">

                    <h5 class="card-title">${b.title}</h5>

                    <button class="btn btn-sm text-light btn-open"
                        data-index="${index}"
                        data-bs-toggle="modal"
                        data-bs-target="#openModal">
                        Open
                    </button>

                </div>
            </div>
        </div>
        `;
        container.innerHTML += card;
    });

    attachOpenEvents();
    toggleShowMore();
}

// ===== FILTER =====
function filterBooks() {
    const search = searchInput.value.toLowerCase().trim();

    visibleCount = 8;

    if (search) {
        filteredData = classicData.filter(b => b.title.toLowerCase().includes(search));
    } else {
        filteredData = [...classicData];
    }

    renderBooks();
}

// ===== SHOW MORE =====
function showMore() {
    visibleCount += 8;
    renderBooks();
}

// ===== BUTTON VISIBILITY =====
function toggleShowMore() {
    if (filteredData.length > visibleCount) {
        showMoreBtn.style.display = "block";
    } else {
        showMoreBtn.style.display = "none";
    }
}

// ===== MODAL LOGIC =====
let currentBook = {};

function attachOpenEvents() {
    document.querySelectorAll(".btn-open").forEach(btn => {
        btn.onclick = function () {
            const book = visibleBooks[this.dataset.index];

            if (!book) {
                console.warn("No book found for index", this.dataset.index);
                return;
            }

            currentBook = book;
            const theoryBtn = document.getElementById("theoryBtn");

            theoryBtn.textContent = "Open Book";
            theoryBtn.onclick = () => {
                openPDF(currentBook.link);
                $('#openModal').modal('hide');
            };
        };
    });
}

// ===== OPEN PDF =====
function openPDF(link) {
    if (!link) return;

    if (/^https?:\/\//i.test(link)) {
        // Open external PDF/Drive link in new tab safely
        window.open(link, "_blank", "noopener,noreferrer");
    } else {
        // Internal PDF path fallback
        window.location.href = `single.html?pdf=${encodeURIComponent(link)}`;
    }
}

// ===== SAVE BOOK =====
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("save-btn")) {
        const card = e.target.closest(".card");
        const title = card.querySelector(".card-title").innerText;

        let saved = JSON.parse(localStorage.getItem("savedBooks")) || [];

        if (!saved.includes(title)) {
            saved.push(title);
            localStorage.setItem("savedBooks", JSON.stringify(saved));
            alert("Saved!");
        }
    }
});

// ===== EVENTS =====
subjectFilter.addEventListener("change", filterBooks);
searchInput.addEventListener("input", filterBooks);
showMoreBtn.addEventListener("click", showMore);

// ===== INIT =====
document.addEventListener("DOMContentLoaded", renderBooks);
