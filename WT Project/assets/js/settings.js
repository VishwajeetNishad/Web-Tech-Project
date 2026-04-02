document.addEventListener("DOMContentLoaded", () => {
  const qrStorageKey = "niet_admin_qr_image_v1";
  const defaultQr = "assets/images/qr-placeholder.svg";
  const qrImage = document.getElementById("adminQrImage");
  const qrUploadInput = document.getElementById("qrUploadInput");
  const saveQrBtn = document.getElementById("saveQrBtn");
  const resetQrBtn = document.getElementById("resetQrBtn");
  let selectedQrData = "";

  const savedQr = localStorage.getItem(qrStorageKey);
  qrImage.src = savedQr || defaultQr;

  qrUploadInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      selectedQrData = String(reader.result || "");
      qrImage.src = selectedQrData;
      showToast("QR preview updated.");
    };
    reader.readAsDataURL(file);
  });

  saveQrBtn.addEventListener("click", () => {
    if (!selectedQrData) {
      showToast("Please choose a QR image first.");
      return;
    }
    localStorage.setItem(qrStorageKey, selectedQrData);
    showToast("QR saved successfully.");
  });

  resetQrBtn.addEventListener("click", () => {
    localStorage.removeItem(qrStorageKey);
    selectedQrData = "";
    qrUploadInput.value = "";
    qrImage.src = defaultQr;
    showToast("QR reset to default.");
  });

  const totals = appData.payments.reduce(
    (acc, payment) => {
      const paidAmount = payment.rentPaid + payment.electricityPaid;
      acc.total += paidAmount;
      if (String(payment.mode).toLowerCase().includes("upi")) {
        acc.bank += paidAmount;
      } else {
        acc.cash += paidAmount;
      }
      return acc;
    },
    { total: 0, bank: 0, cash: 0 }
  );

  document.getElementById("totalReceivedAmount").textContent = formatINR(totals.total);
  document.getElementById("bankReceivedAmount").textContent = formatINR(totals.bank);
  document.getElementById("cashReceivedAmount").textContent = formatINR(totals.cash);

  document.getElementById("noticeHistory").innerHTML = appData.notices
    .map(
      (n) => `<div style="border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:8px">
      <strong>${n.title}</strong>
      <p class="muted" style="margin:6px 0">${n.message}</p>
      <small class="muted">${n.date}</small>
    </div>`
    )
    .join("");
  setupDummyButtons();
});
