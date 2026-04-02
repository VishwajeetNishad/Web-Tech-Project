document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("billTable").innerHTML = appData.electricityBills
    .map((b) => {
      return `<tr>
        <td>${b.month}</td>
        <td>${b.room}</td>
        <td>${formatINR(b.total)}</td>
        <td>${b.students}</td>
        <td>${formatINR(b.split)}</td>
        <td>
          <button class="btn" data-dummy="Bill edited (UI simulation)."><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger" data-dummy="Bill removed (UI simulation)."><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    })
    .join("");
  setupDummyButtons();
});
