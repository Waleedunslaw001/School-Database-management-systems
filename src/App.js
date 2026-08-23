import { useState, useEffect, useCallback, useMemo } from "react";

// ============================================================
// DESIGN TOKENS
// ============================================================
const COLORS = {
  primary: "#1B4F8A",
  primaryDark: "#123568",
  primaryLight: "#2E6DB5",
  accent: "#F5A623",
  accentDark: "#D48B0F",
  success: "#2ECC71",
  successDark: "#27AE60",
  danger: "#E74C3C",
  dangerDark: "#C0392B",
  warning: "#F39C12",
  info: "#3498DB",
  bg: "#F0F4F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F9FC",
  border: "#DDE3EE",
  text: "#1A2B4B",
  textMid: "#4A5A72",
  textLight: "#8A96A8",
  sidebar: "#0F2E5A",
  sidebarHover: "#1B4F8A",
};

// ============================================================
// INITIAL DATABASE (in-memory)
// ============================================================
const initialDB = {
  users: [
    { id: 1, username: "Waleedunslaw", password: "Waleed2020", role: "superadmin", name: "Super Administrator", email: "super@school.edu.ng", status: "active" },
    { id: 2, username: "schooladmin", password: "admin123", role: "admin", name: "School Administrator", email: "admin@school.edu.ng", status: "active" },
    { id: 3, username: "teacher1", password: "teacher123", role: "teacher", name: "Alhaji Musa Ibrahim", email: "musa@school.edu.ng", teacherId: 1, status: "active" },
    { id: 4, username: "teacher2", password: "teacher123", role: "teacher", name: "Mrs. Hauwa Aliyu", email: "hauwa@school.edu.ng", teacherId: 2, status: "active" },
    { id: 5, username: "student1", password: "student123", role: "student", name: "Amina Bello", email: "amina@student.edu.ng", studentId: 1, status: "active" },
    { id: 6, username: "parent1", password: "parent123", role: "parent", name: "Alhaji Bello Yusuf", email: "bello@gmail.com", studentId: 1, status: "active" },
  ],
  academicSessions: [
    { id: 1, name: "2024/2025", startDate: "2024-09-01", endDate: "2025-07-31", isCurrent: true },
    { id: 2, name: "2023/2024", startDate: "2023-09-01", endDate: "2024-07-31", isCurrent: false },
  ],
  terms: [
    { id: 1, sessionId: 1, name: "First Term", startDate: "2024-09-01", endDate: "2024-12-20", isCurrent: true },
    { id: 2, sessionId: 1, name: "Second Term", startDate: "2025-01-10", endDate: "2025-04-11", isCurrent: false },
    { id: 3, sessionId: 1, name: "Third Term", startDate: "2025-04-28", endDate: "2025-07-25", isCurrent: false },
  ],
  classes: [
    { id: 1, name: "JSS 1A", level: "JSS 1", classTeacherId: 1, sessionId: 1, capacity: 40 },
    { id: 2, name: "JSS 2A", level: "JSS 2", classTeacherId: 2, sessionId: 1, capacity: 40 },
    { id: 3, name: "SS 1A", level: "SS 1", classTeacherId: 1, sessionId: 1, capacity: 35 },
    { id: 4, name: "SS 2A", level: "SS 2", classTeacherId: 2, sessionId: 1, capacity: 35 },
  ],
  subjects: [
    { id: 1, name: "Mathematics", code: "MTH", category: "Core" },
    { id: 2, name: "English Language", code: "ENG", category: "Core" },
    { id: 3, name: "Basic Science", code: "BSC", category: "Science" },
    { id: 4, name: "Social Studies", code: "SST", category: "Humanities" },
    { id: 5, name: "Physics", code: "PHY", category: "Science" },
    { id: 6, name: "Chemistry", code: "CHM", category: "Science" },
    { id: 7, name: "Biology", code: "BIO", category: "Science" },
    { id: 8, name: "Literature in English", code: "LIT", category: "Humanities" },
  ],
  teacherSubjects: [
    { id: 1, teacherId: 1, subjectId: 1, classId: 1, sessionId: 1, termId: 1 },
    { id: 2, teacherId: 1, subjectId: 1, classId: 3, sessionId: 1, termId: 1 },
    { id: 3, teacherId: 2, subjectId: 2, classId: 1, sessionId: 1, termId: 1 },
    { id: 4, teacherId: 2, subjectId: 2, classId: 2, sessionId: 1, termId: 1 },
    { id: 5, teacherId: 1, subjectId: 5, classId: 3, sessionId: 1, termId: 1 },
  ],
  teachers: [
    { id: 1, userId: 3, staffId: "TCH001", name: "Alhaji Musa Ibrahim", phone: "08012345678", email: "musa@school.edu.ng", gender: "Male", qualification: "B.Sc Mathematics", status: "active", joinDate: "2020-01-15" },
    { id: 2, userId: 4, staffId: "TCH002", name: "Mrs. Hauwa Aliyu", phone: "08098765432", email: "hauwa@school.edu.ng", gender: "Female", qualification: "B.A English", status: "active", joinDate: "2019-09-01" },
  ],
  students: [
    { id: 1, userId: 5, admNo: "ADM/2024/001", name: "Amina Bello", gender: "Female", dob: "2010-03-15", classId: 1, sessionId: 1, phone: "08011111111", email: "amina@student.edu.ng", address: "No. 5 Borno Way, Damaturu", parentId: 1, status: "active", photo: null },
    { id: 2, admNo: "ADM/2024/002", name: "Ibrahim Musa", gender: "Male", dob: "2010-07-22", classId: 1, sessionId: 1, phone: "08022222222", email: "ibrahim@student.edu.ng", address: "Gashua Road, Yobe", parentId: null, status: "active", photo: null },
    { id: 3, admNo: "ADM/2024/003", name: "Fatima Umar", gender: "Female", dob: "2011-01-10", classId: 1, sessionId: 1, phone: "08033333333", email: "fatima@student.edu.ng", address: "Old Market Area, Gashua", parentId: null, status: "active", photo: null },
    { id: 4, admNo: "ADM/2024/004", name: "Yusuf Abubakar", gender: "Male", dob: "2010-11-30", classId: 1, sessionId: 1, phone: "08044444444", email: "yusuf@student.edu.ng", address: "Potiskum Road, Damaturu", parentId: null, status: "active", photo: null },
    { id: 5, admNo: "ADM/2024/005", name: "Zainab Garba", gender: "Female", dob: "2010-05-18", classId: 3, sessionId: 1, phone: "08055555555", email: "zainab@student.edu.ng", address: "GRA, Damaturu", parentId: null, status: "active", photo: null },
    { id: 6, admNo: "ADM/2024/006", name: "Mohammed Lawan", gender: "Male", dob: "2009-09-25", classId: 3, sessionId: 1, phone: "08066666666", email: "mohammed@student.edu.ng", address: "Buni Yadi, Yobe", parentId: null, status: "active", photo: null },
  ],
  parents: [
    { id: 1, name: "Alhaji Bello Yusuf", phone: "08077777777", email: "bello@gmail.com", address: "No. 5 Borno Way, Damaturu", occupation: "Civil Servant" },
  ],
  assessmentConfig: [
    { id: 1, type: "Assignment", maxScore: 10, weight: 10, sessionId: 1, termId: 1 },
    { id: 2, type: "Test", maxScore: 20, weight: 20, sessionId: 1, termId: 1 },
    { id: 3, type: "Practical", maxScore: 10, weight: 10, sessionId: 1, termId: 1 },
    { id: 4, type: "Examination", maxScore: 60, weight: 60, sessionId: 1, termId: 1 },
  ],
  assessments: [
    { id: 1, teacherSubjectId: 1, title: "First Assignment", type: "Assignment", maxScore: 10, sessionId: 1, termId: 1, status: "submitted", date: "2024-10-05" },
    { id: 2, teacherSubjectId: 1, title: "First Test", type: "Test", maxScore: 20, sessionId: 1, termId: 1, status: "submitted", date: "2024-10-20" },
    { id: 3, teacherSubjectId: 3, title: "English Assignment 1", type: "Assignment", maxScore: 10, sessionId: 1, termId: 1, status: "draft", date: "2024-10-06" },
  ],
  scores: [
    { id: 1, assessmentId: 1, studentId: 1, score: 8, status: "submitted" },
    { id: 2, assessmentId: 1, studentId: 2, score: 7, status: "submitted" },
    { id: 3, assessmentId: 1, studentId: 3, score: 9, status: "submitted" },
    { id: 4, assessmentId: 1, studentId: 4, score: 6, status: "submitted" },
    { id: 5, assessmentId: 2, studentId: 1, score: 16, status: "submitted" },
    { id: 6, assessmentId: 2, studentId: 2, score: 14, status: "submitted" },
    { id: 7, assessmentId: 2, studentId: 3, score: 18, status: "submitted" },
    { id: 8, assessmentId: 2, studentId: 4, score: 12, status: "submitted" },
  ],
  attendance: [
    { id: 1, studentId: 1, classId: 1, sessionId: 1, termId: 1, date: "2024-10-07", status: "present" },
    { id: 2, studentId: 2, classId: 1, sessionId: 1, termId: 1, date: "2024-10-07", status: "present" },
    { id: 3, studentId: 3, classId: 1, sessionId: 1, termId: 1, date: "2024-10-07", status: "absent" },
    { id: 4, studentId: 4, classId: 1, sessionId: 1, termId: 1, date: "2024-10-07", status: "late" },
  ],
  gradingSystem: [
    { id: 1, minScore: 70, maxScore: 100, grade: "A", remark: "Excellent" },
    { id: 2, minScore: 60, maxScore: 69, grade: "B", remark: "Very Good" },
    { id: 3, minScore: 50, maxScore: 59, grade: "C", remark: "Good" },
    { id: 4, minScore: 45, maxScore: 49, grade: "D", remark: "Fair" },
    { id: 5, minScore: 40, maxScore: 44, grade: "E", remark: "Pass" },
    { id: 6, minScore: 0, maxScore: 39, grade: "F", remark: "Fail" },
  ],
  auditLogs: [
    { id: 1, userId: 2, action: "CREATE", resource: "student", resourceId: 1, description: "Added student: Amina Bello", timestamp: "2024-09-05T10:30:00Z" },
    { id: 2, userId: 3, action: "CREATE", resource: "assessment", resourceId: 1, description: "Created: First Assignment", timestamp: "2024-10-04T09:00:00Z" },
  ],
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getGrade = (score, gradingSystem) => {
  const entry = gradingSystem.find(g => score >= g.minScore && score <= g.maxScore);
  return entry ? { grade: entry.grade, remark: entry.remark } : { grade: "F", remark: "Fail" };
};

const calcStudentSubjectTotal = (studentId, teacherSubjectId, db) => {
  const assessmentIds = db.assessments
    .filter(a => a.teacherSubjectId === teacherSubjectId && a.status === "submitted")
    .map(a => a.id);
  const studentScores = db.scores.filter(s => assessmentIds.includes(s.assessmentId) && s.studentId === studentId);
  const total = studentScores.reduce((sum, s) => sum + s.score, 0);
  const maxPossible = db.assessments
    .filter(a => assessmentIds.includes(a.id))
    .reduce((sum, a) => sum + a.maxScore, 0);
  const percent = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
  return { total, maxPossible, percent };
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
};

const generateId = (arr) => arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;

// ============================================================
// STYLES (CSS-in-JS via style tag injection)
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body { font-family: 'Inter', sans-serif; background: ${COLORS.bg}; color: ${COLORS.text}; }

:root {
  --primary: ${COLORS.primary};
  --primary-dark: ${COLORS.primaryDark};
  --accent: ${COLORS.accent};
  --success: ${COLORS.success};
  --danger: ${COLORS.danger};
  --warning: ${COLORS.warning};
  --sidebar: ${COLORS.sidebar};
  --surface: ${COLORS.surface};
  --border: ${COLORS.border};
  --text: ${COLORS.text};
  --text-mid: ${COLORS.textMid};
  --text-light: ${COLORS.textLight};
  --bg: ${COLORS.bg};
}

.app-root { display: flex; min-height: 100vh; }

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: var(--sidebar);
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  overflow-y: auto;
}
.sidebar.closed { transform: translateX(-260px); }
.sidebar-brand {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; gap: 10px;
}
.sidebar-logo {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--accent); display: flex; align-items: center;
  justify-content: center; font-weight: 800; font-size: 18px; color: #fff;
  flex-shrink: 0;
}
.sidebar-brand-text { font-size: 13px; font-weight: 700; line-height: 1.3; }
.sidebar-brand-sub { font-size: 10px; opacity: 0.6; font-weight: 400; }
.sidebar-nav { padding: 12px 0; flex: 1; }
.nav-section-label {
  font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
  opacity: 0.45; padding: 12px 16px 4px; font-weight: 600;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; cursor: pointer; font-size: 13.5px; font-weight: 500;
  color: rgba(255,255,255,0.7); border-radius: 0;
  transition: all 0.15s ease; text-decoration: none;
  border-left: 3px solid transparent;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-item.active { background: rgba(255,255,255,0.12); color: #fff; border-left-color: var(--accent); }
.nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.sidebar-footer { padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); }
.sidebar-user { display: flex; align-items: center; gap: 10px; }
.sidebar-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--primary-dark); display: flex;
  align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.sidebar-user-info { font-size: 12px; }
.sidebar-user-name { font-weight: 600; color: #fff; }
.sidebar-user-role { opacity: 0.55; font-size: 11px; }

/* MAIN */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left 0.3s ease; }
.main-content.sidebar-closed { margin-left: 0; }

