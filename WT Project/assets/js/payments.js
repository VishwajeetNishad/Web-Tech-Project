function getPaymentTotals(rows) {
  const expected = rows.reduce((sum, p) => sum + p.rentExpected + p.electricityExpected, 0);
  const paid = rows.reduce((sum, p) => sum + p.rentPaid + p.electricityPaid, 0);
  return { expected, paid, pending: expected - paid };
}

function updatePaymentCards(rows) {
  const totals = getPaymentTotals(rows);
  document.getElementById("expectedAmount").textContent = formatINR(totals.expected);
  document.getElementById("paidAmount").textContent = formatINR(totals.paid);
  document.getElementById("pendingAmount").textContent = formatINR(totals.pending);
}

function renderPayments(rows) {
  document.getElementById("paymentsTable").innerHTML = rows
    .map((p) => {
      const statusClass = p.status === "Paid" ? "badge-success" : "badge-warning";
      const rowClass = p.status === "Pending" ? ' style="background:#fff7ed"' : "";
      return `<tr${rowClass}>
        <td>${p.id}</td>
        <td>${p.student}</td>
        <td>${p.month}</td>
        <td>${formatINR(p.rentExpected)} / ${formatINR(p.rentPaid)}</td>
        <td>${formatINR(p.electricityExpected)} / ${formatINR(p.electricityPaid)}</td>
        <td>${p.mode}</td>
        <td><span class="badge ${statusClass}">${p.status}</span></td>
        <td><button class="btn" data-history-student="${p.student}"><i class="fa-solid fa-clock-rotate-left"></i></button></td>
      </tr>`;
    })
    .join("");
}

function renderStudentOptions() {
  const studentNames = appData.students.map((s) => s.name);
  const options = studentNames.map((name) => `<option value="${name}">${name}</option>`).join("");
  document.getElementById("paymentStudent").innerHTML = options;
  document.getElementById("reminderStudent").innerHTML = options;
}

function generateTxnId() {
  const next = appData.payments.length + 1;
  return `TXN-${String(next).padStart(3, "0")}`;
}

function updateReminderPreview() {
  const student = document.getElementById("reminderStudent").value || "Student";
  const template = document.getElementById("reminderTemplate").value;
  const channel = document.getElementById("reminderChannel").value;
  const pendingForStudent = appData.payments
    .filter((p) => p.student === student)
    .reduce((sum, p) => sum + (p.rentExpected + p.electricityExpected - (p.rentPaid + p.electricityPaid)), 0);
  const preview =
    template === "Payment Confirmation"
      ? `Dear ${student}, your recent payment has been recorded successfully. Thank you for paying on time. (Channel: ${channel})`
      : `Dear ${student}, your pending amount is ${formatINR(Math.max(0, pendingForStudent))}. Kindly clear your dues as soon as possible. (Channel: ${channel})`;
  document.getElementById("reminderPreview").value = preview;
}

