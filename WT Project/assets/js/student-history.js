function maskAadhaar(value) {
  const s = String(value || "").replace(/\s/g, "");
  if (s.length < 4) return "—";
  return `****${s.slice(-4)}`;
}

function renderHistoryTable() {
  const body = document.getElementById("historyTableBody");
  const empty = document.getElementById("historyEmpty");
  if (!body) return;

  const rows = getStudentHistoryLastSixMonths();
  if (!rows.length) {
    body.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }
  if (empty) empty.style.display = "none";

  body.innerHTML = rows
    .map((h) => {
      const months = computeMonthsStayed(h.joinedAt, h.leftAt);
      const aadhaarLine = `<div class="muted" style="font-size:0.82rem">Aadhaar ${maskAadhaar(h.aadhaar)}</div>`;
      const proofCell = h.idProofDataUrl
        ? `<div>${aadhaarLine}<img class="thumb-id" src="${h.idProofDataUrl}" alt="ID proof" /></div>`
        : aadhaarLine;
      return `<tr>
        <td>${h.studentId ?? "—"}</td>
        <td>${h.name}</td>
        <td>${h.phone || "—"}</td>
        <td>${h.room || "—"}</td>
        <td>${proofCell}</td>
        <td>${h.joinedAt || "—"}</td>
        <td>${h.leftAt || "—"}</td>
        <td>${months}</td>
      </tr>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistoryTable();
});
