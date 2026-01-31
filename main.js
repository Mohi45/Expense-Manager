const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const totalEl = document.getElementById("monthlyTotal");
const toast = document.getElementById("toast");
const darkToggle = document.getElementById("darkToggle");
const clearBtn = document.getElementById("clearBtn");

// Update banner
const banner = document.getElementById("updateBanner");
const applyBtn = document.getElementById("applyUpdate");

dateInput.valueAsDate = new Date();

// Load total
let total = Number(localStorage.getItem("total")) || 0;
totalEl.textContent = `₹${total}`;

// Toast
function showToast() {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Save expense
document.getElementById("expenseForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = Number(amountInput.value);
    if (!amount) return;

    total += amount;
    localStorage.setItem("total", total);
    totalEl.textContent = `₹${total}`;

    showToast();
    e.target.reset();
});

// Dark mode
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Clear all data
clearBtn.addEventListener("click", () => {
    const pass = prompt("Enter password to clear all expenses:");
    if (pass !== "1234") return alert("❌ Wrong password");

    if (!confirm("⚠️ Delete all data?")) return;

    localStorage.removeItem("total");
    total = 0;
    totalEl.textContent = "₹0";
    document.getElementById("expenseForm").reset();

    alert("✅ All data cleared");
});

/* ===========================
   SERVICE WORKER + UPDATES
   =========================== */

let newWorker;

// ❗ Disable SW on Live Server / localhost (DEV SAFE)
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";

if ("serviceWorker" in navigator && !isLocalhost) {
    navigator.serviceWorker.register("sw.js").then(reg => {

        reg.addEventListener("updatefound", () => {
            newWorker = reg.installing;

            newWorker.addEventListener("statechange", () => {
                if (
                    newWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                ) {
                    banner.classList.remove("hidden");
                }
            });
        });

    });
}

// Apply update
applyBtn?.addEventListener("click", async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg?.waiting) return;

    reg.waiting.postMessage("SKIP_WAITING");
    window.location.reload();
});
