// Not trying to snapshot the whole table. Just the bits that would be embarrassing if they broke.

import { describe, expect, it } from "vitest";
import { displayName, formatDate, formatGpa, formatPercent, formatValue, legalName } from "../utils/display";
import { attentionReasons, compareStudents, matchesQuery, needsAttention } from "../utils/attention";
import { normalizeRoster } from "../services/rosterApi";

const student = {
  studentId: "1",
  firstName: "Taylor",
  lastName: "Garcia",
  preferredName: null,
  email: "t@example.edu",
  academic: { program: "Economics", level: "First-Year", campus: "Behrend", cumulativeGpa: 2.2 },
  engagement: { engagementScore: 80, attendancePercent: 66, assignmentsOnTimePercent: 93 },
  advising: { notes: null },
};

describe("display helpers", () => {
  it("uses preferred name when present", () => {
    expect(displayName({ ...student, preferredName: "Tay" })).toBe("Tay Garcia");
  });

  it("falls back when preferred name is missing", () => {
    expect(displayName(student)).toBe("Taylor Garcia");
    expect(legalName(student)).toBe("Taylor Garcia");
  });

  it("labels missing values for advisors", () => {
    expect(formatValue(null)).toBe("Not available");
    expect(formatGpa(3.4)).toBe("3.40");
    expect(formatPercent(66)).toBe("66%");
    expect(formatDate("2026-08-14")).toMatch(/Aug/);
  });
});

describe("attention logic", () => {
  it("flags low GPA and low attendance", () => {
    expect(needsAttention(student)).toBe(true);
    expect(attentionReasons(student).join(" ")).toMatch(/GPA/);
  });

  it("filters by name and email", () => {
    expect(matchesQuery(student, "garcia")).toBe(true);
    expect(matchesQuery(student, "zzz")).toBe(false);
  });

  it("sorts missing values last", () => {
    // blank GPA should not win a "highest first" sort
    const a = { lastName: "A", firstName: "A", academic: {}, engagement: {} };
    const b = { lastName: "B", firstName: "B", academic: { cumulativeGpa: 3 }, engagement: {} };
    expect(compareStudents(a, b, "gpa", "desc")).toBe(1);
  });
});

describe("roster API mapping", () => {
  it("treats a backend payload as component-ready state", () => {
    const roster = normalizeRoster({
      term: "Fall 2026",
      rosterType: "Advisor",
      advisor: { name: "Sample Advisor" },
      students: [{ studentId: 9, firstName: "Avery", academic: { program: null } }],
    });
    expect(roster.advisorName).toBe("Sample Advisor");
    expect(roster.students[0].studentId).toBe("9");
    expect(roster.students[0].academic.program).toBeNull();
    expect(roster.students[0].advising.appointmentScheduled).toBe(false);
  });

  it("handles an empty payload", () => {
    expect(normalizeRoster(null).students).toEqual([]);
  });
});
