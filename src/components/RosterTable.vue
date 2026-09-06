<template>
  <div class="table-wrap" role="region" aria-label="Student roster">
    <table class="roster">
      <thead>
        <tr>
          <th>
            <button type="button" @click="store.setSort('name')">
              Student {{ arrow("name") }}
            </button>
          </th>
          <th>
            <button type="button" @click="store.setSort('program')">
              Program {{ arrow("program") }}
            </button>
          </th>
          <th>
            <button type="button" @click="store.setSort('campus')">
              Campus {{ arrow("campus") }}
            </button>
          </th>
          <th class="num">
            <button type="button" @click="store.setSort('gpa')">
              Cum. GPA {{ arrow("gpa") }}
            </button>
          </th>
          <th class="num">
            <button type="button" @click="store.setSort('engagement')">
              Engagement {{ arrow("engagement") }}
            </button>
          </th>
          <th class="num">
            <button type="button" @click="store.setSort('attendance')">
              Attendance {{ arrow("attendance") }}
            </button>
          </th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="student in store.filteredStudents"
          :key="student.studentId"
          class="clickable"
          @click="$router.push({ name: 'student', params: { studentId: student.studentId } })"
          <!-- whole row is clickable; name is still a real link for keyboard / cmd-click -->
        >
          <td>
            <RouterLink
              class="name-link"
              :to="{ name: 'student', params: { studentId: student.studentId } }"
            >
              {{ displayName(student) }}
            </RouterLink>
            <div class="muted">{{ student.email || "Email not available" }}</div>
          </td>
          <td>
            {{ formatValue(student.academic.program) }}
            <div class="muted">{{ formatValue(student.academic.level) }}</div>
          </td>
          <td>{{ formatValue(student.academic.campus) }}</td>
          <td class="num" :class="toneClass(student.academic.cumulativeGpa, 2.5, 3.0)">
            {{ formatGpa(student.academic.cumulativeGpa) }}
          </td>
          <td class="num" :class="toneClass(student.engagement.engagementScore, 65, 80)">
            {{ formatValue(student.engagement.engagementScore) }}
          </td>
          <td class="num" :class="toneClass(student.engagement.attendancePercent, 70, 85)">
            {{ formatPercent(student.engagement.attendancePercent) }}
          </td>
          <td>
            <span v-if="needsAttention(student)" class="pill warn">Needs attention</span>
            <span v-else-if="student.advising.appointmentScheduled" class="pill info">Appointment set</span>
            <span v-else class="pill">On track</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useRosterStore } from "../stores/roster";
import { displayName, formatGpa, formatPercent, formatValue } from "../utils/display";
import { metricTone, needsAttention } from "../utils/attention";

const store = useRosterStore();

function arrow(key) {
  if (store.sortKey !== key) return "";
  return store.sortDir === "asc" ? "↑" : "↓";
}

function toneClass(value, warnBelow, goodAt) {
  return metricTone(value, { warnBelow, goodAt });
}
</script>
