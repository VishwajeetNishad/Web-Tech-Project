function renderRoomStats() {
  const total = appData.rooms.length;
  const filled = appData.rooms.filter((r) => r.occupied >= r.capacity).length;
  const vacant = total - filled;

  document.getElementById("roomTotalCount").textContent = total;
  document.getElementById("roomFilledCount").textContent = filled;
  document.getElementById("roomVacantCount").textContent = vacant;
}

function openRoomModalForAdd() {
  const form = document.getElementById("roomForm");
  form.reset();
  document.getElementById("roomEditId").value = "";
  document.getElementById("roomModalTitle").textContent = "Add Room";
  document.getElementById("roomModal").classList.add("active");
}

function openRoomModalForEdit(roomId) {
  const room = appData.rooms.find((r) => r.id === roomId);
  if (!room) return;
  document.getElementById("roomEditId").value = String(room.id);
  document.getElementById("roomNumber").value = room.number;
  document.getElementById("roomType").value = room.type;
  document.getElementById("roomRent").value = room.rent;
  document.getElementById("roomCapacity").value = room.capacity;
  document.getElementById("roomModalTitle").textContent = "Edit Room";
  document.getElementById("roomModal").classList.add("active");
}

function renderRoomsTable() {
  document.getElementById("roomsTable").innerHTML = appData.rooms
    .map((r) => {
      const full = r.occupied >= r.capacity;
      return `<tr>
        <td>${r.number}</td>
        <td>${r.type}</td>
        <td>${formatINR(r.rent)}</td>
        <td>${r.capacity}</td>
        <td>${r.occupied}</td>
        <td><span class="badge ${full ? "badge-danger" : "badge-success"}">${full ? "Filled" : "Vacant"}</span></td>
        <td>
          <button type="button" class="btn" data-edit-room="${r.id}" title="Edit room"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="btn btn-danger" data-delete-room="${r.id}"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>`;
    })
    .join("");
}

function bindRoomDeleteButtons() {
  document.querySelectorAll("[data-delete-room]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomId = Number(btn.getAttribute("data-delete-room"));
      const room = appData.rooms.find((r) => r.id === roomId);
      if (!room) return;
      const studentsInRoom = appData.students.filter((s) => s.room === room.number).length;
      if (studentsInRoom > 0) {
        showToast("Cannot delete room with assigned students.");
        return;
      }
      appData.rooms = appData.rooms.filter((r) => r.id !== roomId);
      saveAppData();
      renderRoomStats();
      renderRoomsTable();
      bindRoomDeleteButtons();
      bindRoomEditButtons();
      setupDummyButtons();
      showToast("Room removed.");
    });
  });
}

function bindRoomEditButtons() {
  document.querySelectorAll("[data-edit-room]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roomId = Number(btn.getAttribute("data-edit-room"));
      openRoomModalForEdit(roomId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const roomForm = document.getElementById("roomForm");
  renderRoomStats();
  renderRoomsTable();
  bindRoomDeleteButtons();
  bindRoomEditButtons();
  setupDummyButtons();

  document.getElementById("openAddRoomModal")?.addEventListener("click", () => openRoomModalForAdd());

  roomForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const editIdRaw = document.getElementById("roomEditId").value;
    const editingId = editIdRaw ? Number(editIdRaw) : null;
    const number = document.getElementById("roomNumber").value.trim().toUpperCase();
    const type = document.getElementById("roomType").value;
    const rent = Number(document.getElementById("roomRent").value);
    const capacity = Number(document.getElementById("roomCapacity").value);

    if (!number || capacity < 1 || rent < 1) {
      showToast("Please enter valid room data.");
      return;
    }

    if (editingId) {
      const room = appData.rooms.find((r) => r.id === editingId);
      if (!room) return;
      const oldNumber = room.number;
      const duplicate = appData.rooms.some((r) => r.id !== editingId && r.number.toUpperCase() === number);
      if (duplicate) {
        showToast("Another room already uses this number.");
        return;
      }
      if (capacity < room.occupied) {
        showToast(`Capacity cannot be less than current occupants (${room.occupied}).`);
        return;
      }
      room.number = number;
      room.type = type;
      room.rent = rent;
      room.capacity = capacity;
      if (oldNumber !== number) {
        appData.students.forEach((s) => {
          if (s.room === oldNumber) s.room = number;
        });
        appData.electricityBills?.forEach((b) => {
          if (b.room === oldNumber) b.room = number;
        });
      }
      saveAppData();
    } else {
      const exists = appData.rooms.some((room) => room.number.toUpperCase() === number);
      if (exists) {
        showToast("Room number already exists.");
        return;
      }
      appData.rooms.push({
        id: getNextId(appData.rooms),
        number,
        type,
        rent,
        capacity,
        occupied: 0
      });
      saveAppData();
    }

    roomForm.reset();
    document.getElementById("roomEditId").value = "";
    document.getElementById("roomModalTitle").textContent = "Add Room";
    document.getElementById("roomModal").classList.remove("active");
    renderRoomStats();
    renderRoomsTable();
    bindRoomDeleteButtons();
    bindRoomEditButtons();
    setupDummyButtons();
    showToast(editingId ? "Room updated." : "Room added and saved locally.");
  });
});
