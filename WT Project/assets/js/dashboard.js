document.addEventListener("DOMContentLoaded", () => {
  const css = getComputedStyle(document.documentElement);
  const NIET_RED = css.getPropertyValue("--niet-red").trim() || "#cf1427";
  const NIET_BLUE = css.getPropertyValue("--niet-blue").trim() || "#3e4095";
  const NIET_YELLOW = css.getPropertyValue("--niet-yellow").trim() || "#ffc700";
  const BLUE_SOFT = "rgba(62, 64, 149, 0.25)";

  const stats = calculateDashboardStats();
  const cards = [
    ["Total Rooms", stats.totalRooms, "All configured rooms"],
    ["Occupied Rooms", stats.occupiedRooms, "Currently full"],
    ["Vacant Rooms", stats.vacantRooms, "Available for allocation"],
    ["Total Students", stats.totalStudents, "Active + inactive"]
  ];

  document.getElementById("statsCards").innerHTML = cards
    .map(
      ([title, value, sub]) => `
      <div class="card">
        <h3>${title}</h3>
        <div class="stat-value">${value}</div>
        <div class="stat-sub">${sub}</div>
      </div>`
    )
    .join("");

  const pendingMonthly = stats.expectedMonthly - stats.collectedMonthly;
  const financeCards = [
    ["Expected Monthly", formatINR(stats.expectedMonthly)],
    ["Collected Monthly", formatINR(stats.collectedMonthly)],
    ["Pending Monthly", formatINR(pendingMonthly)]
  ];
  document.getElementById("financeCards").innerHTML = financeCards
    .map(
      ([title, value]) => `
      <div class="card">
        <h3>${title}</h3>
        <div class="stat-value">${value}</div>
      </div>`
    )
    .join("");

  const totalCapacity = appData.rooms.reduce((sum, room) => sum + room.capacity, 0);
  const occupancyRate = totalCapacity ? Math.round((appData.students.length / totalCapacity) * 100) : 0;
  const paymentRate = stats.expectedMonthly ? Math.round((stats.collectedMonthly / stats.expectedMonthly) * 100) : 0;
  document.getElementById("occupancyProgress").style.width = `${Math.min(occupancyRate, 100)}%`;
  document.getElementById("paymentProgress").style.width = `${Math.min(paymentRate, 100)}%`;
  document.getElementById("occupancyText").textContent = `${appData.students.length} students out of ${totalCapacity} beds occupied (${occupancyRate}%).`;
  document.getElementById("paymentText").textContent = `${paymentRate}% of expected monthly collection received.`;

  const monthlyCtx = document.getElementById("monthlyChart");
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          { label: "Expected", data: appData.monthlyExpected.slice(0, 6), backgroundColor: BLUE_SOFT },
          { label: "Collected", data: appData.monthlyCollected.slice(0, 6), backgroundColor: NIET_BLUE }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  const yearlyCtx = document.getElementById("yearlyChart");
  if (yearlyCtx) {
    new Chart(yearlyCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Collected Income",
            data: appData.monthlyCollected,
            borderColor: NIET_RED,
            backgroundColor: NIET_YELLOW,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  document.getElementById("recentTransactions").innerHTML = appData.payments
    .map((p) => {
      const totalPaid = p.rentPaid + p.electricityPaid;
      const statusClass = p.status === "Paid" ? "badge-success" : "badge-warning";
      return `<tr>
        <td>${p.id}</td>
        <td>${p.student}</td>
        <td>${p.month}</td>
        <td>${p.mode}</td>
        <td><span class="badge ${statusClass}">${p.status}</span></td>
        <td>${formatINR(totalPaid)}</td>
      </tr>`;
    })
    .join("");

  const sendNoticeBtn = document.getElementById("sendNoticeBtn");
  if (sendNoticeBtn) {
    sendNoticeBtn.addEventListener("click", () => {
      const title = document.getElementById("noticeTitle")?.value.trim();
      const message = document.getElementById("noticeMessage")?.value.trim();
      if (!title || !message) {
        showToast("Please enter notice title and message.");
        return;
      }
      const audience = document.getElementById("noticeAudience")?.value || "All Students";
      appData.notices.unshift({
        id: getNextId(appData.notices),
        title,
        message,
        audience,
        date: new Date().toISOString().slice(0, 10)
      });
      saveAppData();
      document.getElementById("noticeModal")?.classList.remove("active");
      document.getElementById("noticeTitle").value = "";
      document.getElementById("noticeMessage").value = "";
      showSuccessPopup("Notice sent successfully.");
    });
  }
});
