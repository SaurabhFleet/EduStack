// ===== CONFIG =====
const container = document.getElementById("modulesContainer");
const subjectFilter = document.getElementById("subjectFilter");
const searchInput = document.getElementById("searchInput");
const showMoreBtn = document.getElementById("showMoreBtn");

let visibleCount = 8;
let filteredData = [...modulesData];

// ===== RENDER CARDS =====
function renderModules() {
    container.innerHTML = "";

    const visibleItems = filteredData.slice(0, visibleCount);
    if (visibleItems.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px;">
            No modules found
        </div>`;
        showMoreBtn.style.display = "none";
        return;
    }

    visibleItems.forEach((m, index) => {
        const card = `
        <div class="col-lg-3 col-md-6 module-card"
             data-coaching="${m.coaching}"
             data-subject="${m.subject}"
             data-title="${m.title.toLowerCase()}">

            <div class="card shadow border-0 h-100">
                <div class="card-body">

                    <span class="badge mb-2">${m.subject}</span>
                    <h5 class="card-title">${m.title}</h5>
                    <p class="card-text">• ${m.coaching}</p>

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
function filterModules() {
    const subject = subjectFilter.value;
    const search = searchInput.value.toLowerCase().trim();

    visibleCount = 8;

    if (search) {
        // If search is active, ignore filters and search across all modules
        filteredData = modulesData.filter(m => m.title.toLowerCase().includes(search));
    } else {
        // If search is empty, apply filters
        filteredData = modulesData.filter(m => {
            const subjectMatch = subject === "all" || m.subject === subject;
            return subjectMatch;
        });
    }

    renderModules();
}

// ===== SHOW MORE =====
function showMore() {
    visibleCount += 8;
    renderModules();
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
let currentModule = {};

function attachOpenEvents() {
    document.querySelectorAll(".btn-open").forEach(btn => {
        btn.onclick = function () {
            currentModule = filteredData[this.dataset.index];

            const theoryBtn = document.getElementById("theoryBtn");
            const questionBtn = document.getElementById("questionBtn");

            // RESET
            theoryBtn.style.display = "inline-block";
            questionBtn.style.display = "inline-block";

            if (currentModule.full) {
                theoryBtn.textContent = "Open Module";
                theoryBtn.onclick = () => {
                    openPDF(currentModule.full);
                    $('#openModal').modal('hide');
                };
                questionBtn.style.display = "none";
            } else {
                if (currentModule.theory) {
                    theoryBtn.textContent = "Theory";
                    theoryBtn.onclick = () => {
                        openPDF(currentModule.theory);
                        $('#openModal').modal('hide');
                    };
                } else {
                    theoryBtn.style.display = "none";
                }

                if (currentModule.questions) {
                    questionBtn.textContent = "Questions";
                    questionBtn.onclick = () => {
                        openPDF(currentModule.questions);
                        $('#openModal').modal('hide');
                    };
                } else {
                    questionBtn.style.display = "none";
                }
            }
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

// ===== SAVE MODULE =====
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("save-btn")) {
        const card = e.target.closest(".card");
        const title = card.querySelector(".card-title").innerText;

        let saved = JSON.parse(localStorage.getItem("savedModules")) || [];

        if (!saved.includes(title)) {
            saved.push(title);
            localStorage.setItem("savedModules", JSON.stringify(saved));
            alert("Saved!");
        }
    }
});

// ===== EVENTS =====
subjectFilter.addEventListener("change", filterModules);
searchInput.addEventListener("input", filterModules);
showMoreBtn.addEventListener("click", showMore);

// ===== INIT =====
document.addEventListener("DOMContentLoaded", renderModules);
