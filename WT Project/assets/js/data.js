const STORAGE_KEY = "niet_hostel_mgmt_data_v1";

const defaultAppData = {
  rooms: [
    { id: 1, number: "A-101", type: "Single", rent: 7000, capacity: 1, occupied: 1 },
    { id: 2, number: "A-102", type: "Double", rent: 12000, capacity: 2, occupied: 2 },
    { id: 3, number: "A-103", type: "Double", rent: 12000, capacity: 2, occupied: 2 },
    { id: 4, number: "B-201", type: "Triple", rent: 16500, capacity: 3, occupied: 2 },
    { id: 5, number: "B-202", type: "Double", rent: 12000, capacity: 2, occupied: 0 },
    { id: 6, number: "C-301", type: "Single", rent: 7500, capacity: 1, occupied: 1 }
  ],
  students: [
    {
      id: 1,
      name: "Santohs kumar",
      phone: "9876543210",
      whatsapp: "9876543210",
      email: "santosh@gmail.com",
      aadhaar: "123412341234",
      parentName: "Suresh Verma",
      parentPhone: "9876500001",
      room: "A-102",
      status: "Active",
      joinedAt: "2025-11-01",
      idProofDataUrl: ""
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "9123456780",
      whatsapp: "9123456780",
      email: "priya@gmail.com",
      aadhaar: "567856785678",
      parentName: "Ravi Sharma",
      parentPhone: "9876500002",
      room: "A-102",
      status: "Active",
      joinedAt: "2025-10-15",
      idProofDataUrl: ""
    },
    {
      id: 3,
      name: "Amit Singh",
      phone: "9988776655",
      whatsapp: "9988776655",
      email: "",
      aadhaar: "111122223333",
      parentName: "Mahesh Singh",
      parentPhone: "9876500003",
      room: "B-201",
      status: "Inactive",
      joinedAt: "2025-09-01",
      idProofDataUrl: ""
    }
  ],
  studentHistory: [
    {
      id: 1,
      studentId: 101,
      name: "Rahul Verma",
      phone: "9876543200",
      aadhaar: "999988887777",
      idProofDataUrl: "",
      room: "A-101",
      joinedAt: "2025-08-10",
      leftAt: "2026-02-20",
      monthsStayed: 7
    },
    {
      id: 2,
      studentId: 102,
      name: "Neha Gupta",
      phone: "9123400000",
      aadhaar: "888877776666",
      idProofDataUrl: "",
      room: "B-202",
      joinedAt: "2025-11-05",
      leftAt: "2026-03-15",
      monthsStayed: 5
    }
  ],
  payments: [
    {
      id: "TXN-001",
      student: "Rahul Verma",
      month: "March 2026",
      rentExpected: 6000,
      rentPaid: 6000,
      electricityExpected: 450,
      electricityPaid: 450,
      mode: "UPI - PhonePe",
      status: "Paid",
      date: "2026-03-05"
    },
    {
      id: "TXN-002",
      student: "Priya Sharma",
      month: "March 2026",
      rentExpected: 6000,
      rentPaid: 4000,
      electricityExpected: 450,
      electricityPaid: 0,
      mode: "Cash",
      status: "Pending",
      date: "2026-03-09"
    },
    {
      id: "TXN-003",
      student: "Amit Singh",
      month: "March 2026",
      rentExpected: 5500,
      rentPaid: 5500,
      electricityExpected: 400,
      electricityPaid: 350,
      mode: "UPI - GPay",
      status: "Pending",
      date: "2026-03-10"
    }
  ],
  electricityBills: [
    { id: 1, month: "Jan 2026", room: "A-102", total: 900, split: 450, students: 2 },
    { id: 2, month: "Feb 2026", room: "B-201", total: 1200, split: 400, students: 3 },
    { id: 3, month: "Mar 2026", room: "A-102", total: 1000, split: 500, students: 2 },
    { id: 4, month: "Apr 2026", room: "A-103", total: 1000, split: 500, students: 2 }
  ],
  notices: [
    { id: 1, title: "Water Supply Maintenance", message: "Water will be unavailable from 10 AM to 2 PM.", date: "2026-03-18" },
    { id: 2, title: "Rent Reminder", message: "Please clear dues before 7th every month.", date: "2026-03-02" }
  ],
  monthlyExpected: [15000, 15200, 16000, 16200, 16500, 17000, 16800, 17100, 17500, 17800, 18000, 18200],
  monthlyCollected: [14200, 15000, 15600, 15800, 16100, 16500, 16200, 16650, 17100, 17200, 17400, 17700]
};

