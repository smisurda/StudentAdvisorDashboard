// Pretend this JSON is sitting behind a real API. Vite serves it from /public.
const ROSTER_URL = "/data/learning_analytic_roster.json";

// Fake lag so the loading state actually shows. Local fetch is instant otherwise.
const SIMULATED_LATENCY_MS = 450;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchRoster({ signal } = {}) {
  await wait(SIMULATED_LATENCY_MS);
  const response = await fetch(ROSTER_URL, { signal });
  if (!response.ok) {
    throw new Error(`Unable to load roster (${response.status})`);
  }
  const payload = await response.json();
  return normalizeRoster(payload);
}

// Smash whatever the backend sent into a shape the UI can trust.
// Random nulls / missing blobs shouldn't leak into every component.
export function normalizeRoster(payload) {
  const students = Array.isArray(payload?.students) ? payload.students : [];
  return {
    generatedAt: payload?.generatedAt ?? null,
    term: payload?.term ?? "Unknown term",
    rosterType: payload?.rosterType ?? "Roster",
    advisorName: payload?.advisor?.name ?? "Advisor",
    students: students.map(normalizeStudent),
  };
}

export function normalizeStudent(raw) {
  const academic = raw?.academic ?? {};
  const engagement = raw?.engagement ?? {};
  const advising = raw?.advising ?? {};
  return {
    // Route params are strings. Keep IDs as strings so lookups don't get weird.
    firstName: raw?.firstName ?? null,
    lastName: raw?.lastName ?? null,
    preferredName: raw?.preferredName ?? null,
    email: raw?.email ?? null,
    academic: {
      program: academic.program ?? null,
      level: academic.level ?? null,
      campus: academic.campus ?? null,
      cumulativeGpa: toNumberOrNull(academic.cumulativeGpa),
      termGpa: toNumberOrNull(academic.termGpa),
      enrolledCredits: toNumberOrNull(academic.enrolledCredits),
      coursesEnrolled: toNumberOrNull(academic.coursesEnrolled),
    },
    engagement: {
      engagementScore: toNumberOrNull(engagement.engagementScore),
      attendancePercent: toNumberOrNull(engagement.attendancePercent),
      assignmentsOnTimePercent: toNumberOrNull(engagement.assignmentsOnTimePercent),
      canvasActivityLast7Days: toNumberOrNull(engagement.canvasActivityLast7Days),
      lastLogin: engagement.lastLogin ?? null,
    },
    advising: {
      lastAdvisorContact: advising.lastAdvisorContact ?? null,
      appointmentScheduled: Boolean(advising.appointmentScheduled),
      notes: advising.notes ?? null,
    },
  };
}

function toNumberOrNull(value) {
  // Don't coerce junk into 0 — advisors would think the GPA is actually zero.
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
