import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { fetchRoster } from "../services/rosterApi";
import { uniqueSorted } from "../utils/display";
import { matchesQuery, needsAttention, compareStudents } from "../utils/attention";

// One bag of roster state. Roster + profile both drink from this so we don't
// refetch (or lose filters) every time someone clicks a student.

export const useRosterStore = defineStore("roster", () => {
  const loading = ref(false);
  const error = ref(null);
  const term = ref("");
  const rosterType = ref("");
  const advisorName = ref("");
  const students = ref([]);
  const query = ref("");
  const campus = ref("all");
  const program = ref("all");
  const level = ref("all");
  const attentionOnly = ref(false);
  const sortKey = ref("name");
  const sortDir = ref("asc");

  const campuses = computed(() => uniqueSorted(students.value.map((s) => s.academic.campus)));
  const programs = computed(() => uniqueSorted(students.value.map((s) => s.academic.program)));
  const levels = computed(() => uniqueSorted(students.value.map((s) => s.academic.level)));

  const filteredStudents = computed(() => {
    const rows = students.value.filter((student) => {
      if (!matchesQuery(student, query.value)) return false;
      if (campus.value !== "all" && student.academic.campus !== campus.value) return false;
      if (program.value !== "all" && student.academic.program !== program.value) return false;
      if (level.value !== "all" && student.academic.level !== level.value) return false;
      if (attentionOnly.value && !needsAttention(student)) return false;
      return true;
    });
    return [...rows].sort((a, b) => compareStudents(a, b, sortKey.value, sortDir.value));
  });

  const attentionCount = computed(() => students.value.filter(needsAttention).length);

  function studentById(id) {
    return students.value.find((s) => s.studentId === String(id)) ?? null;
  }

  function setSort(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
      return;
    }
    sortKey.value = key;
    // Names A–Z by default. Numbers high-to-low — that's usually what you want for GPA.
    sortDir.value = key === "name" || key === "program" || key === "campus" ? "asc" : "desc";
  }

  function resetFilters() {
    query.value = "";
    campus.value = "all";
    program.value = "all";
    level.value = "all";
    attentionOnly.value = false;
  }

  async function loadRoster() {
    // Already got the list? Don't hit the "API" again just because we changed pages.
    if (students.value.length || loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const data = await fetchRoster();
      term.value = data.term;
      rosterType.value = data.rosterType;
      advisorName.value = data.advisorName;
      students.value = data.students;
    } catch (err) {
      error.value = err?.message ?? "Unable to load roster.";
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    term,
    rosterType,
    advisorName,
    students,
    query,
    campus,
    program,
    level,
    attentionOnly,
    sortKey,
    sortDir,
    campuses,
    programs,
    levels,
    filteredStudents,
    attentionCount,
    studentById,
    setSort,
    resetFilters,
    loadRoster,
  };
});
