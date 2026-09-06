<template>
  <section v-if="store.loading" class="panel" aria-live="polite">
    <p class="loading">Loading student profile…</p>
  </section>
  <section v-else-if="store.error" class="panel error" role="alert">
    <h2>Unable to load this student</h2>
    <p>{{ store.error }}</p>
    <RouterLink class="primary" to="/">Back to roster</RouterLink>
  </section>
  <section v-else-if="!student" class="panel">
    <h2>Student not found</h2>
    <p>That student is not on this roster, or the ID may be incomplete.</p>
    <RouterLink class="primary" to="/">Back to roster</RouterLink>
  </section>
  <article v-else class="profile">
    <RouterLink class="back" to="/">← Back to roster</RouterLink>
    <header class="profile-hero">
      <div>
        <p class="kicker">{{ formatValue(student.academic.level) }} · {{ formatValue(student.academic.campus) }}</p>
        <h1>{{ displayName(student) }}</h1>
        <p class="muted">
          {{ legalName(student) && legalName(student) !== displayName(student) ? `Legal name: ${legalName(student)} · ` : "" }}
          ID {{ formatValue(student.studentId) }} ·
          <a v-if="student.email" :href="`mailto:${student.email}`">{{ student.email }}</a>
          <span v-else>Email not available</span>
        </p>
      </div>
      <span v-if="reasons.length" class="pill warn">Needs attention</span>
      <span v-else class="pill">On track</span>
    </header>

    <section v-if="reasons.length" class="callout" aria-label="Attention reasons">
      <h2>Why this student is flagged</h2>
      <ul>
        <li v-for="reason in reasons" :key="reason">{{ reason }}</li>
      </ul>
    </section>

    <div class="grid">
      <section class="card">
        <h2>Academics</h2>
        <dl>
          <div>
            <dt>Program</dt>
            <dd>{{ formatValue(student.academic.program) }}</dd>
          </div>
          <div>
            <dt>Cumulative GPA</dt>
            <dd :class="tone(student.academic.cumulativeGpa, 2.5, 3.0)">{{ formatGpa(student.academic.cumulativeGpa) }}</dd>
          </div>
          <div>
            <dt>Term GPA</dt>
            <dd>{{ formatGpa(student.academic.termGpa) }}</dd>
          </div>
          <div>
            <dt>Credits / courses</dt>
            <dd>
              {{ formatValue(student.academic.enrolledCredits) }} credits ·
              {{ formatValue(student.academic.coursesEnrolled) }} courses
            </dd>
          </div>
        </dl>
      </section>

      <section class="card">
        <h2>Engagement</h2>
        <dl>
          <div>
            <dt>Engagement score</dt>
            <dd :class="tone(student.engagement.engagementScore, 65, 80)">
              {{ formatValue(student.engagement.engagementScore) }}
            </dd>
          </div>
          <div>
            <dt>Attendance</dt>
            <dd :class="tone(student.engagement.attendancePercent, 70, 85)">
              {{ formatPercent(student.engagement.attendancePercent) }}
            </dd>
          </div>
          <div>
            <dt>Assignments on time</dt>
            <dd>{{ formatPercent(student.engagement.assignmentsOnTimePercent) }}</dd>
          </div>
          <div>
            <dt>Canvas activity (7 days)</dt>
            <dd>{{ formatValue(student.engagement.canvasActivityLast7Days) }}</dd>
          </div>
          <div>
            <dt>Last login</dt>
            <dd>{{ formatDate(student.engagement.lastLogin) }}</dd>
          </div>
        </dl>
      </section>

      <section class="card">
        <h2>Advising</h2>
        <dl>
          <div>
            <dt>Last advisor contact</dt>
            <dd>{{ formatDate(student.advising.lastAdvisorContact) }}</dd>
          </div>
          <div>
            <dt>Appointment scheduled</dt>
            <dd>{{ student.advising.appointmentScheduled ? "Yes" : "No" }}</dd>
          </div>
          <div>
            <dt>Notes</dt>
            <dd>{{ formatValue(student.advising.notes) }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRosterStore } from "../stores/roster";
import {
  displayName,
  formatDate,
  formatGpa,
  formatPercent,
  formatValue,
  legalName,
} from "../utils/display";
import { attentionReasons, metricTone } from "../utils/attention";

const props = defineProps({
  studentId: { type: String, required: true },
});

const store = useRosterStore();
const student = computed(() => store.studentById(props.studentId));
const reasons = computed(() => (student.value ? attentionReasons(student.value) : []));

onMounted(() => {
  // Deep link / refresh lands here with an empty store, so still kick off the fetch.
  store.loadRoster();
});

function tone(value, warnBelow, goodAt) {
  return metricTone(value, { warnBelow, goodAt });
}
</script>
