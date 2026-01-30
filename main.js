const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const totalEl = document.getElementById("total");
const toast = document.getElementById("toast");
const darkToggle = document.getElementById("darkToggle");

// Auto-select today
dateInput.valueAsDate = new Date();

// Monthly total (local only)
let total = Number(localStorage.getItem("total")) || 0;
totalEl.textContent = `₹${total}`;

// Toast
function showToast() {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

// Form submit
document.getElementById("expenseForm").addEventListener("submit", () => {
    const amount = Number(amountInput.value);
    total += amount;
    localStorage.setItem("total", total);
    totalEl.textContent = `₹${total}`;
    showToast();
});

// Dark mode
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
