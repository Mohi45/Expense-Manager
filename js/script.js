// Auto-fill today's date
document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

// Local storage helpers
function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(data) {
    localStorage.setItem("expenses", JSON.stringify(data));
}

// Elements
const form = document.getElementById("expenseForm");
const success = document.getElementById("success");
const toast = document.getElementById("toast");

// Submit
form.addEventListener("submit", e => {
    e.preventDefault();

    const expense = {
        id: Date.now(),
        date: date.value,
        item: item.value,
        amount: Number(amount.value),
        note: note.value
    };

    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);

    // Google Form
    g_date.value = expense.date;
    g_item.value = expense.item;
    g_amount.value = expense.amount;
    g_note.value = expense.note || "";

    if (navigator.onLine) {
        document.getElementById("googleForm").submit();
    }

    // UI
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);

    form.reset();
    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];

    render();
});

// Render list + monthly total
function render() {
    const list = document.getElementById("list");
    const totalBox = document.getElementById("monthlyTotal");
    list.innerHTML = "";

    const month = new Date().toISOString().slice(0, 7);
    let total = 0;

    getExpenses().forEach(e => {
        if (e.date.startsWith(month)) total += e.amount;
        const li = document.createElement("li");
        li.textContent = `${e.date} | ${e.item} | ₹${e.amount}`;
        list.appendChild(li);
    });

    totalBox.textContent = `📊 This Month Total: ₹${total}`;
}

render();

// CSV Export
function exportCSV() {
    const expenses = getExpenses();
    if (!expenses.length) return alert("No data");

    let csv = "Date,Item,Amount,Note\n";
    expenses.forEach(e => {
        csv += `${e.date},${e.item},${e.amount},${e.note || ""}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "expenses.csv";
    a.click();
}

// Dark mode
const darkToggle = document.getElementById("darkToggle");

if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark") ? "on" : "off"
    );
});

// PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