function downloadPaymentsCsv(rows) {
  const header = ["Txn ID", "Student", "Month", "Rent Expected", "Rent Paid", "Electricity Expected", "Electricity Paid", "Mode", "Status", "Date"];
  const lines = rows.map((p) =>
    [p.id, p.student, p.month, p.rentExpected, p.rentPaid, p.electricityExpected, p.electricityPaid, p.mode, p.status, p.date]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payments-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function showHistoryModal(studentName) {
  const rows = appData.payments.filter((p) => p.student === studentName);
  document.getElementById("historyTable").innerHTML = rows
    .map((p) => {
      const totalExpected = p.rentExpected + p.electricityExpected;
      const totalPaid = p.rentPaid + p.electricityPaid;
      return `<tr>
        <td>${p.id}</td>
        <td>${p.month}</td>
        <td>${formatINR(totalExpected)}</td>
        <td>${formatINR(totalPaid)}</td>
        <td><span class="badge ${p.status === "Paid" ? "badge-success" : "badge-warning"}">${p.status}</span></td>
      </tr>`;
    })
    .join("");
  document.getElementById("historyModal").classList.add("active");
}

function attachHistoryButtons() {
  document.querySelectorAll("[data-history-student]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showHistoryModal(btn.getAttribute("data-history-student"));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const paymentStatusFilter = document.getElementById("paymentStatusFilter");
  const paymentSearch = document.getElementById("paymentSearch");
  const paymentMonthFilter = document.getElementById("paymentMonthFilter");
  const paymentForm = document.getElementById("paymentForm");
  const paymentInsight = document.getElementById("paymentInsight");

  renderStudentOptions();

  function applyPaymentFilters() {
    const status = paymentStatusFilter.value;
    const search = paymentSearch.value.trim().toLowerCase();
    const month = paymentMonthFilter.value.trim().toLowerCase();
    const filtered = appData.payments.filter((p) => {
      const statusOk = !status || p.status === status;
      const searchOk = !search || `${p.student} ${p.id}`.toLowerCase().includes(search);
      const monthOk = !month || p.month.toLowerCase().includes(month);
      return statusOk && searchOk && monthOk;
    });
    renderPayments(filtered);
    updatePaymentCards(filtered);
    attachHistoryButtons();
    const pendingCount = filtered.filter((p) => p.status === "Pending").length;
    paymentInsight.textContent = `${filtered.length} transactions shown, ${pendingCount} pending.`;
  }

  applyPaymentFilters();

  paymentStatusFilter.addEventListener("change", applyPaymentFilters);
  paymentSearch.addEventListener("input", applyPaymentFilters);
  paymentMonthFilter.addEventListener("input", applyPaymentFilters);

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rentExpected = Number(document.getElementById("paymentRentExpected").value);
    const rentPaid = Number(document.getElementById("paymentRentPaid").value);
    const electricityExpected = Number(document.getElementById("paymentElectricityExpected").value);
    const electricityPaid = Number(document.getElementById("paymentElectricityPaid").value);
    if ([rentExpected, rentPaid, electricityExpected, electricityPaid].some((v) => Number.isNaN(v) || v < 0)) {
      showToast("Please enter valid payment amounts.");
      return;
    }
    const totalExpected = rentExpected + electricityExpected;
    const totalPaid = rentPaid + electricityPaid;
    appData.payments.unshift({
      id: generateTxnId(),
      student: document.getElementById("paymentStudent").value,
      month: document.getElementById("paymentMonth").value.trim(),
      rentExpected,
      rentPaid,
      electricityExpected,
      electricityPaid,
      mode: document.getElementById("paymentMode").value,
      status: totalPaid >= totalExpected ? "Paid" : "Pending",
      date: new Date().toISOString().slice(0, 10)
    });
    saveAppData();
    paymentForm.reset();
    renderStudentOptions();
    document.getElementById("paymentModal").classList.remove("active");
    applyPaymentFilters();
    showToast("Payment saved to local storage.");
  });

  document.getElementById("exportPaymentsCsv").addEventListener("click", () => {
    const visibleRows = appData.payments.filter((p) => {
      const status = paymentStatusFilter.value;
      const search = paymentSearch.value.trim().toLowerCase();
      const month = paymentMonthFilter.value.trim().toLowerCase();
      const statusOk = !status || p.status === status;
      const searchOk = !search || `${p.student} ${p.id}`.toLowerCase().includes(search);
      const monthOk = !month || p.month.toLowerCase().includes(month);
      return statusOk && searchOk && monthOk;
    });
    downloadPaymentsCsv(visibleRows);
    showToast("CSV downloaded.");
  });

  document.getElementById("reminderStudent").addEventListener("change", updateReminderPreview);
  document.getElementById("reminderTemplate").addEventListener("change", updateReminderPreview);
  document.getElementById("reminderChannel").addEventListener("change", updateReminderPreview);
  document.getElementById("sendReminderBtn").addEventListener("click", () => {
    showToast("Reminder sent (UI simulation).");
    document.getElementById("reminderModal").classList.remove("active");
  });
  updateReminderPreview();
});