/* TOPBAR */
.topbar {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 0 24px; height: 64px; display: flex; align-items: center;
  justify-content: space-between; position: sticky; top: 0; z-index: 900;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.topbar-left { display: flex; align-items: center; gap: 16px; }
.menu-toggle {
  background: none; border: none; cursor: pointer; font-size: 20px;
  color: var(--text-mid); padding: 4px; border-radius: 6px;
  display: none;
}
.page-title { font-size: 17px; font-weight: 700; color: var(--text); }
.breadcrumb { font-size: 12px; color: var(--text-light); margin-top: 1px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-badge {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600;
  color: var(--text-mid); white-space: nowrap;
}
.topbar-role-badge {
  padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.role-superadmin { background: #EDE9FE; color: #7C3AED; }
.role-admin { background: #DBEAFE; color: #1D4ED8; }
.role-teacher { background: #D1FAE5; color: #065F46; }
.role-student { background: #FEF3C7; color: #92400E; }
.role-parent { background: #FCE7F3; color: #9D174D; }
.logout-btn {
  background: none; border: 1px solid var(--border);
  padding: 6px 14px; border-radius: 8px; cursor: pointer;
  font-size: 12px; font-weight: 600; color: var(--danger);
  transition: all 0.15s;
}
.logout-btn:hover { background: var(--danger); color: #fff; border-color: var(--danger); }

/* PAGE CONTENT */
.page-content { padding: 24px; flex: 1; }

/* CARDS */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 20px; display: flex;
  align-items: center; gap: 14px;
}
.stat-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.stat-label { font-size: 12px; color: var(--text-light); font-weight: 500; }
.stat-value { font-size: 26px; font-weight: 800; color: var(--text); line-height: 1.1; }
.stat-sub { font-size: 11px; color: var(--text-light); margin-top: 2px; }

/* TABLES */
.table-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
}
.table-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  flex-wrap: wrap;
}
.table-title { font-size: 15px; font-weight: 700; color: var(--text); }
.table-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
thead th {
  background: #F8FAFC; padding: 10px 14px;
  text-align: left; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-mid);
  border-bottom: 1px solid var(--border); white-space: nowrap;
}
tbody td {
  padding: 12px 14px; border-bottom: 1px solid var(--border);
  color: var(--text); vertical-align: middle;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: var(--bg); }
.td-name { font-weight: 600; }
.td-sub { font-size: 11.5px; color: var(--text-light); margin-top: 1px; }

/* BADGES */
.badge {
  display: inline-block; padding: 3px 9px; border-radius: 20px;
  font-size: 11px; font-weight: 700; white-space: nowrap;
}
.badge-success { background: #D1FAE5; color: #065F46; }
.badge-danger { background: #FEE2E2; color: #B91C1C; }
.badge-warning { background: #FEF3C7; color: #92400E; }
.badge-info { background: #DBEAFE; color: #1D4ED8; }
.badge-gray { background: #F3F4F6; color: #6B7280; }
.badge-purple { background: #EDE9FE; color: #7C3AED; }
.grade-A { background: #D1FAE5; color: #065F46; }
.grade-B { background: #DBEAFE; color: #1D4ED8; }
.grade-C { background: #FEF3C7; color: #92400E; }
.grade-D { background: #FDE8D8; color: #9A3412; }
.grade-E { background: #F3F4F6; color: #6B7280; }
.grade-F { background: #FEE2E2; color: #B91C1C; }

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-accent { background: var(--accent); color: #fff; }
.btn-accent:hover { background: #D48B0F; }
.btn-success { background: var(--success); color: #fff; }
.btn-success:hover { background: #27AE60; }
.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: #C0392B; }
.btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-mid); }
.btn-outline:hover { background: var(--bg); border-color: var(--primary); color: var(--primary); }
.btn-sm { padding: 5px 11px; font-size: 12px; border-radius: 6px; }
.btn-icon { padding: 6px; min-width: 30px; justify-content: center; }

/* FORMS */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full-width { grid-column: 1 / -1; }
label { font-size: 12px; font-weight: 600; color: var(--text-mid); }
.form-control {
  padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
  font-size: 13.5px; color: var(--text); background: var(--surface);
  transition: border-color 0.15s; font-family: 'Inter', sans-serif;
  width: 100%;
}
.form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(27,79,138,0.12); }
select.form-control { cursor: pointer; }
.form-hint { font-size: 11px; color: var(--text-light); }
.form-error { font-size: 11px; color: var(--danger); }

/* SEARCH */
.search-wrap { position: relative; }
.search-input {
  padding: 8px 12px 8px 36px; border: 1px solid var(--border);
  border-radius: 8px; font-size: 13px; width: 220px; color: var(--text);
  background: var(--surface); font-family: 'Inter', sans-serif;
}
.search-input:focus { outline: none; border-color: var(--primary); }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-light); font-size: 15px; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; padding: 20px;
}
.modal {
  background: var(--surface); border-radius: 14px;
  width: 100%; max-width: 620px; max-height: 90vh;
  overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-lg { max-width: 820px; }
.modal-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title { font-size: 16px; font-weight: 700; }
.modal-close {
  background: none; border: none; cursor: pointer; font-size: 20px;
  color: var(--text-light); line-height: 1; border-radius: 6px; padding: 2px 6px;
}
.modal-close:hover { background: var(--bg); color: var(--danger); }
.modal-body { padding: 24px; }
.modal-footer {
  padding: 16px 24px; border-top: 1px solid var(--border);
  display: flex; justify-content: flex-end; gap: 8px;
}

/* ALERTS / NOTIFICATIONS */
.alert {
  padding: 12px 16px; border-radius: 8px; font-size: 13px;
  font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.alert-success { background: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7; }
.alert-danger { background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; }
.alert-warning { background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
.alert-info { background: #DBEAFE; color: #1D4ED8; border: 1px solid #93C5FD; }

/* NOTIFICATION TOAST */
.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
.toast {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px 16px; font-size: 13px; font-weight: 500;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12); max-width: 320px;
  display: flex; align-items: center; gap: 10px;
  animation: slideIn 0.3s ease;
}
.toast-success { border-left: 4px solid var(--success); }
.toast-danger { border-left: 4px solid var(--danger); }
.toast-info { border-left: 4px solid var(--primary); }
@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* CHARTS */
.chart-bar-wrap { display: flex; flex-direction: column; gap: 10px; }
.chart-bar-row { display: flex; align-items: center; gap: 10px; }
.chart-bar-label { font-size: 12px; color: var(--text-mid); width: 100px; text-align: right; flex-shrink: 0; }
.chart-bar-track { flex: 1; background: var(--bg); border-radius: 4px; height: 10px; overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.chart-bar-value { font-size: 12px; font-weight: 700; color: var(--text); width: 40px; flex-shrink: 0; }

/* EMPTY STATE */
.empty-state {
  text-align: center; padding: 48px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-icon { font-size: 48px; opacity: 0.3; }
.empty-title { font-size: 15px; font-weight: 700; color: var(--text); }
.empty-desc { font-size: 13px; color: var(--text-light); max-width: 280px; }

/* SCORE TABLE */
.score-input {
  padding: 5px 8px; border: 1px solid var(--border); border-radius: 6px;
  font-size: 13px; width: 70px; text-align: center; font-family: 'Inter', sans-serif;
}
.score-input:focus { outline: none; border-color: var(--primary); }
.score-input.over-max { border-color: var(--danger); background: #FFF5F5; }

/* REPORT CARD */
.report-card {
  background: #fff; padding: 32px; max-width: 700px; margin: 0 auto;
  border: 2px solid #1B4F8A; font-family: 'Inter', sans-serif;
}
.report-card-header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #1B4F8A; padding-bottom: 16px; margin-bottom: 20px; }
.report-school-logo { width: 72px; height: 72px; border-radius: 50%; background: #1B4F8A; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #fff; flex-shrink: 0; }
.report-school-name { font-size: 20px; font-weight: 800; color: #1B4F8A; }
.report-school-addr { font-size: 11.5px; color: #4A5A72; }
.report-card-title { font-size: 13px; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 1px; color: #1B4F8A; margin: 12px 0; }
.report-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: #F0F4F8; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
.report-info-item label { font-size: 10px; text-transform: uppercase; color: #4A5A72; font-weight: 700; }
.report-info-item p { font-size: 13px; font-weight: 600; color: #1A2B4B; }
.report-table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 16px; }
.report-table th { background: #1B4F8A; color: #fff; padding: 8px; text-align: center; font-size: 11px; }
.report-table td { border: 1px solid #DDE3EE; padding: 7px 8px; text-align: center; }
.report-table tr:nth-child(even) td { background: #F7F9FC; }
.report-comments { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.report-comment-box { border: 1px solid #DDE3EE; border-radius: 8px; padding: 10px; }
.report-comment-label { font-size: 10px; font-weight: 700; color: #4A5A72; text-transform: uppercase; margin-bottom: 4px; }
.report-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #F0F4F8; padding: 12px; border-radius: 8px; text-align: center; }
.report-summary-item label { font-size: 10px; color: #4A5A72; font-weight: 700; text-transform: uppercase; }
.report-summary-item p { font-size: 16px; font-weight: 800; color: #1B4F8A; }

/* LOGIN */
.login-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0F2E5A 0%, #1B4F8A 100%); padding: 20px;
}
.login-card {
  background: #fff; border-radius: 16px; padding: 40px;
  width: 100%; max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.3);
}
.login-logo { width: 72px; height: 72px; border-radius: 20px; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 800; color: #fff; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(27,79,138,0.4); }
.login-title { font-size: 24px; font-weight: 800; text-align: center; color: var(--text); }
.login-sub { font-size: 13px; color: var(--text-light); text-align: center; margin-bottom: 28px; }
.auth-tabs { display: flex; background: var(--bg); border-radius: 10px; padding: 4px; margin-bottom: 24px; }
.auth-tab { flex: 1; padding: 8px; text-align: center; font-size: 13px; font-weight: 600; border-radius: 8px; cursor: pointer; color: var(--text-light); transition: all 0.2s; border: none; background: none; }
.auth-tab.active { background: var(--surface); color: var(--primary); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.role-select-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.role-option { border: 2px solid var(--border); border-radius: 10px; padding: 10px 8px; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--surface); }
.role-option:hover { border-color: var(--primary); background: #EFF6FF; }
.role-option.selected { border-color: var(--primary); background: #EFF6FF; }
.role-option-icon { font-size: 22px; margin-bottom: 4px; }
.role-option-label { font-size: 12px; font-weight: 700; color: var(--text-mid); }
.role-option.selected .role-option-label { color: var(--primary); }
.auth-divider { text-align: center; color: var(--text-light); font-size: 12px; margin: 16px 0; position: relative; }
.auth-divider::before, .auth-divider::after { content: ""; position: absolute; top: 50%; width: 40%; height: 1px; background: var(--border); }
.auth-divider::before { left: 0; }
.auth-divider::after { right: 0; }
.pending-notice { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #92400E; margin-bottom: 16px; }

/* PAGINATION */
.pagination { display: flex; gap: 4px; align-items: center; justify-content: flex-end; padding: 12px 16px; }
.page-btn { padding: 5px 10px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; background: var(--surface); color: var(--text-mid); }
.page-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
.page-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

/* SECTION HEADING */
.section-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.section-title { font-size: 18px; font-weight: 800; color: var(--text); }
.section-desc { font-size: 13px; color: var(--text-light); margin-top: 2px; }

/* GRID LAYOUTS */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

/* CARD */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.card-body { padding: 20px; }
.card-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--text); }

/* PROGRESS */
.progress-bar { background: var(--bg); border-radius: 100px; height: 8px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 100px; transition: width 0.4s ease; }

/* AVATAR */
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }

/* DIVIDER */
.divider { height: 1px; background: var(--border); margin: 16px 0; }

/* TAG */
.tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: var(--bg); color: var(--text-mid); border: 1px solid var(--border); }

/* SCORE CELL */
.score-cell { font-weight: 700; font-size: 14px; }

/* @MEDIA RESPONSIVE */
@media (max-width: 1024px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .sidebar { transform: translateX(-260px); }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; }
  .menu-toggle { display: flex; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .form-grid { grid-template-columns: 1fr; }
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .page-content { padding: 16px; }
  .search-input { width: 160px; }
  .topbar { padding: 0 16px; }
  .report-info-grid { grid-template-columns: 1fr 1fr; }
  .report-comments { grid-template-columns: 1fr; }
  .report-summary { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .stat-grid { grid-template-columns: 1fr; }
  .login-card { padding: 28px 20px; }
  .modal { max-width: 100%; margin: 0; border-radius: 14px 14px 0 0; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .topbar-badge { display: none; }
}

.sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; }
@media (max-width: 768px) { .sidebar-overlay.show { display: block; } }
`;

// ============================================================
// TOAST SYSTEM
// ============================================================
let toastQueue = [];
let toastSetter = null;

const toast = (message, type = "info") => {
  const id = Date.now();
  const newToast = { id, message, type };
  if (toastSetter) toastSetter(prev => [...prev, newToast]);
  setTimeout(() => { if (toastSetter) toastSetter(prev => prev.filter(t => t.id !== id)); }, 3500);
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { toastSetter = setToasts; return () => { toastSetter = null; }; }, []);
  const icons = { success: "✅", danger: "❌", info: "ℹ️" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{icons[t.type] || "ℹ️"}</span> {t.message}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// MODAL COMPONENT
// ============================================================
const Modal = ({ title, onClose, children, footer, size = "" }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal ${size === "lg" ? "modal-lg" : ""}`}>
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

// ============================================================
// CONFIRM DIALOG
// ============================================================
const Confirm = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: 380 }}>
      <div className="modal-header"><span className="modal-title">⚠️ Confirm Action</span></div>
      <div className="modal-body"><p style={{ fontSize: 14, lineHeight: 1.6 }}>{message}</p></div>
      <div className="modal-footer">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Yes, Confirm</button>
      </div>
    </div>
  </div>
);

// ============================================================
// AUTH PAGE (LOGIN + SIGNUP)
// ============================================================
const LoginPage = ({ onLogin, db, setDb }) => {
  const [tab, setTab] = useState("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "", role: "student", gender: "Male", admNo: "", staffId: "", qualification: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const roles = [
    { key: "admin", label: "Admin", icon: "🏫" },
    { key: "teacher", label: "Teacher", icon: "👨‍🏫" },
    { key: "student", label: "Student", icon: "👨‍🎓" },
    { key: "parent", label: "Parent", icon: "👨‍👧" },
  ];

  const handleLogin = () => {
    setError("");
    if (!loginForm.username || !loginForm.password) { setError("Please enter username and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = db.users.find(u => u.username === loginForm.username && u.password === loginForm.password);
      if (!user) { setError("Invalid username or password. Please try again."); setLoading(false); return; }
      if (user.status === "pending") { setError("Your account is pending admin approval. Please wait."); setLoading(false); return; }
      if (user.status === "inactive") { setError("Your account has been deactivated. Contact admin."); setLoading(false); return; }
      onLogin(user);
      setLoading(false);
    }, 700);
  };

  const handleSignup = () => {
    setError(""); setSuccess("");
    const { name, username, email, password, confirmPassword, role } = signupForm;
    if (!name || !username || !email || !password) { setError("Please fill in all required fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (db.users.find(u => u.username === username)) { setError("Username already taken. Choose another."); return; }
    if (db.users.find(u => u.email === email)) { setError("Email already registered."); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: generateId(db.users),
        username, password, email,
        name, role,
        phone: signupForm.phone,
        gender: signupForm.gender,
        status: role === "admin" ? "pending" : "active",
        createdAt: new Date().toISOString(),
      };
      let updatedDb = { ...db, users: [...db.users, newUser] };

      if (role === "teacher") {
        const newTeacher = { id: generateId(db.teachers), userId: newUser.id, staffId: signupForm.staffId || `TCH${String(generateId(db.teachers)).padStart(3,"0")}`, name, phone: signupForm.phone, email, gender: signupForm.gender, qualification: signupForm.qualification, status: "active", joinDate: new Date().toISOString().slice(0,10) };
        updatedDb = { ...updatedDb, teachers: [...updatedDb.teachers, newTeacher] };
        updatedDb.users[updatedDb.users.length - 1].teacherId = newTeacher.id;
      }
      if (role === "student") {
        const newStudent = { id: generateId(db.students), userId: newUser.id, admNo: signupForm.admNo || `ADM/${new Date().getFullYear()}/${String(generateId(db.students)).padStart(3,"0")}`, name, gender: signupForm.gender, dob: "", classId: null, sessionId: 1, phone: signupForm.phone, email, address: "", status: "active", photo: null };
        updatedDb = { ...updatedDb, students: [...updatedDb.students, newStudent] };
        updatedDb.users[updatedDb.users.length - 1].studentId = newStudent.id;
      }
      if (role === "parent") {
        const newParent = { id: generateId(db.parents), name, phone: signupForm.phone, email, address: "", occupation: "" };
        updatedDb = { ...updatedDb, parents: [...updatedDb.parents, newParent] };
        updatedDb.users[updatedDb.users.length - 1].parentId = newParent.id;
      }

      setDb(updatedDb);
      setLoading(false);
      if (role === "admin") {
        setSuccess("✅ Account created! Awaiting Super Admin approval before you can log in.");
      } else {
        setSuccess("✅ Account created successfully! You can now log in.");
      }
      setSignupForm({ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "", role: "student", gender: "Male", admNo: "", staffId: "", qualification: "" });
      setTimeout(() => { setTab("login"); setSuccess(""); }, 2500);
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 460 }}>
        <div className="login-logo">🏫</div>
        <div className="login-title">SBA System</div>
        <div className="login-sub">Secondary School Assessment Management</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>Create Account</button>
        </div>

        {error && <div className="alert alert-danger">⚠️ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {tab === "login" ? (
          <>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Username</label>
              <input className="form-control" placeholder="Enter your username" value={loginForm.username} onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="username" />
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-control" type={showPass ? "text" : "password"} placeholder="Enter your password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="current-password" />
                <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }} onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "🔐 Sign In"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: COLORS.textLight }}>
              Don't have an account? <span style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }} onClick={() => { setTab("signup"); setError(""); }}>Create one here</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMid, marginBottom: 8, display: "block" }}>I am a... *</label>
              <div className="role-select-grid">
                {roles.map(r => (
                  <div key={r.key} className={`role-option ${signupForm.role === r.key ? "selected" : ""}`} onClick={() => setSignupForm(f => ({ ...f, role: r.key }))}>
                    <div className="role-option-icon">{r.icon}</div>
                    <div className="role-option-label">{r.label}</div>
                  </div>
                ))}
              </div>
              {signupForm.role === "admin" && <div className="pending-notice">⏳ Admin accounts require Super Admin approval before activation.</div>}
            </div>

            <div className="form-grid">
              <div className="form-group full-width"><label>Full Name *</label><input className="form-control" placeholder="Enter your full name" value={signupForm.name} onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="form-group"><label>Username *</label><input className="form-control" placeholder="Choose a username" value={signupForm.username} onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))} /></div>
              <div className="form-group"><label>Gender</label><select className="form-control" value={signupForm.gender} onChange={e => setSignupForm(f => ({ ...f, gender: e.target.value }))}><option>Male</option><option>Female</option></select></div>
              <div className="form-group full-width"><label>Email Address *</label><input className="form-control" type="email" placeholder="Enter your email" value={signupForm.email} onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="form-group full-width"><label>Phone Number</label><input className="form-control" placeholder="e.g. 08012345678" value={signupForm.phone} onChange={e => setSignupForm(f => ({ ...f, phone: e.target.value }))} /></div>

              {signupForm.role === "student" && (
                <div className="form-group full-width"><label>Admission Number</label><input className="form-control" placeholder="e.g. ADM/2024/001 (optional)" value={signupForm.admNo} onChange={e => setSignupForm(f => ({ ...f, admNo: e.target.value }))} /></div>
              )}
              {signupForm.role === "teacher" && (<>
                <div className="form-group"><label>Staff ID</label><input className="form-control" placeholder="e.g. TCH001 (optional)" value={signupForm.staffId} onChange={e => setSignupForm(f => ({ ...f, staffId: e.target.value }))} /></div>
                <div className="form-group"><label>Qualification</label><input className="form-control" placeholder="e.g. B.Sc Mathematics" value={signupForm.qualification} onChange={e => setSignupForm(f => ({ ...f, qualification: e.target.value }))} /></div>
              </>)}

              <div className="form-group">
                <label>Password *</label>
                <div style={{ position: "relative" }}>
                  <input className="form-control" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={signupForm.password} onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))} />
                  <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>{showPass ? "🙈" : "👁️"}</button>
                </div>
              </div>
              <div className="form-group"><label>Confirm Password *</label><input className="form-control" type="password" placeholder="Re-enter password" value={signupForm.confirmPassword} onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))} /></div>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, marginTop: 8 }} onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "✅ Create Account"}
            </button>
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: COLORS.textLight }}>
              Already have an account? <span style={{ color: COLORS.primary, fontWeight: 700, cursor: "pointer" }} onClick={() => { setTab("login"); setError(""); }}>Sign in here</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// NAV CONFIG
// ============================================================
const NAV = {
  superadmin: [
    { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "📊" }, { key: "approvals", label: "User Approvals", icon: "✅" }] },
    { section: "Management", items: [{ key: "students", label: "Students", icon: "👨‍🎓" }, { key: "teachers", label: "Teachers", icon: "👨‍🏫" }, { key: "classes", label: "Classes", icon: "🏛️" }, { key: "subjects", label: "Subjects", icon: "📚" }] },
    { section: "Academics", items: [{ key: "sessions", label: "Academic Sessions", icon: "📅" }, { key: "assessments", label: "Assessments", icon: "📝" }, { key: "scores", label: "Score Management", icon: "🎯" }, { key: "results", label: "Results", icon: "📋" }, { key: "attendance", label: "Attendance", icon: "✅" }, { key: "reportcards", label: "Report Cards", icon: "📄" }] },
    { section: "Configuration", items: [{ key: "grading", label: "Grading System", icon: "⭐" }, { key: "analytics", label: "Analytics", icon: "📈" }, { key: "auditlogs", label: "Audit Logs", icon: "🔍" }] },
  ],
  admin: [
    { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "📊" }] },
    { section: "Management", items: [{ key: "students", label: "Students", icon: "👨‍🎓" }, { key: "teachers", label: "Teachers", icon: "👨‍🏫" }, { key: "classes", label: "Classes", icon: "🏛️" }, { key: "subjects", label: "Subjects", icon: "📚" }] },
    { section: "Academics", items: [{ key: "assessments", label: "Assessments", icon: "📝" }, { key: "scores", label: "Score Management", icon: "🎯" }, { key: "results", label: "Results", icon: "📋" }, { key: "attendance", label: "Attendance", icon: "✅" }, { key: "reportcards", label: "Report Cards", icon: "📄" }] },
    { section: "Reports", items: [{ key: "grading", label: "Grading System", icon: "⭐" }, { key: "analytics", label: "Analytics", icon: "📈" }] },
  ],
  teacher: [
    { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "📊" }] },
    { section: "Academics", items: [{ key: "assessments", label: "My Assessments", icon: "📝" }, { key: "scores", label: "Score Entry", icon: "🎯" }, { key: "attendance", label: "Attendance", icon: "✅" }, { key: "results", label: "Results", icon: "📋" }] },
  ],
  student: [
    { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "📊" }] },
    { section: "My Academic", items: [{ key: "results", label: "My Results", icon: "📋" }, { key: "attendance", label: "My Attendance", icon: "✅" }, { key: "reportcards", label: "Report Card", icon: "📄" }] },
  ],
  parent: [
    { section: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "📊" }] },
    { section: "My Child", items: [{ key: "results", label: "Results", icon: "📋" }, { key: "attendance", label: "Attendance", icon: "✅" }, { key: "reportcards", label: "Report Cards", icon: "📄" }] },
  ],
};

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
const Sidebar = ({ user, currentPage, onNav, isOpen, db }) => {
  const nav = NAV[user.role] || NAV.student;
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const pendingCount = db ? db.users.filter(u => u.status === "pending").length : 0;
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">🏫</div>
        <div>
          <div className="sidebar-brand-text">SBA Manager</div>
          <div className="sidebar-brand-sub">School Management System</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(section => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => (
              <div key={item.key} className={`nav-item ${currentPage === item.key ? "active" : ""}`} onClick={() => onNav(item.key)}>
                <span className="nav-icon">{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.key === "approvals" && pendingCount > 0 && (
                  <span style={{ background: "#E74C3C", color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 800, marginLeft: 4 }}>{pendingCount}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name.split(" ")[0]}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================
const DashboardPage = ({ user, db, setDb }) => {
  const currentSession = db.academicSessions.find(s => s.isCurrent);
  const currentTerm = db.terms.find(t => t.isCurrent);
  const activeStudents = db.students.filter(s => s.status === "active").length;
  const activeTeachers = db.teachers.filter(t => t.status === "active").length;
  const pendingAssessments = db.assessments.filter(a => a.status === "draft").length;
  const submittedAssessments = db.assessments.filter(a => a.status === "submitted").length;

  const isTeacher = user.role === "teacher";
  const isStudent = user.role === "student" || user.role === "parent";

  const myTeacher = isTeacher ? db.teachers.find(t => t.userId === user.id) : null;
  const myTeacherSubjects = myTeacher ? db.teacherSubjects.filter(ts => ts.teacherId === myTeacher.id) : [];

  const myStudent = db.students.find(s => s.userId === user.id || (user.role === "parent" && s.id === user.studentId));

  const gradeColors = { A: "#2ECC71", B: "#3498DB", C: "#F39C12", D: "#E67E22", E: "#95A5A6", F: "#E74C3C" };

  if (isStudent && myStudent) {
    const myClassStudents = db.students.filter(s => s.classId === myStudent.classId);
    const myAttendance = db.attendance.filter(a => a.studentId === myStudent.id);
    const presentDays = myAttendance.filter(a => a.status === "present").length;
    const attendancePct = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 0;
    const myClass = db.classes.find(c => c.id === myStudent.classId);

    return (
      <div>
        <div className="section-heading">
          <div><div className="section-title">Welcome, {myStudent.name.split(" ")[0]}! 👋</div><div className="section-desc">{myClass?.name} · {currentSession?.name} · {currentTerm?.name}</div></div>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-icon" style={{ background: "#EDE9FE" }}>📊</div><div><div className="stat-label">Attendance Rate</div><div className="stat-value">{attendancePct}%</div><div className="stat-sub">{presentDays}/{myAttendance.length} days</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#D1FAE5" }}>🏫</div><div><div className="stat-label">My Class</div><div className="stat-value" style={{ fontSize: 18 }}>{myClass?.name}</div><div className="stat-sub">{myClassStudents.length} students</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#DBEAFE" }}>📚</div><div><div className="stat-label">Subjects</div><div className="stat-value">{db.teacherSubjects.filter(ts => ts.classId === myStudent.classId).length}</div><div className="stat-sub">Enrolled subjects</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#FEF3C7" }}>📝</div><div><div className="stat-label">Assessments</div><div className="stat-value">{db.assessments.filter(a => a.status === "submitted").length}</div><div className="stat-sub">Completed</div></div></div>
        </div>
        <div className="alert alert-info">📌 Your results and report card will be available once your teacher submits and admin approves your scores.</div>
      </div>
    );
  }

  if (isTeacher && myTeacher) {
    const myClasses = [...new Set(myTeacherSubjects.map(ts => ts.classId))];
    const mySubjects = [...new Set(myTeacherSubjects.map(ts => ts.subjectId))];
    return (
      <div>
        <div className="section-heading">
          <div><div className="section-title">Welcome, {myTeacher.name.split(" ")[0]}! 👋</div><div className="section-desc">{currentSession?.name} · {currentTerm?.name}</div></div>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-icon" style={{ background: "#D1FAE5" }}>🏛️</div><div><div className="stat-label">My Classes</div><div className="stat-value">{myClasses.length}</div><div className="stat-sub">Assigned</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#DBEAFE" }}>📚</div><div><div className="stat-label">My Subjects</div><div className="stat-value">{mySubjects.length}</div><div className="stat-sub">Teaching</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#FEF3C7" }}>📝</div><div><div className="stat-label">Draft Assessments</div><div className="stat-value">{db.assessments.filter(a => myTeacherSubjects.some(ts => ts.id === a.teacherSubjectId) && a.status === "draft").length}</div><div className="stat-sub">Pending submit</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: "#EDE9FE" }}>✅</div><div><div className="stat-label">Submitted</div><div className="stat-value">{db.assessments.filter(a => myTeacherSubjects.some(ts => ts.id === a.teacherSubjectId) && a.status === "submitted").length}</div><div className="stat-sub">This term</div></div></div>
        </div>
        <div className="card"><div className="card-body"><div className="card-title">📋 My Subject Assignments</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr><th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #DDE3EE", color: "#4A5A72" }}>Subject</th><th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #DDE3EE", color: "#4A5A72" }}>Class</th><th style={{ padding: "8px", borderBottom: "1px solid #DDE3EE", color: "#4A5A72" }}>Students</th></tr></thead>
            <tbody>{myTeacherSubjects.map(ts => { const subj = db.subjects.find(s => s.id === ts.subjectId); const cls = db.classes.find(c => c.id === ts.classId); const count = db.students.filter(s => s.classId === ts.classId).length; return <tr key={ts.id}><td style={{ padding: "8px", borderBottom: "1px solid #F0F4F8" }}><strong>{subj?.name}</strong></td><td style={{ padding: "8px", borderBottom: "1px solid #F0F4F8" }}>{cls?.name}</td><td style={{ padding: "8px", borderBottom: "1px solid #F0F4F8", textAlign: "center" }}>{count}</td></tr>; })}</tbody>
          </table>
        </div></div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">
        <div>
          <div className="section-title">Admin Dashboard 📊</div>
          <div className="section-desc">{currentSession?.name} · {currentTerm?.name}</div>
        </div>
        <div className="topbar-badge">🟢 {currentSession?.name} Active</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon" style={{ background: "#DBEAFE" }}>👨‍🎓</div><div><div className="stat-label">Total Students</div><div className="stat-value">{activeStudents}</div><div className="stat-sub">{db.students.filter(s => s.status === "active").length} active</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#D1FAE5" }}>👨‍🏫</div><div><div className="stat-label">Total Teachers</div><div className="stat-value">{activeTeachers}</div><div className="stat-sub">{db.teachers.length} registered</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#FEF3C7" }}>🏛️</div><div><div className="stat-label">Total Classes</div><div className="stat-value">{db.classes.length}</div><div className="stat-sub">{db.subjects.length} subjects</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#EDE9FE" }}>📝</div><div><div className="stat-label">Pending Assessments</div><div className="stat-value">{pendingAssessments}</div><div className="stat-sub">{submittedAssessments} submitted</div></div></div>
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card"><div className="card-body"><div className="card-title">📊 Class Enrollment</div>
          <div className="chart-bar-wrap">
            {db.classes.map(cls => { const count = db.students.filter(s => s.classId === cls.id).length; const pct = cls.capacity > 0 ? (count / cls.capacity) * 100 : 0; return (<div key={cls.id} className="chart-bar-row"><div className="chart-bar-label">{cls.name}</div><div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${pct}%`, background: COLORS.primary }} /></div><div className="chart-bar-value">{count}</div></div>); })}
          </div>
        </div></div>
        <div className="card"><div className="card-body"><div className="card-title">📚 Subject Overview</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {db.subjects.slice(0, 5).map(subj => {
              const teachers = db.teacherSubjects.filter(ts => ts.subjectId === subj.id);
              return (<div key={subj.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F0F4F8" }}>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{subj.name}</div><div style={{ fontSize: 11, color: "#8A96A8" }}>{subj.code}</div></div>
                <span className="badge badge-info">{teachers.length} Teacher{teachers.length !== 1 ? "s" : ""}</span>
              </div>);
            })}
          </div>
        </div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-body"><div className="card-title">👥 Recent Students</div>
          {db.students.slice(0, 4).map(s => { const cls = db.classes.find(c => c.id === s.classId); return (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F0F4F8" }}><div className="avatar" style={{ fontSize: 12 }}>{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11, color: "#8A96A8" }}>{s.admNo} · {cls?.name}</div></div><span className={`badge badge-${s.status === "active" ? "success" : "danger"}`}>{s.status}</span></div>); })}
        </div></div>
        <div className="card"><div className="card-body"><div className="card-title">📅 Assessment Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["Draft", pendingAssessments, "#FEF3C7", "#92400E"], ["Submitted", submittedAssessments, "#D1FAE5", "#065F46"]].map(([label, val, bg, col]) => (
              <div key={label} style={{ background: bg, borderRadius: 8, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: col }}>{label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: col }}>{val}</span>
              </div>
            ))}
          </div>
        </div></div>
      </div>

      {/* PENDING ACCOUNTS APPROVAL */}
      <PendingApprovals db={db} setDb={setDb} />
    </div>
  );
};

// ============================================================
// PENDING APPROVALS COMPONENT (standalone so setDb always works)
// ============================================================
const PendingApprovals = ({ db, setDb }) => {
  const pending = db.users.filter(u => u.status === "pending");
  if (pending.length === 0) return null;

  const approveUser = (u) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(x => x.id === u.id ? { ...x, status: "active" } : x)
    }));
    toast(`✅ ${u.name} approved! They can now log in.`, "success");
  };

  const rejectUser = (u) => {
    setDb(prev => ({
      ...prev,
      users: prev.users.map(x => x.id === u.id ? { ...x, status: "inactive" } : x)
    }));
    toast(`❌ ${u.name}'s account rejected.`, "danger");
  };

  const roleColors = {
    admin: { bg: "#DBEAFE", color: "#1D4ED8" },
    teacher: { bg: "#D1FAE5", color: "#065F46" },
    student: { bg: "#FEF3C7", color: "#92400E" },
    parent: { bg: "#FCE7F3", color: "#9D174D" },
  };

  return (
    <div className="card" style={{ marginTop: 20, border: "2px solid #FCD34D", borderRadius: 12 }}>
      <div style={{ background: "#FEF3C7", padding: "14px 20px", borderBottom: "1px solid #FCD34D", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#92400E" }}>Pending Account Approvals</span>
        </div>
        <span style={{ background: "#92400E", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>{pending.length}</span>
      </div>
      <div style={{ padding: "4px 0" }}>
        {pending.map((u, i) => {
          const rc = roleColors[u.role] || { bg: "#F3F4F6", color: "#6B7280" };
          return (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < pending.length - 1 ? "1px solid #F0F4F8" : "none", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>@{u.username} · {u.email}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ background: rc.bg, color: rc.color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{u.role}</span>
                    {u.createdAt && <span style={{ fontSize: 11, color: COLORS.textLight, marginLeft: 8 }}>Registered: {new Date(u.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  className="btn btn-success"
                  style={{ padding: "8px 16px", fontSize: 13 }}
                  onClick={() => approveUser(u)}
                >
                  ✅ Approve
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: "8px 16px", fontSize: 13 }}
                  onClick={() => rejectUser(u)}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// STUDENTS PAGE
// ============================================================
const StudentsPage = ({ user, db, setDb }) => {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const canEdit = ["superadmin", "admin"].includes(user.role);

  const filtered = db.students.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.toLowerCase().includes(search.toLowerCase())) &&
    (!filterClass || s.classId === parseInt(filterClass)) &&
    (!filterStatus || s.status === filterStatus)
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const openAdd = () => { setForm({ name: "", gender: "Female", dob: "", classId: db.classes[0]?.id || "", phone: "", email: "", address: "", status: "active", admNo: `ADM/${new Date().getFullYear()}/${String(db.students.length + 1).padStart(3, "0")}` }); setModal("add"); };
  const openEdit = (s) => { setForm({ ...s }); setModal("edit"); };
  const openView = (s) => { setForm({ ...s }); setModal("view"); };

  const saveStudent = () => {
    if (!form.name || !form.admNo) { toast("Name and Admission No. are required.", "danger"); return; }
    if (modal === "add") {
      const newS = { ...form, id: generateId(db.students), classId: parseInt(form.classId) };
      setDb(d => ({ ...d, students: [...d.students, newS], auditLogs: [...d.auditLogs, { id: generateId(d.auditLogs), userId: user.id, action: "CREATE", resource: "student", resourceId: newS.id, description: `Added student: ${newS.name}`, timestamp: new Date().toISOString() }] }));
      toast("Student added successfully!", "success");
    } else {
      setDb(d => ({ ...d, students: d.students.map(s => s.id === form.id ? { ...form, classId: parseInt(form.classId) } : s), auditLogs: [...d.auditLogs, { id: generateId(d.auditLogs), userId: user.id, action: "UPDATE", resource: "student", resourceId: form.id, description: `Updated student: ${form.name}`, timestamp: new Date().toISOString() }] }));
      toast("Student updated successfully!", "success");
    }
    setModal(null);
  };

  const toggleStatus = (s) => {
    setConfirm({ msg: `${s.status === "active" ? "Deactivate" : "Activate"} student "${s.name}"?`, fn: () => { setDb(d => ({ ...d, students: d.students.map(st => st.id === s.id ? { ...st, status: st.status === "active" ? "inactive" : "active" } : st) })); toast(`Student ${s.status === "active" ? "deactivated" : "activated"}.`); setConfirm(null); } });
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Student Management 👨‍🎓</div><div className="section-desc">{db.students.filter(s => s.status === "active").length} active students</div></div>
        {canEdit && <button className="btn btn-primary" onClick={openAdd}>➕ Add Student</button>}
      </div>
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">All Students ({filtered.length})</span>
          <div className="table-controls">
            <div className="search-wrap"><span className="search-icon">🔍</span><input className="search-input" placeholder="Search name, adm no..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            <select className="form-control" style={{ width: 130 }} value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}>
              <option value="">All Classes</option>
              {db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select className="form-control" style={{ width: 110 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>#</th><th>Adm. No.</th><th>Name</th><th>Gender</th><th>Class</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.length === 0 ? <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">👨‍🎓</div><div className="empty-title">No students found</div><div className="empty-desc">Try adjusting search or filters</div></div></td></tr> :
                paged.map((s, i) => {
                  const cls = db.classes.find(c => c.id === s.classId);
                  return (<tr key={s.id}>
                    <td style={{ color: COLORS.textLight, fontSize: 12 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td><span className="tag">{s.admNo}</span></td>
                    <td><div className="td-name">{s.name}</div><div className="td-sub">{s.email || "—"}</div></td>
                    <td>{s.gender}</td>
                    <td>{cls?.name || "—"}</td>
                    <td>{s.phone || "—"}</td>
                    <td><span className={`badge badge-${s.status === "active" ? "success" : "danger"}`}>{s.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => openView(s)}>👁️</button>
                        {canEdit && <><button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(s)}>✏️</button>
                          <button className="btn btn-outline btn-sm btn-icon" onClick={() => toggleStatus(s)}>{s.status === "active" ? "🚫" : "✅"}</button></>}
                      </div>
                    </td>
                  </tr>);
                })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="pagination">{Array.from({ length: totalPages }, (_, i) => <button key={i} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}</div>}
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add New Student" : "Edit Student"} onClose={() => setModal(null)} size="lg"
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={saveStudent}>💾 Save Student</button></>}>
          <div className="form-grid">
            <div className="form-group"><label>Full Name *</label><input className="form-control" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Admission No. *</label><input className="form-control" value={form.admNo || ""} onChange={e => setForm(f => ({ ...f, admNo: e.target.value }))} /></div>
            <div className="form-group"><label>Gender</label><select className="form-control" value={form.gender || "Female"} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Female</option><option>Male</option></select></div>
            <div className="form-group"><label>Date of Birth</label><input className="form-control" type="date" value={form.dob || ""} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
            <div className="form-group"><label>Class</label><select className="form-control" value={form.classId || ""} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}>{db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="form-group"><label>Status</label><select className="form-control" value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            <div className="form-group full-width"><label>Address</label><input className="form-control" value={form.address || ""} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          </div>
        </Modal>
      )}

      {modal === "view" && (
        <Modal title="Student Profile" onClose={() => setModal(null)}>
          <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{form.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
            <div><div style={{ fontSize: 18, fontWeight: 800 }}>{form.name}</div><div style={{ color: COLORS.textLight, fontSize: 13 }}>{form.admNo}</div><span className={`badge badge-${form.status === "active" ? "success" : "danger"}`}>{form.status}</span></div>
          </div>
          <div className="form-grid">
            {[["Gender", form.gender], ["Date of Birth", formatDate(form.dob)], ["Class", db.classes.find(c => c.id === form.classId)?.name], ["Phone", form.phone], ["Email", form.email], ["Address", form.address]].map(([l, v]) => (
              <div key={l}><label style={{ fontSize: 11, color: COLORS.textLight, textTransform: "uppercase", fontWeight: 700 }}>{l}</label><div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v || "—"}</div></div>
            ))}
          </div>
        </Modal>
      )}

      {confirm && <Confirm message={confirm.msg} onConfirm={confirm.fn} onCancel={() => setConfirm(null)} />}
    </div>
  );
};

// ============================================================
// TEACHERS PAGE
// ============================================================
const TeachersPage = ({ user, db, setDb }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const canEdit = ["superadmin", "admin"].includes(user.role);

  const filtered = db.teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => setForm({ name: "", staffId: `TCH${String(db.teachers.length + 1).padStart(3, "0")}`, phone: "", email: "", gender: "Male", qualification: "", status: "active", joinDate: new Date().toISOString().slice(0, 10) });
  const saveTeacher = () => {
    if (!form.name) { toast("Name is required.", "danger"); return; }
    if (modal === "add") {
      const newT = { ...form, id: generateId(db.teachers) };
      const newUser = { id: generateId(db.users), username: form.email.split("@")[0], password: "teacher123", role: "teacher", name: form.name, email: form.email, teacherId: newT.id, status: "active" };
      setDb(d => ({ ...d, teachers: [...d.teachers, newT], users: [...d.users, newUser] }));
      toast("Teacher added! Default password: teacher123", "success");
    } else {
      setDb(d => ({ ...d, teachers: d.teachers.map(t => t.id === form.id ? form : t) }));
      toast("Teacher updated!", "success");
    }
    setModal(null);
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Teacher Management 👨‍🏫</div><div className="section-desc">{db.teachers.filter(t => t.status === "active").length} active teachers</div></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { openAdd(); setModal("add"); }}>➕ Add Teacher</button>}
      </div>
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">All Teachers</span>
          <div className="search-wrap"><span className="search-icon">🔍</span><input className="search-input" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Staff ID</th><th>Name</th><th>Qualification</th><th>Subjects</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">👨‍🏫</div><div className="empty-title">No teachers found</div></div></td></tr> :
                filtered.map(t => {
                  const mySubjects = db.teacherSubjects.filter(ts => ts.teacherId === t.id);
                  const subjNames = [...new Set(mySubjects.map(ts => db.subjects.find(s => s.id === ts.subjectId)?.name))].filter(Boolean);
                  return (<tr key={t.id}>
                    <td><span className="tag">{t.staffId}</span></td>
                    <td><div className="td-name">{t.name}</div><div className="td-sub">{t.email}</div></td>
                    <td>{t.qualification || "—"}</td>
                    <td>{subjNames.length > 0 ? subjNames.slice(0, 2).map(n => <span key={n} className="tag" style={{ marginRight: 3 }}>{n}</span>) : <span className="badge badge-gray">None</span>}</td>
                    <td>{t.phone || "—"}</td>
                    <td><span className={`badge badge-${t.status === "active" ? "success" : "danger"}`}>{t.status}</span></td>
                    <td>
                      {canEdit && <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...t }); setModal("edit"); }}>✏️ Edit</button>}
                    </td>
                  </tr>);
                })}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add New Teacher" : "Edit Teacher"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={saveTeacher}>💾 Save</button></>}>
          <div className="form-grid">
            <div className="form-group"><label>Full Name *</label><input className="form-control" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Staff ID</label><input className="form-control" value={form.staffId || ""} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))} /></div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email || ""} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Gender</label><select className="form-control" value={form.gender || "Male"} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Male</option><option>Female</option></select></div>
            <div className="form-group"><label>Qualification</label><input className="form-control" value={form.qualification || ""} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
            <div className="form-group"><label>Join Date</label><input className="form-control" type="date" value={form.joinDate || ""} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} /></div>
            <div className="form-group"><label>Status</label><select className="form-control" value={form.status || "active"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// CLASSES PAGE
// ============================================================
const ClassesPage = ({ user, db, setDb }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const canEdit = ["superadmin", "admin"].includes(user.role);

  const levels = ["JSS 1", "JSS 2", "JSS 3", "SS 1", "SS 2", "SS 3"];

  const saveClass = () => {
    if (!form.name) { toast("Class name is required.", "danger"); return; }
    if (modal === "add") {
      const newC = { ...form, id: generateId(db.classes), classTeacherId: parseInt(form.classTeacherId) || null, sessionId: 1, capacity: parseInt(form.capacity) || 40 };
      setDb(d => ({ ...d, classes: [...d.classes, newC] }));
      toast("Class created!", "success");
    } else {
      setDb(d => ({ ...d, classes: d.classes.map(c => c.id === form.id ? { ...form, classTeacherId: parseInt(form.classTeacherId) || null, capacity: parseInt(form.capacity) || 40 } : c) }));
      toast("Class updated!", "success");
    }
    setModal(null);
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Class Management 🏛️</div><div className="section-desc">{db.classes.length} classes registered</div></div>
        {canEdit && <button className="btn btn-primary" onClick={() => { setForm({ name: "", level: "JSS 1", capacity: 40, classTeacherId: "" }); setModal("add"); }}>➕ Add Class</button>}
      </div>
      <div className="grid-2">
        {db.classes.map(cls => {
          const teacher = db.teachers.find(t => t.id === cls.classTeacherId);
          const studentCount = db.students.filter(s => s.classId === cls.id).length;
          const subjectCount = db.teacherSubjects.filter(ts => ts.classId === cls.id).length;
          const fillPct = cls.capacity > 0 ? (studentCount / cls.capacity) * 100 : 0;
          return (
            <div key={cls.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{cls.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textLight }}>{cls.level}</div>
                  </div>
                  {canEdit && <button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...cls }); setModal("edit"); }}>✏️</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div><div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600 }}>CLASS TEACHER</div><div style={{ fontSize: 13, fontWeight: 600 }}>{teacher?.name.split(" ")[0] || "Unassigned"}</div></div>
                  <div><div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600 }}>SUBJECTS</div><div style={{ fontSize: 13, fontWeight: 600 }}>{subjectCount}</div></div>
                </div>
                <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: COLORS.textLight }}>Enrollment</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{studentCount}/{cls.capacity}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${fillPct}%`, background: fillPct > 90 ? COLORS.danger : fillPct > 70 ? COLORS.warning : COLORS.success }} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Class" : "Edit Class"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={saveClass}>💾 Save</button></>}>
          <div className="form-grid">
            <div className="form-group"><label>Class Name *</label><input className="form-control" placeholder="e.g. JSS 1A" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Level</label><select className="form-control" value={form.level || "JSS 1"} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>{levels.map(l => <option key={l}>{l}</option>)}</select></div>
            <div className="form-group"><label>Class Teacher</label><select className="form-control" value={form.classTeacherId || ""} onChange={e => setForm(f => ({ ...f, classTeacherId: e.target.value }))}><option value="">Select Teacher</option>{db.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div className="form-group"><label>Capacity</label><input className="form-control" type="number" value={form.capacity || 40} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// SUBJECTS PAGE
// ============================================================
const SubjectsPage = ({ user, db, setDb }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [assignForm, setAssignForm] = useState({});
  const canEdit = ["superadmin", "admin"].includes(user.role);

  const saveSubject = () => {
    if (!form.name || !form.code) { toast("Name and code required.", "danger"); return; }
    if (modal === "add") { setDb(d => ({ ...d, subjects: [...d.subjects, { ...form, id: generateId(d.subjects) }] })); toast("Subject added!", "success"); }
    else { setDb(d => ({ ...d, subjects: d.subjects.map(s => s.id === form.id ? form : s) })); toast("Subject updated!", "success"); }
    setModal(null);
  };

  const saveAssignment = () => {
    if (!assignForm.teacherId || !assignForm.subjectId || !assignForm.classId) { toast("All fields required.", "danger"); return; }
    const exists = db.teacherSubjects.find(ts => ts.teacherId === parseInt(assignForm.teacherId) && ts.subjectId === parseInt(assignForm.subjectId) && ts.classId === parseInt(assignForm.classId));
    if (exists) { toast("This assignment already exists.", "danger"); return; }
    const current = db.academicSessions.find(s => s.isCurrent);
    const currentTerm = db.terms.find(t => t.isCurrent);
    setDb(d => ({ ...d, teacherSubjects: [...d.teacherSubjects, { id: generateId(d.teacherSubjects), teacherId: parseInt(assignForm.teacherId), subjectId: parseInt(assignForm.subjectId), classId: parseInt(assignForm.classId), sessionId: current?.id || 1, termId: currentTerm?.id || 1 }] }));
    toast("Teacher assigned to subject/class!", "success");
    setModal(null);
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Subject Management 📚</div><div className="section-desc">{db.subjects.length} subjects</div></div>
        {canEdit && <div style={{ display: "flex", gap: 8 }}><button className="btn btn-outline" onClick={() => { setAssignForm({}); setModal("assign"); }}>🔗 Assign Teacher</button><button className="btn btn-primary" onClick={() => { setForm({ name: "", code: "", category: "Core" }); setModal("add"); }}>➕ Add Subject</button></div>}
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {db.subjects.map(subj => {
          const assignments = db.teacherSubjects.filter(ts => ts.subjectId === subj.id);
          const teachers = assignments.map(a => db.teachers.find(t => t.id === a.teacherId)).filter(Boolean);
          const uniqueTeachers = [...new Map(teachers.map(t => [t.id, t])).values()];
          return (
            <div key={subj.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div><div style={{ fontSize: 16, fontWeight: 800 }}>{subj.name}</div><span className="tag">{subj.code}</span> <span className="badge badge-info" style={{ marginLeft: 4 }}>{subj.category}</span></div>
                  {canEdit && <button className="btn btn-outline btn-sm btn-icon" onClick={() => { setForm({ ...subj }); setModal("edit"); }}>✏️</button>}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 6 }}>Teachers ({uniqueTeachers.length}):</div>
                {uniqueTeachers.length === 0 ? <span className="badge badge-gray">No teacher assigned</span> : uniqueTeachers.map(t => <span key={t.id} className="badge badge-info" style={{ marginRight: 4, marginBottom: 4 }}>{t.name.split(" ")[0]}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-card">
        <div className="table-header"><span className="table-title">Teacher–Subject Assignments</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Teacher</th><th>Subject</th><th>Class</th><th>Session</th></tr></thead>
            <tbody>
              {db.teacherSubjects.length === 0 ? <tr><td colSpan={4}><div className="empty-state"><div className="empty-icon">🔗</div><div className="empty-title">No assignments yet</div></div></td></tr> :
                db.teacherSubjects.map(ts => { const t = db.teachers.find(t => t.id === ts.teacherId); const s = db.subjects.find(s => s.id === ts.subjectId); const c = db.classes.find(c => c.id === ts.classId); const sess = db.academicSessions.find(a => a.id === ts.sessionId); return (<tr key={ts.id}><td>{t?.name || "—"}</td><td>{s?.name || "—"}</td><td>{c?.name || "—"}</td><td>{sess?.name || "—"}</td></tr>); })}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Subject" : "Edit Subject"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={saveSubject}>💾 Save</button></>}>
          <div className="form-grid">
            <div className="form-group"><label>Subject Name *</label><input className="form-control" value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Code *</label><input className="form-control" placeholder="e.g. MTH" value={form.code || ""} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} /></div>
            <div className="form-group"><label>Category</label><select className="form-control" value={form.category || "Core"} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option>Core</option><option>Science</option><option>Humanities</option><option>Technical</option><option>Elective</option></select></div>
          </div>
        </Modal>
      )}

      {modal === "assign" && (
        <Modal title="Assign Teacher to Subject" onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={saveAssignment}>🔗 Assign</button></>}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Teacher *</label><select className="form-control" value={assignForm.teacherId || ""} onChange={e => setAssignForm(f => ({ ...f, teacherId: e.target.value }))}><option value="">Select Teacher</option>{db.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div className="form-group"><label>Subject *</label><select className="form-control" value={assignForm.subjectId || ""} onChange={e => setAssignForm(f => ({ ...f, subjectId: e.target.value }))}><option value="">Select Subject</option>{db.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Class *</label><select className="form-control" value={assignForm.classId || ""} onChange={e => setAssignForm(f => ({ ...f, classId: e.target.value }))}><option value="">Select Class</option>{db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// ASSESSMENTS PAGE
// ============================================================
const AssessmentsPage = ({ user, db, setDb }) => {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [confirm, setConfirm] = useState(null);
  const isTeacher = user.role === "teacher";
  const myTeacher = isTeacher ? db.teachers.find(t => t.userId === user.id) : null;
  const myTSIds = myTeacher ? db.teacherSubjects.filter(ts => ts.teacherId === myTeacher.id).map(ts => ts.id) : db.teacherSubjects.map(ts => ts.id);

  const assessments = db.assessments.filter(a => myTSIds.includes(a.teacherSubjectId));
  const types = db.assessmentConfig.map(c => c.type);

  const openAdd = () => {
    const defaultTS = db.teacherSubjects.find(ts => isTeacher ? ts.teacherId === myTeacher?.id : true);
    setForm({ title: "", type: "Assignment", maxScore: 10, date: new Date().toISOString().slice(0, 10), teacherSubjectId: defaultTS?.id || "", status: "draft" });
    setModal("add");
  };

  const save = () => {
    if (!form.title || !form.teacherSubjectId) { toast("Title and subject/class required.", "danger"); return; }
    const config = db.assessmentConfig.find(c => c.type === form.type);
    const maxScore = config?.maxScore || parseInt(form.maxScore) || 10;
    if (modal === "add") {
      setDb(d => ({ ...d, assessments: [...d.assessments, { ...form, id: generateId(d.assessments), maxScore, teacherSubjectId: parseInt(form.teacherSubjectId) }] }));
      toast("Assessment created!", "success");
    } else {
      setDb(d => ({ ...d, assessments: d.assessments.map(a => a.id === form.id ? { ...form, maxScore, teacherSubjectId: parseInt(form.teacherSubjectId) } : a) }));
      toast("Assessment updated!", "success");
    }
    setModal(null);
  };

  const submitAssessment = (a) => {
    setConfirm({ msg: `Submit assessment "${a.title}"? Scores will be locked for review.`, fn: () => { setDb(d => ({ ...d, assessments: d.assessments.map(x => x.id === a.id ? { ...x, status: "submitted" } : x) })); toast("Assessment submitted for review!"); setConfirm(null); } });
  };

  const getTS = (tsId) => { const ts = db.teacherSubjects.find(t => t.id === tsId); if (!ts) return "—"; const subj = db.subjects.find(s => s.id === ts.subjectId); const cls = db.classes.find(c => c.id === ts.classId); return `${subj?.name} · ${cls?.name}`; };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Assessment Management 📝</div><div className="section-desc">{assessments.length} assessments</div></div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Create Assessment</button>
      </div>

      <div className="table-card">
        <div className="table-header"><span className="table-title">All Assessments</span></div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Title</th><th>Type</th><th>Subject · Class</th><th>Max Score</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {assessments.length === 0 ? <tr><td colSpan={7}><div className="empty-state"><div className="empty-icon">📝</div><div className="empty-title">No assessments yet</div><div className="empty-desc">Create your first assessment to get started</div></div></td></tr> :
                assessments.map(a => (
                  <tr key={a.id}>
                    <td><div className="td-name">{a.title}</div></td>
                    <td><span className="badge badge-info">{a.type}</span></td>
                    <td>{getTS(a.teacherSubjectId)}</td>
                    <td><strong>{a.maxScore}</strong></td>
                    <td>{formatDate(a.date)}</td>
                    <td><span className={`badge ${a.status === "submitted" ? "badge-success" : "badge-warning"}`}>{a.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {a.status === "draft" && <><button className="btn btn-outline btn-sm" onClick={() => { setForm({ ...a }); setModal("edit"); }}>✏️</button><button className="btn btn-success btn-sm" onClick={() => submitAssessment(a)}>Submit</button></>}
                        {a.status === "submitted" && <span className="badge badge-success">✅ Submitted</span>}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Create Assessment" : "Edit Assessment"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save}>💾 Save</button></>}>
          <div className="form-grid">
            <div className="form-group full-width"><label>Assessment Title *</label><input className="form-control" placeholder="e.g. First Assignment" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="form-group"><label>Type</label>
              <select className="form-control" value={form.type || "Assignment"} onChange={e => { const config = db.assessmentConfig.find(c => c.type === e.target.value); setForm(f => ({ ...f, type: e.target.value, maxScore: config?.maxScore || f.maxScore })); }}>
                {types.map(t => <option key={t}>{t}</option>)}
                <option>Quiz</option><option>Project</option><option>Practical</option><option>Oral Test</option>
              </select>
            </div>
            <div className="form-group"><label>Max Score</label><input className="form-control" type="number" value={form.maxScore || ""} onChange={e => setForm(f => ({ ...f, maxScore: parseInt(e.target.value) }))} /></div>
            <div className="form-group full-width"><label>Subject & Class *</label>
              <select className="form-control" value={form.teacherSubjectId || ""} onChange={e => setForm(f => ({ ...f, teacherSubjectId: e.target.value }))}>
                <option value="">Select Subject & Class</option>
                {db.teacherSubjects.filter(ts => isTeacher ? ts.teacherId === myTeacher?.id : true).map(ts => { const subj = db.subjects.find(s => s.id === ts.subjectId); const cls = db.classes.find(c => c.id === ts.classId); return <option key={ts.id} value={ts.id}>{subj?.name} – {cls?.name}</option>; })}
              </select>
            </div>
            <div className="form-group"><label>Date</label><input className="form-control" type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
      {confirm && <Confirm message={confirm.msg} onConfirm={confirm.fn} onCancel={() => setConfirm(null)} />}
    </div>
  );
};

// ============================================================
// SCORE ENTRY PAGE
// ============================================================
const ScoresPage = ({ user, db, setDb }) => {
  const [selAssessment, setSelAssessment] = useState("");
  const [draftScores, setDraftScores] = useState({});
  const [saved, setSaved] = useState(false);

  const isTeacher = user.role === "teacher";
  const myTeacher = isTeacher ? db.teachers.find(t => t.userId === user.id) : null;
  const myTSIds = myTeacher ? db.teacherSubjects.filter(ts => ts.teacherId === myTeacher.id).map(ts => ts.id) : db.teacherSubjects.map(ts => ts.id);
  const myAssessments = db.assessments.filter(a => myTSIds.includes(a.teacherSubjectId));

  const assessment = myAssessments.find(a => a.id === parseInt(selAssessment));
  const ts = assessment ? db.teacherSubjects.find(t => t.id === assessment.teacherSubjectId) : null;
  const classStudents = ts ? db.students.filter(s => s.classId === ts.classId && s.status === "active") : [];

  const getExistingScore = (studentId) => db.scores.find(s => s.assessmentId === parseInt(selAssessment) && s.studentId === studentId)?.score ?? "";

  useEffect(() => {
    if (assessment) {
      const init = {};
      classStudents.forEach(s => { init[s.id] = getExistingScore(s.id); });
      setDraftScores(init);
      setSaved(false);
    }
  }, [selAssessment]);

  const handleScoreChange = (studentId, val) => {
    const num = val === "" ? "" : Math.min(parseInt(val) || 0, assessment?.maxScore || 100);
    setDraftScores(d => ({ ...d, [studentId]: num }));
    setSaved(false);
  };

  const saveScores = () => {
    if (!assessment) return;
    setDb(d => {
      let scores = [...d.scores];
      Object.entries(draftScores).forEach(([sid, score]) => {
        if (score === "" || score === undefined) return;
        const idx = scores.findIndex(s => s.assessmentId === assessment.id && s.studentId === parseInt(sid));
        if (idx >= 0) { scores[idx] = { ...scores[idx], score: parseInt(score) }; }
        else { scores.push({ id: generateId(scores), assessmentId: assessment.id, studentId: parseInt(sid), score: parseInt(score), status: "draft" }); }
      });
      return { ...d, scores };
    });
    setSaved(true);
    toast("Scores saved successfully!", "success");
  };

  const subj = ts ? db.subjects.find(s => s.id === ts.subjectId) : null;
  const cls = ts ? db.classes.find(c => c.id === ts.classId) : null;

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Score Entry 🎯</div><div className="section-desc">Enter and manage student scores</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="form-group" style={{ maxWidth: 400 }}>
            <label>Select Assessment</label>
            <select className="form-control" value={selAssessment} onChange={e => setSelAssessment(e.target.value)}>
              <option value="">-- Choose an assessment --</option>
              {myAssessments.map(a => { const its = db.teacherSubjects.find(t => t.id === a.teacherSubjectId); const subj = db.subjects.find(s => s.id === its?.subjectId); const cls = db.classes.find(c => c.id === its?.classId); return <option key={a.id} value={a.id}>{a.title} · {subj?.name} · {cls?.name}</option>; })}
            </select>
          </div>
        </div>
      </div>

      {!selAssessment && <div className="empty-state"><div className="empty-icon">🎯</div><div className="empty-title">Select an assessment</div><div className="empty-desc">Choose an assessment above to start entering scores</div></div>}

      {assessment && (
        <div className="table-card">
          <div className="table-header">
            <div>
              <div className="table-title">{assessment.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>{subj?.name} · {cls?.name} · Max Score: <strong>{assessment.maxScore}</strong></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {saved && <span className="badge badge-success">✅ Saved</span>}
              <button className="btn btn-primary" onClick={saveScores} disabled={assessment.status === "submitted"}>💾 Save Scores</button>
            </div>
          </div>
          {assessment.status === "submitted" && <div className="alert alert-info" style={{ margin: "0 16px" }}>ℹ️ This assessment has been submitted and scores are locked.</div>}
          <div className="table-scroll">
            <table>
              <thead><tr><th>#</th><th>Adm. No.</th><th>Student Name</th><th style={{ textAlign: "center" }}>Score (/{assessment.maxScore})</th><th style={{ textAlign: "center" }}>Percentage</th><th style={{ textAlign: "center" }}>Grade</th></tr></thead>
              <tbody>
                {classStudents.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">No students in this class</div></div></td></tr> :
                  classStudents.map((s, i) => {
                    const score = draftScores[s.id];
                    const pct = score !== "" && score !== undefined ? Math.round((parseInt(score) / assessment.maxScore) * 100) : null;
                    const gradeInfo = pct !== null ? getGrade(pct, db.gradingSystem) : null;
                    const isOver = score !== "" && parseInt(score) > assessment.maxScore;
                    return (<tr key={s.id}>
                      <td style={{ color: COLORS.textLight, fontSize: 12 }}>{i + 1}</td>
                      <td><span className="tag">{s.admNo}</span></td>
                      <td><div className="td-name">{s.name}</div></td>
                      <td style={{ textAlign: "center" }}>
                        <input className={`score-input ${isOver ? "over-max" : ""}`} type="number" min={0} max={assessment.maxScore} value={score} onChange={e => handleScoreChange(s.id, e.target.value)} disabled={assessment.status === "submitted"} />
                        {isOver && <div style={{ fontSize: 10, color: COLORS.danger }}>Exceeds max!</div>}
                      </td>
                      <td style={{ textAlign: "center" }}>{pct !== null ? `${pct}%` : "—"}</td>
                      <td style={{ textAlign: "center" }}>{gradeInfo ? <span className={`badge grade-${gradeInfo.grade}`}>{gradeInfo.grade}</span> : "—"}</td>
                    </tr>);
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// RESULTS PAGE
// ============================================================
const ResultsPage = ({ user, db }) => {
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [selStudent, setSelStudent] = useState(null);

  const isStudentOrParent = user.role === "student" || user.role === "parent";
  const myStudent = isStudentOrParent ? db.students.find(s => s.userId === user.id || (user.role === "parent" && s.id === user.studentId)) : null;

  const getStudentResult = (student) => {
    const myClass = student.classId;
    const classTS = db.teacherSubjects.filter(ts => ts.classId === myClass);
    return classTS.map(ts => {
      const subj = db.subjects.find(s => s.id === ts.subjectId);
      const assessmentIds = db.assessments.filter(a => a.teacherSubjectId === ts.id && a.status === "submitted").map(a => a.id);
      const studentScores = db.scores.filter(s => assessmentIds.includes(s.assessmentId) && s.studentId === student.id);
      const totalScore = studentScores.reduce((sum, s) => sum + s.score, 0);
      const maxPossible = db.assessments.filter(a => assessmentIds.includes(a.id)).reduce((sum, a) => sum + a.maxScore, 0);
      const percent = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
      const gradeInfo = getGrade(percent, db.gradingSystem);
      return { ts, subj, totalScore, maxPossible, percent, grade: gradeInfo.grade, remark: gradeInfo.remark };
    }).filter(r => r.maxPossible > 0);
  };

  if (isStudentOrParent && myStudent) {
    const results = getStudentResult(myStudent);
    const avg = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percent, 0) / results.length) : 0;
    return (
      <div>
        <div className="section-heading"><div><div className="section-title">My Results 📋</div><div className="section-desc">{myStudent.name}</div></div><span className="badge badge-info" style={{ fontSize: 14, padding: "6px 14px" }}>Average: {avg}%</span></div>
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead><tr><th>Subject</th><th style={{ textAlign: "center" }}>Score</th><th style={{ textAlign: "center" }}>Percentage</th><th style={{ textAlign: "center" }}>Grade</th><th>Remark</th></tr></thead>
              <tbody>
                {results.length === 0 ? <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No results available yet</div><div className="empty-desc">Results will appear once your teacher submits scores</div></div></td></tr> :
                  results.map(r => (<tr key={r.ts.id}><td><strong>{r.subj?.name}</strong></td><td style={{ textAlign: "center" }}>{r.totalScore}/{r.maxPossible}</td><td style={{ textAlign: "center" }}><strong>{r.percent}%</strong></td><td style={{ textAlign: "center" }}><span className={`badge grade-${r.grade}`}>{r.grade}</span></td><td>{r.remark}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const displayStudents = db.students.filter(s =>
    (!filterClass || s.classId === parseInt(filterClass)) && s.status === "active"
  );

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Results Management 📋</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="form-control" style={{ width: 140 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}><option value="">All Classes</option>{db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </div>
      </div>

      {selStudent ? (
        <div>
          <div style={{ marginBottom: 16 }}><button className="btn btn-outline" onClick={() => setSelStudent(null)}>← Back to List</button></div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-body">
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>{selStudent.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div><div style={{ fontSize: 18, fontWeight: 800 }}>{selStudent.name}</div><div style={{ color: COLORS.textLight, fontSize: 13 }}>{selStudent.admNo} · {db.classes.find(c => c.id === selStudent.classId)?.name}</div></div>
              </div>
            </div>
          </div>
          <div className="table-card">
            <div className="table-header"><span className="table-title">Subject Results</span></div>
            <div className="table-scroll">
              <table>
                <thead><tr><th>Subject</th><th>Assessment Breakdown</th><th style={{ textAlign: "center" }}>Total</th><th style={{ textAlign: "center" }}>%</th><th style={{ textAlign: "center" }}>Grade</th></tr></thead>
                <tbody>
                  {getStudentResult(selStudent).map(r => (
                    <tr key={r.ts.id}>
                      <td><strong>{r.subj?.name}</strong></td>
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {db.assessments.filter(a => a.teacherSubjectId === r.ts.id && a.status === "submitted").map(a => {
                            const sc = db.scores.find(s => s.assessmentId === a.id && s.studentId === selStudent.id);
                            return <span key={a.id} className="tag">{a.type}: {sc?.score ?? "—"}/{a.maxScore}</span>;
                          })}
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}><strong>{r.totalScore}/{r.maxPossible}</strong></td>
                      <td style={{ textAlign: "center" }}>{r.percent}%</td>
                      <td style={{ textAlign: "center" }}><span className={`badge grade-${r.grade}`}>{r.grade} – {r.remark}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-header"><span className="table-title">Student Results ({displayStudents.length})</span></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Class</th><th style={{ textAlign: "center" }}>Avg %</th><th style={{ textAlign: "center" }}>Grade</th><th>Actions</th></tr></thead>
              <tbody>
                {displayStudents.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No students found</div></div></td></tr> :
                  displayStudents.map((s, i) => {
                    const results = getStudentResult(s);
                    const avg = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percent, 0) / results.length) : 0;
                    const gradeInfo = avg > 0 ? getGrade(avg, db.gradingSystem) : { grade: "—", remark: "No data" };
                    return (<tr key={s.id}>
                      <td>{i + 1}</td>
                      <td><div className="td-name">{s.name}</div><div className="td-sub">{s.admNo}</div></td>
                      <td>{db.classes.find(c => c.id === s.classId)?.name}</td>
                      <td style={{ textAlign: "center" }}><strong>{avg > 0 ? `${avg}%` : "—"}</strong></td>
                      <td style={{ textAlign: "center" }}>{avg > 0 ? <span className={`badge grade-${gradeInfo.grade}`}>{gradeInfo.grade}</span> : "—"}</td>
                      <td><button className="btn btn-outline btn-sm" onClick={() => setSelStudent(s)}>View Details</button></td>
                    </tr>);
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ATTENDANCE PAGE
// ============================================================
const AttendancePage = ({ user, db, setDb }) => {
  const [selClass, setSelClass] = useState(db.classes[0]?.id || "");
  const [selDate, setSelDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceState, setAttendanceState] = useState({});
  const [saved, setSaved] = useState(false);

  const isTeacher = user.role === "teacher";
  const isStudentOrParent = user.role === "student" || user.role === "parent";
  const myStudent = isStudentOrParent ? db.students.find(s => s.userId === user.id || (user.role === "parent" && s.id === user.studentId)) : null;

  const classStudents = db.students.filter(s => s.classId === parseInt(selClass) && s.status === "active");

  useEffect(() => {
    const dayAttendance = db.attendance.filter(a => a.date === selDate && a.classId === parseInt(selClass));
    const init = {};
    classStudents.forEach(s => { const rec = dayAttendance.find(a => a.studentId === s.id); init[s.id] = rec?.status || "present"; });
    setAttendanceState(init);
    setSaved(false);
  }, [selDate, selClass, db.attendance]);

  const saveAttendance = () => {
    setDb(d => {
      let att = d.attendance.filter(a => !(a.date === selDate && a.classId === parseInt(selClass)));
      Object.entries(attendanceState).forEach(([sid, status]) => {
        att.push({ id: generateId(att), studentId: parseInt(sid), classId: parseInt(selClass), sessionId: 1, termId: 1, date: selDate, status });
      });
      return { ...d, attendance: att };
    });
    setSaved(true);
    toast("Attendance saved!", "success");
  };

  const statusColors = { present: "badge-success", absent: "badge-danger", late: "badge-warning", excused: "badge-info" };

  if (isStudentOrParent && myStudent) {
    const myAtt = db.attendance.filter(a => a.studentId === myStudent.id);
    const present = myAtt.filter(a => a.status === "present").length;
    const absent = myAtt.filter(a => a.status === "absent").length;
    const late = myAtt.filter(a => a.status === "late").length;
    const pct = myAtt.length > 0 ? Math.round((present / myAtt.length) * 100) : 0;
    return (
      <div>
        <div className="section-heading"><div><div className="section-title">My Attendance ✅</div><div className="section-desc">{myStudent.name}</div></div></div>
        <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["Total Days", myAtt.length, "#DBEAFE"], ["Present", present, "#D1FAE5"], ["Absent", absent, "#FEE2E2"], ["Attendance %", `${pct}%`, "#FEF3C7"]].map(([l, v, bg]) => (
            <div key={l} className="stat-card"><div className="stat-icon" style={{ background: bg }}>📅</div><div><div className="stat-label">{l}</div><div className="stat-value" style={{ fontSize: 22 }}>{v}</div></div></div>
          ))}
        </div>
        <div className="table-card" style={{ marginTop: 16 }}>
          <div className="table-header"><span className="table-title">Attendance Record</span></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Date</th><th>Status</th></tr></thead>
              <tbody>{myAtt.map(a => <tr key={a.id}><td>{formatDate(a.date)}</td><td><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Attendance Management ✅</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="form-control" value={selClass} onChange={e => setSelClass(e.target.value)}>{db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <input className="form-control" type="date" value={selDate} onChange={e => setSelDate(e.target.value)} />
          <button className="btn btn-primary" onClick={saveAttendance} disabled={saved}>💾 {saved ? "Saved" : "Save"}</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div><div className="table-title">Class Attendance – {db.classes.find(c => c.id === parseInt(selClass))?.name}</div><div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>{formatDate(selDate)}</div></div>
          <div style={{ display: "flex", gap: 6 }}>
            {["present", "absent", "late"].map(st => (
              <button key={st} className="btn btn-outline btn-sm" onClick={() => { const all = {}; classStudents.forEach(s => { all[s.id] = st; }); setAttendanceState(all); setSaved(false); }}>All {st.charAt(0).toUpperCase() + st.slice(1)}</button>
            ))}
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>#</th><th>Student</th><th style={{ textAlign: "center" }}>Present</th><th style={{ textAlign: "center" }}>Absent</th><th style={{ textAlign: "center" }}>Late</th><th style={{ textAlign: "center" }}>Excused</th></tr></thead>
            <tbody>
              {classStudents.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">✅</div><div className="empty-title">No students in this class</div></div></td></tr> :
                classStudents.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td><div className="td-name">{s.name}</div><div className="td-sub">{s.admNo}</div></td>
                    {["present", "absent", "late", "excused"].map(st => (
                      <td key={st} style={{ textAlign: "center" }}>
                        <input type="radio" name={`att-${s.id}`} value={st} checked={attendanceState[s.id] === st} onChange={() => { setAttendanceState(d => ({ ...d, [s.id]: st })); setSaved(false); }} />
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #DDE3EE", display: "flex", gap: 16, fontSize: 13 }}>
          {["present", "absent", "late", "excused"].map(st => {
            const count = Object.values(attendanceState).filter(v => v === st).length;
            return <span key={st} className={`badge ${statusColors[st]}`}>{st.charAt(0).toUpperCase() + st.slice(1)}: {count}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REPORT CARDS PAGE
// ============================================================
const ReportCardsPage = ({ user, db }) => {
  const [selStudent, setSelStudent] = useState(null);
  const [filterClass, setFilterClass] = useState("");
  const [printMode, setPrintMode] = useState(false);

  const isStudentOrParent = user.role === "student" || user.role === "parent";
  const myStudent = isStudentOrParent ? db.students.find(s => s.userId === user.id || (user.role === "parent" && s.id === user.studentId)) : null;

  const currentSession = db.academicSessions.find(s => s.isCurrent);
  const currentTerm = db.terms.find(t => t.isCurrent);

  const buildReport = (student) => {
    const cls = db.classes.find(c => c.id === student.classId);
    const classTS = db.teacherSubjects.filter(ts => ts.classId === student.classId);
    const subjectResults = classTS.map(ts => {
      const subj = db.subjects.find(s => s.id === ts.subjectId);
      const assessments = db.assessments.filter(a => a.teacherSubjectId === ts.id && a.status === "submitted");
      const breakdown = assessments.map(a => { const sc = db.scores.find(s => s.assessmentId === a.id && s.studentId === student.id); return { type: a.type, score: sc?.score ?? 0, max: a.maxScore }; });
      const totalScore = breakdown.reduce((sum, b) => sum + b.score, 0);
      const maxPossible = breakdown.reduce((sum, b) => sum + b.max, 0);
      const percent = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
      const gradeInfo = getGrade(percent, db.gradingSystem);
      return { subj, breakdown, totalScore, maxPossible, percent, grade: gradeInfo.grade, remark: gradeInfo.remark };
    }).filter(r => r.maxPossible > 0);

    const avg = subjectResults.length > 0 ? Math.round(subjectResults.reduce((sum, r) => sum + r.percent, 0) / subjectResults.length) : 0;
    const overallGrade = getGrade(avg, db.gradingSystem);

    const myAtt = db.attendance.filter(a => a.studentId === student.id);
    const presentDays = myAtt.filter(a => a.status === "present").length;
    const attPct = myAtt.length > 0 ? Math.round((presentDays / myAtt.length) * 100) : 0;

    const classStudents = db.students.filter(s => s.classId === student.classId && s.status === "active");
    const rankings = classStudents.map(cs => {
      const res = db.teacherSubjects.filter(ts => ts.classId === cs.classId).map(ts => {
        const assessmentIds = db.assessments.filter(a => a.teacherSubjectId === ts.id && a.status === "submitted").map(a => a.id);
        const scores = db.scores.filter(s => assessmentIds.includes(s.assessmentId) && s.studentId === cs.id);
        const total = scores.reduce((sum, s) => sum + s.score, 0);
        const maxP = db.assessments.filter(a => assessmentIds.includes(a.id)).reduce((sum, a) => sum + a.maxScore, 0);
        return maxP > 0 ? (total / maxP) * 100 : 0;
      });
      const studentAvg = res.length > 0 ? res.reduce((a, b) => a + b, 0) / res.length : 0;
      return { id: cs.id, avg: studentAvg };
    }).sort((a, b) => b.avg - a.avg);
    const position = rankings.findIndex(r => r.id === student.id) + 1;

    return { student, cls, subjectResults, avg, overallGrade, attPct, presentDays, totalDays: myAtt.length, position, classSize: classStudents.length };
  };

  const Report = ({ report }) => {
    const { student, cls, subjectResults, avg, overallGrade, attPct, presentDays, totalDays, position, classSize } = report;
    const configTypes = db.assessmentConfig.map(c => c.type);
    return (
      <div className="report-card">
        <div className="report-card-header">
          <div className="report-school-logo">🏫</div>
          <div style={{ flex: 1 }}>
            <div className="report-school-name">Government Secondary School</div>
            <div className="report-school-addr">P.M.B. 001, Damaturu, Yobe State, Nigeria</div>
            <div className="report-school-addr">Tel: 08012345678 | Email: gss@yobe.edu.ng</div>
          </div>
        </div>
        <div className="report-card-title">Student Academic Report Card</div>
        <div className="report-info-grid">
          <div className="report-info-item"><label>Student Name</label><p>{student.name}</p></div>
          <div className="report-info-item"><label>Adm. Number</label><p>{student.admNo}</p></div>
          <div className="report-info-item"><label>Class</label><p>{cls?.name}</p></div>
          <div className="report-info-item"><label>Academic Session</label><p>{currentSession?.name}</p></div>
          <div className="report-info-item"><label>Term</label><p>{currentTerm?.name}</p></div>
          <div className="report-info-item"><label>Gender</label><p>{student.gender}</p></div>
        </div>
        <table className="report-table">
          <thead>
            <tr>
              <th rowSpan={2} style={{ textAlign: "left", paddingLeft: 8 }}>Subject</th>
              {configTypes.map(t => <th key={t}>{t}</th>)}
              <th>Total</th><th>%</th><th>Grade</th><th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjectResults.map(r => (
              <tr key={r.subj?.id}>
                <td style={{ textAlign: "left", paddingLeft: 8 }}>{r.subj?.name}</td>
                {configTypes.map(t => { const b = r.breakdown.find(x => x.type === t); return <td key={t}>{b ? `${b.score}/${b.max}` : "—"}</td>; })}
                <td><strong>{r.totalScore}/{r.maxPossible}</strong></td>
                <td><strong>{r.percent}%</strong></td>
                <td><strong>{r.grade}</strong></td>
                <td style={{ textAlign: "left" }}>{r.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="report-summary">
          <div className="report-summary-item"><label>Average</label><p>{avg}%</p></div>
          <div className="report-summary-item"><label>Grade</label><p>{overallGrade.grade}</p></div>
          <div className="report-summary-item"><label>Position</label><p>{position}/{classSize}</p></div>
          <div className="report-summary-item"><label>Attendance</label><p>{attPct}%</p></div>
        </div>
        <div className="report-comments">
          <div className="report-comment-box"><div className="report-comment-label">Class Teacher's Remark</div><p style={{ fontSize: 12 }}>{avg >= 70 ? "Excellent performance! Keep it up." : avg >= 50 ? "Good effort. Continue working hard." : "Needs improvement. Please study harder."}</p></div>
          <div className="report-comment-box"><div className="report-comment-label">Principal's Remark</div><p style={{ fontSize: 12 }}>{avg >= 60 ? "Well done. You are an asset to this school." : "Work harder and you will achieve great results."}</p></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, borderTop: "1px solid #DDE3EE", paddingTop: 12 }}>
          <div style={{ textAlign: "center" }}><div style={{ borderTop: "1px solid #333", width: 140, marginBottom: 4 }} /><div style={{ fontSize: 11 }}>Class Teacher's Signature</div></div>
          <div style={{ textAlign: "center" }}><div style={{ borderTop: "1px solid #333", width: 140, marginBottom: 4 }} /><div style={{ fontSize: 11 }}>Principal's Signature</div></div>
          <div style={{ textAlign: "center" }}><div style={{ borderTop: "1px solid #333", width: 140, marginBottom: 4 }} /><div style={{ fontSize: 11 }}>School Stamp</div></div>
        </div>
      </div>
    );
  };

  if (isStudentOrParent && myStudent) {
    const report = buildReport(myStudent);
    return (
      <div>
        <div className="section-heading">
          <div><div className="section-title">My Report Card 📄</div></div>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print</button>
        </div>
        <Report report={report} />
      </div>
    );
  }

  const displayStudents = db.students.filter(s => (!filterClass || s.classId === parseInt(filterClass)) && s.status === "active");

  if (selStudent) {
    const report = buildReport(selStudent);
    return (
      <div>
        <div className="section-heading">
          <div><div className="section-title">Report Card: {selStudent.name}</div></div>
          <div style={{ display: "flex", gap: 8 }}><button className="btn btn-outline" onClick={() => setSelStudent(null)}>← Back</button><button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print</button></div>
        </div>
        <Report report={report} />
      </div>
    );
  }

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Report Cards 📄</div><div className="section-desc">Generate and print student report cards</div></div>
        <select className="form-control" style={{ width: 150 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}><option value="">All Classes</option>{db.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </div>
      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead><tr><th>#</th><th>Student</th><th>Class</th><th>Adm. No.</th><th>Actions</th></tr></thead>
            <tbody>
              {displayStudents.map((s, i) => <tr key={s.id}><td>{i + 1}</td><td><div className="td-name">{s.name}</div></td><td>{db.classes.find(c => c.id === s.classId)?.name}</td><td>{s.admNo}</td><td><button className="btn btn-primary btn-sm" onClick={() => setSelStudent(s)}>📄 View Report Card</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// GRADING SYSTEM PAGE
// ============================================================
const GradingPage = ({ user, db, setDb }) => {
  const [form, setForm] = useState([...db.gradingSystem]);
  const canEdit = ["superadmin", "admin"].includes(user.role);

  const save = () => {
    setDb(d => ({ ...d, gradingSystem: form }));
    toast("Grading system updated!", "success");
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Grading System ⭐</div><div className="section-desc">Configure score-to-grade mapping</div></div>
        {canEdit && <button className="btn btn-primary" onClick={save}>💾 Save Changes</button>}
      </div>
      <div className="grid-2">
        <div className="table-card">
          <div className="table-header"><span className="table-title">Grade Configuration</span></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Min Score</th><th>Max Score</th><th>Grade</th><th>Remark</th></tr></thead>
              <tbody>
                {form.map((g, i) => (
                  <tr key={g.id}>
                    <td><input className="form-control" type="number" value={g.minScore} onChange={e => { const f = [...form]; f[i] = { ...f[i], minScore: parseInt(e.target.value) }; setForm(f); }} disabled={!canEdit} /></td>
                    <td><input className="form-control" type="number" value={g.maxScore} onChange={e => { const f = [...form]; f[i] = { ...f[i], maxScore: parseInt(e.target.value) }; setForm(f); }} disabled={!canEdit} /></td>
                    <td><span className={`badge grade-${g.grade}`} style={{ fontSize: 16, padding: "4px 12px" }}>{g.grade}</span></td>
                    <td><input className="form-control" value={g.remark} onChange={e => { const f = [...form]; f[i] = { ...f[i], remark: e.target.value }; setForm(f); }} disabled={!canEdit} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="card-title">Assessment Weight Configuration</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {db.assessmentConfig.map(c => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: COLORS.bg, borderRadius: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.type}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: COLORS.textLight }}>Max: {c.maxScore}</span>
                    <span className="badge badge-info">{c.weight}%</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 14px", background: COLORS.primary + "15", border: `1px solid ${COLORS.primary}30`, borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                <strong>Total</strong>
                <strong>{db.assessmentConfig.reduce((s, c) => s + c.weight, 0)}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ANALYTICS PAGE
// ============================================================
const AnalyticsPage = ({ user, db }) => {
  const gradeColors = { A: "#2ECC71", B: "#3498DB", C: "#F39C12", D: "#E67E22", E: "#95A5A6", F: "#E74C3C" };

  const studentPerformance = db.students.filter(s => s.status === "active").map(s => {
    const classTS = db.teacherSubjects.filter(ts => ts.classId === s.classId);
    const results = classTS.map(ts => {
      const assessmentIds = db.assessments.filter(a => a.teacherSubjectId === ts.id && a.status === "submitted").map(a => a.id);
      const scores = db.scores.filter(sc => assessmentIds.includes(sc.assessmentId) && sc.studentId === s.id);
      const total = scores.reduce((sum, sc) => sum + sc.score, 0);
      const maxP = db.assessments.filter(a => assessmentIds.includes(a.id)).reduce((sum, a) => sum + a.maxScore, 0);
      return maxP > 0 ? (total / maxP) * 100 : 0;
    }).filter(v => v > 0);
    const avg = results.length > 0 ? results.reduce((a, b) => a + b, 0) / results.length : 0;
    return { ...s, avg: Math.round(avg) };
  }).filter(s => s.avg > 0).sort((a, b) => b.avg - a.avg);

  const gradeDistribution = {};
  studentPerformance.forEach(s => { const g = getGrade(s.avg, db.gradingSystem).grade; gradeDistribution[g] = (gradeDistribution[g] || 0) + 1; });

  const subjectPerformance = db.subjects.map(subj => {
    const allTS = db.teacherSubjects.filter(ts => ts.subjectId === subj.id);
    const avgs = [];
    db.students.forEach(s => {
      allTS.forEach(ts => {
        if (ts.classId !== s.classId) return;
        const assessmentIds = db.assessments.filter(a => a.teacherSubjectId === ts.id && a.status === "submitted").map(a => a.id);
        const scores = db.scores.filter(sc => assessmentIds.includes(sc.assessmentId) && sc.studentId === s.id);
        const total = scores.reduce((sum, sc) => sum + sc.score, 0);
        const maxP = db.assessments.filter(a => assessmentIds.includes(a.id)).reduce((sum, a) => sum + a.maxScore, 0);
        if (maxP > 0) avgs.push((total / maxP) * 100);
      });
    });
    const avg = avgs.length > 0 ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : 0;
    return { ...subj, avg };
  }).filter(s => s.avg > 0).sort((a, b) => b.avg - a.avg);

  const barColors = [COLORS.primary, COLORS.success, COLORS.accent, COLORS.warning, COLORS.info, COLORS.danger];

  return (
    <div>
      <div className="section-heading"><div><div className="section-title">Analytics & Reports 📈</div><div className="section-desc">School performance overview</div></div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-icon" style={{ background: "#DBEAFE" }}>📊</div><div><div className="stat-label">School Average</div><div className="stat-value">{studentPerformance.length > 0 ? Math.round(studentPerformance.reduce((s, x) => s + x.avg, 0) / studentPerformance.length) : 0}%</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#D1FAE5" }}>🏆</div><div><div className="stat-label">Top Student</div><div className="stat-value" style={{ fontSize: 16 }}>{studentPerformance[0]?.name.split(" ")[0] || "—"}</div><div className="stat-sub">{studentPerformance[0]?.avg}%</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#FEF3C7" }}>📚</div><div><div className="stat-label">Best Subject</div><div className="stat-value" style={{ fontSize: 16 }}>{subjectPerformance[0]?.name || "—"}</div><div className="stat-sub">{subjectPerformance[0]?.avg}%</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: "#EDE9FE" }}>🎓</div><div><div className="stat-label">A Grade Students</div><div className="stat-value">{gradeDistribution["A"] || 0}</div></div></div>
      </div>
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card"><div className="card-body">
          <div className="card-title">📊 Top 5 Students</div>
          <div className="chart-bar-wrap">
            {studentPerformance.slice(0, 5).map((s, i) => (
              <div key={s.id} className="chart-bar-row">
                <div className="chart-bar-label" style={{ fontSize: 11 }}>{s.name.split(" ")[0]}</div>
                <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${s.avg}%`, background: barColors[i % barColors.length] }} /></div>
                <div className="chart-bar-value">{s.avg}%</div>
              </div>
            ))}
          </div>
        </div></div>
        <div className="card"><div className="card-body">
          <div className="card-title">📚 Subject Performance</div>
          <div className="chart-bar-wrap">
            {subjectPerformance.map((s, i) => (
              <div key={s.id} className="chart-bar-row">
                <div className="chart-bar-label" style={{ fontSize: 11 }}>{s.code}</div>
                <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${s.avg}%`, background: barColors[i % barColors.length] }} /></div>
                <div className="chart-bar-value">{s.avg}%</div>
              </div>
            ))}
          </div>
        </div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-body">
          <div className="card-title">🎓 Grade Distribution</div>
          {["A", "B", "C", "D", "E", "F"].map(g => {
            const count = gradeDistribution[g] || 0;
            const pct = studentPerformance.length > 0 ? (count / studentPerformance.length) * 100 : 0;
            return (<div key={g} className="chart-bar-row">
              <div style={{ width: 28, textAlign: "center" }}><span className={`badge grade-${g}`}>{g}</span></div>
              <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${pct}%`, background: gradeColors[g] }} /></div>
              <div className="chart-bar-value">{count}</div>
            </div>);
          })}
        </div></div>
        <div className="card"><div className="card-body">
          <div className="card-title">⚠️ Students Needing Support</div>
          {studentPerformance.filter(s => s.avg < 50).length === 0 ? <div className="empty-state" style={{ padding: "24px" }}><div className="empty-icon">🎉</div><div className="empty-title">No students below 50%</div></div> :
            studentPerformance.filter(s => s.avg < 50).map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #F0F4F8" }}>
                <div><div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div><div style={{ fontSize: 11, color: COLORS.textLight }}>{db.classes.find(c => c.id === s.classId)?.name}</div></div>
                <span className="badge badge-danger">{s.avg}%</span>
              </div>
            ))}
        </div></div>
      </div>
    </div>
  );
};

// ============================================================
// SESSIONS PAGE
// ============================================================
const SessionsPage = ({ user, db, setDb }) => {
  const canEdit = ["superadmin", "admin"].includes(user.role);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const save = () => {
    if (!form.name) { toast("Session name required.", "danger"); return; }
    if (modal === "session") {
      setDb(d => ({ ...d, academicSessions: [...d.academicSessions, { ...form, id: generateId(d.academicSessions), isCurrent: false }] }));
    } else {
      setDb(d => ({ ...d, terms: [...d.terms, { ...form, id: generateId(d.terms), sessionId: parseInt(form.sessionId), isCurrent: false }] }));
    }
    toast("Saved!", "success"); setModal(null);
  };

  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Academic Sessions 📅</div></div>
        {canEdit && <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={() => { setForm({ name: "", startDate: "", endDate: "", sessionId: db.academicSessions[0]?.id || 1 }); setModal("term"); }}>➕ Add Term</button>
          <button className="btn btn-primary" onClick={() => { setForm({ name: "", startDate: "", endDate: "" }); setModal("session"); }}>➕ Add Session</button>
        </div>}
      </div>
      {db.academicSessions.map(sess => (
        <div key={sess.id} className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{sess.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textLight }}>{formatDate(sess.startDate)} – {formatDate(sess.endDate)}</div>
              </div>
              {sess.isCurrent && <span className="badge badge-success">Current Session</span>}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {db.terms.filter(t => t.sessionId === sess.id).map(term => (
                <div key={term.id} style={{ background: COLORS.bg, borderRadius: 10, padding: "10px 16px", border: term.isCurrent ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{term.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight }}>{formatDate(term.startDate)} – {formatDate(term.endDate)}</div>
                  {term.isCurrent && <span className="badge badge-info" style={{ marginTop: 4 }}>Current Term</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {modal && (
        <Modal title={modal === "session" ? "Add Academic Session" : "Add Term"} onClose={() => setModal(null)}
          footer={<><button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={save}>💾 Save</button></>}>
          <div className="form-grid">
            {modal === "term" && <div className="form-group full-width"><label>Academic Session</label><select className="form-control" value={form.sessionId || ""} onChange={e => setForm(f => ({ ...f, sessionId: e.target.value }))}>{db.academicSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
            <div className="form-group full-width"><label>Name *</label><input className="form-control" placeholder={modal === "session" ? "e.g. 2025/2026" : "e.g. First Term"} value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Start Date</label><input className="form-control" type="date" value={form.startDate || ""} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="form-group"><label>End Date</label><input className="form-control" type="date" value={form.endDate || ""} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// USER APPROVALS PAGE
// ============================================================
const ApprovalsPage = ({ db, setDb }) => {
  const [filter, setFilter] = useState("pending");

  const allSignups = db.users.filter(u => !["superadmin"].includes(u.role));
  const displayed = allSignups.filter(u => filter === "all" ? true : u.status === filter);

  const approveUser = (u) => {
    setDb(prev => ({ ...prev, users: prev.users.map(x => x.id === u.id ? { ...x, status: "active" } : x) }));
    toast(`✅ ${u.name} approved successfully!`, "success");
  };
  const rejectUser = (u) => {
    setDb(prev => ({ ...prev, users: prev.users.map(x => x.id === u.id ? { ...x, status: "inactive" } : x) }));
    toast(`${u.name}'s account rejected.`, "danger");
  };
  const reactivate = (u) => {
    setDb(prev => ({ ...prev, users: prev.users.map(x => x.id === u.id ? { ...x, status: "active" } : x) }));
    toast(`${u.name} reactivated.`, "success");
  };

  const statusBadge = (status) => {
    const map = { active: "badge-success", pending: "badge-warning", inactive: "badge-danger" };
    return <span className={`badge ${map[status] || "badge-gray"}`}>{status}</span>;
  };

  const roleBadge = (role) => {
    const map = { admin: "badge-info", teacher: "badge-success", student: "badge-warning", parent: "badge-purple" };
    return <span className={`badge ${map[role] || "badge-gray"}`} style={{ textTransform: "capitalize" }}>{role}</span>;
  };

  const counts = {
    all: allSignups.length,
    pending: allSignups.filter(u => u.status === "pending").length,
    active: allSignups.filter(u => u.status === "active").length,
    inactive: allSignups.filter(u => u.status === "inactive").length,
  };

  return (
    <div>
      <div className="section-heading">
        <div>
          <div className="section-title">User Approvals & Management ✅</div>
          <div className="section-desc">Approve, reject or manage all registered user accounts</div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {[["All Users", counts.all, "#DBEAFE", "all"], ["Pending", counts.pending, "#FEF3C7", "pending"], ["Active", counts.active, "#D1FAE5", "active"], ["Inactive", counts.inactive, "#FEE2E2", "inactive"]].map(([label, val, bg, key]) => (
          <div key={key} className="stat-card" style={{ cursor: "pointer", border: filter === key ? `2px solid ${COLORS.primary}` : "1px solid #DDE3EE" }} onClick={() => setFilter(key)}>
            <div className="stat-icon" style={{ background: bg }}>👤</div>
            <div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="table-title">
            {filter === "pending" && "⏳ "}
            {filter === "active" && "✅ "}
            {filter === "inactive" && "❌ "}
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Users ({displayed.length})
          </span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <div className="empty-title">No {filter} users</div>
                    <div className="empty-desc">No accounts match this filter</div>
                  </div>
                </td></tr>
              ) : displayed.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color: COLORS.textLight, fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="td-name">{u.name}</div>
                    </div>
                  </td>
                  <td><span className="tag">@{u.username}</span></td>
                  <td>{roleBadge(u.role)}</td>
                  <td style={{ fontSize: 12, color: COLORS.textLight }}>{u.email}</td>
                  <td>{statusBadge(u.status)}</td>
                  <td style={{ fontSize: 12, color: COLORS.textLight }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {u.status === "pending" && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => approveUser(u)}>✅ Approve</button>
                          <button className="btn btn-danger btn-sm" onClick={() => rejectUser(u)}>❌ Reject</button>
                        </>
                      )}
                      {u.status === "active" && (
                        <button className="btn btn-outline btn-sm" onClick={() => rejectUser(u)}>🚫 Deactivate</button>
                      )}
                      {u.status === "inactive" && (
                        <button className="btn btn-success btn-sm" onClick={() => reactivate(u)}>♻️ Reactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// AUDIT LOGS PAGE
// ============================================================
const AuditLogsPage = ({ db }) => {
  const [search, setSearch] = useState("");
  const filtered = db.auditLogs.filter(l => l.description.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const actionColors = { CREATE: "badge-success", UPDATE: "badge-info", DELETE: "badge-danger" };
  return (
    <div>
      <div className="section-heading">
        <div><div className="section-title">Audit Logs 🔍</div><div className="section-desc">{db.auditLogs.length} total events</div></div>
        <div className="search-wrap"><span className="search-icon">🔍</span><input className="search-input" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      </div>
      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Resource</th><th>Description</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">No logs found</div></div></td></tr> :
                filtered.map(log => {
                  const logUser = db.users.find(u => u.id === log.userId);
                  return (<tr key={log.id}>
                    <td style={{ fontSize: 12, color: COLORS.textLight, whiteSpace: "nowrap" }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td><div style={{ fontSize: 13, fontWeight: 600 }}>{logUser?.name || "Unknown"}</div><div style={{ fontSize: 11, color: COLORS.textLight }}>{logUser?.role}</div></td>
                    <td><span className={`badge ${actionColors[log.action] || "badge-gray"}`}>{log.action}</span></td>
                    <td><span className="tag">{log.resource}</span></td>
                    <td style={{ fontSize: 13 }}>{log.description}</td>
                  </tr>);
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [db, setDb] = useState(initialDB);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const pageTitles = { dashboard: "Dashboard", approvals: "User Approvals", students: "Students", teachers: "Teachers", classes: "Classes", subjects: "Subjects", sessions: "Academic Sessions", assessments: "Assessments", scores: "Score Entry", results: "Results", attendance: "Attendance", reportcards: "Report Cards", grading: "Grading System", analytics: "Analytics", auditlogs: "Audit Logs" };

  const handleLogout = () => { setUser(null); setCurrentPage("dashboard"); setSidebarOpen(false); };

  const handleNav = (page) => { setCurrentPage(page); setSidebarOpen(false); };

  if (!user) return (<><ToastContainer /><LoginPage onLogin={u => { setUser(u); setCurrentPage("dashboard"); }} db={db} setDb={setDb} /></>);

  const pageProps = { user, db, setDb };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <DashboardPage {...pageProps} />;
      case "approvals": return <ApprovalsPage db={db} setDb={setDb} />;
      case "students": return <StudentsPage {...pageProps} />;
      case "teachers": return <TeachersPage {...pageProps} />;
      case "classes": return <ClassesPage {...pageProps} />;
      case "subjects": return <SubjectsPage {...pageProps} />;
      case "sessions": return <SessionsPage {...pageProps} />;
      case "assessments": return <AssessmentsPage {...pageProps} />;
      case "scores": return <ScoresPage {...pageProps} />;
      case "results": return <ResultsPage {...pageProps} />;
      case "attendance": return <AttendancePage {...pageProps} />;
      case "reportcards": return <ReportCardsPage {...pageProps} />;
      case "grading": return <GradingPage {...pageProps} />;
      case "analytics": return <AnalyticsPage {...pageProps} />;
      case "auditlogs": return <AuditLogsPage {...pageProps} />;
      default: return <DashboardPage {...pageProps} />;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="app-root">
        <div className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />
        <Sidebar user={user} currentPage={currentPage} onNav={handleNav} isOpen={sidebarOpen} db={db} />
        <div className={`main-content ${sidebarOpen ? "" : ""}`}>
          <header className="topbar">
            <div className="topbar-left">
              <button className="menu-toggle" onClick={() => setSidebarOpen(o => !o)}>☰</button>
              <div>
                <div className="page-title">{pageTitles[currentPage] || "Page"}</div>
                <div className="breadcrumb">SBA Manager › {pageTitles[currentPage]}</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="topbar-badge">📅 {db.academicSessions.find(s => s.isCurrent)?.name}</div>
              <span className={`topbar-role-badge role-${user.role}`}>{user.role}</span>
              <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>
          </header>
          <main className="page-content">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