let appData = JSON.parse(JSON.stringify(defaultAppData));

function loadAppData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return JSON.parse(JSON.stringify(defaultAppData));
    const parsed = JSON.parse(saved);
    return {
      ...JSON.parse(JSON.stringify(defaultAppData)),
      ...parsed,
      rooms: Array.isArray(parsed.rooms) ? parsed.rooms : defaultAppData.rooms,
      students: Array.isArray(parsed.students) ? normalizeStudents(parsed.students) : defaultAppData.students,
      studentHistory: Array.isArray(parsed.studentHistory) ? parsed.studentHistory : defaultAppData.studentHistory,
      payments: Array.isArray(parsed.payments) ? parsed.payments : defaultAppData.payments,
      notices: Array.isArray(parsed.notices) ? parsed.notices : defaultAppData.notices
    };
  } catch (error) {
    return JSON.parse(JSON.stringify(defaultAppData));
  }
}

function saveAppData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function normalizeStudents(list) {
  const today = new Date().toISOString().slice(0, 10);
  return list.map((s) => ({
    ...s,
    joinedAt: s.joinedAt || today,
    idProofDataUrl: s.idProofDataUrl || ""
  }));
}

function computeMonthsStayed(joinedStr, leftStr) {
  if (!joinedStr) return 1;
  const j = new Date(`${joinedStr}T12:00:00`);
  const l = new Date(`${leftStr}T12:00:00`);
  if (Number.isNaN(j.getTime()) || Number.isNaN(l.getTime())) return 1;
  let months = (l.getFullYear() - j.getFullYear()) * 12 + (l.getMonth() - j.getMonth());
  if (l.getDate() < j.getDate()) months -= 1;
  return Math.max(1, months + 1);
}

function recordStudentDeparture(student) {
  if (!appData.studentHistory) appData.studentHistory = [];
  const leftAt = new Date().toISOString().slice(0, 10);
  const joinedAt = student.joinedAt || leftAt;
  const monthsStayed = computeMonthsStayed(joinedAt, leftAt);
  appData.studentHistory.unshift({
    id: getNextId(appData.studentHistory),
    studentId: student.id,
    name: student.name,
    phone: student.phone || "",
    aadhaar: student.aadhaar || "",
    idProofDataUrl: student.idProofDataUrl || "",
    room: student.room || "",
    joinedAt,
    leftAt,
    monthsStayed
  });
}

function getStudentHistoryLastSixMonths() {
  if (!Array.isArray(appData.studentHistory)) return [];
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  cutoff.setHours(0, 0, 0, 0);
  return appData.studentHistory
    .filter((h) => {
      const left = new Date(h.leftAt);
      return !Number.isNaN(left.getTime()) && left >= cutoff;
    })
    .sort((a, b) => new Date(b.leftAt) - new Date(a.leftAt));
}

function initAppData() {
  appData = loadAppData();
  saveAppData();
}

function getNextId(list) {
  if (!Array.isArray(list) || !list.length) return 1;
  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1;
}

function calculateDashboardStats() {
  const totalRooms = appData.rooms.length;
  const occupiedRooms = appData.rooms.filter((r) => r.occupied >= r.capacity).length;
  const vacantRooms = totalRooms - occupiedRooms;
  const totalStudents = appData.students.length;

  const expectedMonthly = appData.payments.reduce((sum, p) => sum + p.rentExpected + p.electricityExpected, 0);
  const collectedMonthly = appData.payments.reduce((sum, p) => sum + p.rentPaid + p.electricityPaid, 0);
  const expectedYearly = appData.monthlyExpected.reduce((a, b) => a + b, 0);
  const collectedYearly = appData.monthlyCollected.reduce((a, b) => a + b, 0);

  return {
    totalRooms,
    occupiedRooms,
    vacantRooms,
    totalStudents,
    expectedMonthly,
    collectedMonthly,
    expectedYearly,
    collectedYearly
  };
}

initAppData();
