function renderStudents(rows) {
  const body = document.getElementById("studentsTable");
  body.innerHTML = rows
    .map((s) => {
      const statusClass = s.status === "Active" ? "badge-success" : "badge-danger";
      return `<tr>
        <td>${s.name}</td>
        <td>${s.phone}</td>
        <td>${s.whatsapp}</td>
        <td>${s.parentName} (${s.parentPhone})</td>
        <td>${s.room}</td>
        <td><span class="badge ${statusClass}">${s.status}</span></td>
        <td>
          <button class="btn" data-dummy="Edit student form opened."><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-danger" data-delete-student="${s.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const roomSelect = document.getElementById("studentRoom");
  renderStudents(appData.students);
  setupDummyButtons();

  const search = document.getElementById("studentSearch");
  const status = document.getElementById("studentFilterStatus");

  function renderRoomOptions() {
    roomSelect.innerHTML = appData.rooms.map((r) => `<option value="${r.number}">${r.number} (${r.type})</option>`).join("");
  }

  renderRoomOptions();

  function applyFilters() {
    const q = search.value.trim().toLowerCase();
    const statusVal = status.value;
    const filtered = appData.students.filter((s) => {
      const textHit = [s.name, s.phone, s.room].join(" ").toLowerCase().includes(q);
      const statusHit = !statusVal || s.status === statusVal;
      return textHit && statusHit;
    });
    renderStudents(filtered);
    bindDeleteButtons();
    setupDummyButtons();
  }

  function bindDeleteButtons() {
    document.querySelectorAll("[data-delete-student]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const studentId = Number(btn.getAttribute("data-delete-student"));
        const student = appData.students.find((s) => s.id === studentId);
        if (!student) return;

        recordStudentDeparture(student);
        appData.students = appData.students.filter((s) => s.id !== studentId);
        const room = appData.rooms.find((r) => r.number === student.room);
        if (room && room.occupied > 0) {
          room.occupied -= 1;
        }
        saveAppData();
        applyFilters();
        renderRoomOptions();
        showToast("Student checked out and added to history.");
      });
    });
  }

  bindDeleteButtons();

  studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const studentRoom = document.getElementById("studentRoom").value;
    const assignedRoom = appData.rooms.find((room) => room.number === studentRoom);
    if (assignedRoom && assignedRoom.occupied >= assignedRoom.capacity) {
      showToast("Selected room is already full.");
      return;
    }

    const fileInput = document.getElementById("studentIdProof");
    const file = fileInput?.files?.[0];
    let idProofDataUrl = "";
    if (file && file.type.startsWith("image/")) {
      idProofDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.readAsDataURL(file);
      });
    }

    const newStudent = {
      id: getNextId(appData.students),
      name: document.getElementById("studentName").value.trim(),
      phone: document.getElementById("studentPhone").value.trim(),
      whatsapp: document.getElementById("studentWhatsapp").value.trim(),
      email: document.getElementById("studentEmail").value.trim(),
      aadhaar: document.getElementById("studentAadhaar").value.trim(),
      parentName: document.getElementById("studentParentName").value.trim(),
      parentPhone: document.getElementById("studentParentPhone").value.trim(),
      room: studentRoom,
      status: document.getElementById("studentStatus").value,
      joinedAt: new Date().toISOString().slice(0, 10),
      idProofDataUrl
    };

    appData.students.push(newStudent);
    if (assignedRoom) assignedRoom.occupied += 1;
    saveAppData();
    studentForm.reset();
    document.getElementById("studentModal").classList.remove("active");
    applyFilters();
    renderRoomOptions();
    showToast("Student added and saved locally.");
  });

  search.addEventListener("input", applyFilters);
  status.addEventListener("change", applyFilters);
});
