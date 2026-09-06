// Rough "maybe ping this student" rules. Not official PSU policy — just demo thresholds
// an advisor could actually read. Tweak these in one place, not in the table markup.

export const GPA_THRESHOLD = 2.5;
export const ENGAGEMENT_THRESHOLD = 65;
export const ATTENDANCE_THRESHOLD = 70;

export function attentionReasons(student) {
  const reasons = [];
  const gpa = student?.academic?.cumulativeGpa;
  const engagement = student?.engagement?.engagementScore;
  const attendance = student?.engagement?.attendancePercent;
  const onTime = student?.engagement?.assignmentsOnTimePercent;

  if (typeof gpa === "number" && gpa < GPA_THRESHOLD) {
    reasons.push("Cumulative GPA is below 2.50");
  }
  if (typeof engagement === "number" && engagement < ENGAGEMENT_THRESHOLD) {
    reasons.push("Engagement score is below 65");
  }
  if (typeof attendance === "number" && attendance < ATTENDANCE_THRESHOLD) {
    reasons.push("Attendance is below 70%");
  }
  if (typeof onTime === "number" && onTime < 60) {
    reasons.push("On-time assignment rate is below 60%");
  }
  return reasons;
}

export function needsAttention(student) {
  return attentionReasons(student).length > 0;
}

export function metricTone(value, { warnBelow, goodAt } = {}) {
  if (typeof value !== "number") return "neutral";
  if (typeof warnBelow === "number" && value < warnBelow) return "warn";
  if (typeof goodAt === "number" && value >= goodAt) return "good";
  return "neutral";
}

export function compareStudents(a, b, key, direction) {
  const dir = direction === "desc" ? -1 : 1;
  const av = getSortValue(a, key);
  const bv = getSortValue(b, key);
  // Missing values go to the bottom. Nobody wants a blank GPA sitting at the top.
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
  return String(av).localeCompare(String(bv)) * dir;
}

function getSortValue(student, key) {
  switch (key) {
    case "name":
      return `${student.lastName ?? ""} ${student.firstName ?? ""}`.toLowerCase();
    case "program":
      return student.academic.program;
    case "campus":
      return student.academic.campus;
    case "gpa":
      return student.academic.cumulativeGpa;
    case "engagement":
      return student.engagement.engagementScore;
    case "attendance":
      return student.engagement.attendancePercent;
    default:
      return null;
  }
}

export function matchesQuery(student, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  // Dumb substring match on purpose. Advisors type "diaz" or an email prefix, not lucene.
  const haystack = [
    student.preferredName,
    student.firstName,
    student.lastName,
    student.email,
    student.studentId,
    student.academic.program,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
