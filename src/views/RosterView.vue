<template>
  <section v-if="store.loading" class="panel" aria-live="polite">
    <p class="loading">Loading roster…</p>
  </section>
  <section v-else-if="store.error" class="panel error" role="alert">
    <h2>Roster unavailable</h2>
    <p>{{ store.error }}</p>
    <button type="button" class="primary" @click="retry">Try again</button>
  </section>
  <template v-else>
    <section class="summary" aria-label="Roster summary">
      <article>
        <p class="label">Students</p>
        <p class="value">{{ store.students.length }}</p>
      </article>
      <article>
        <p class="label">Showing</p>
        <p class="value">{{ store.filteredStudents.length }}</p>
      </article>
      <article>
        <p class="label">Needs attention</p>
        <p class="value warn-text">{{ store.attentionCount }}</p>
      </article>
    </section>
    <RosterFilters />
    <p v-if="!store.filteredStudents.length" class="empty">
      No students match the current search or filters. Try a different name, or
      <button type="button" class="linkish" @click="store.resetFilters()">clear filters</button>.
    </p>
    <RosterTable v-else />
  </template>
</template>

<script setup>
import { onMounted } from "vue";
import { useRosterStore } from "../stores/roster";
import RosterFilters from "../components/RosterFilters.vue";
import RosterTable from "../components/RosterTable.vue";

const store = useRosterStore();

onMounted(() => {
  store.loadRoster();
});

function retry() {
  // loadRoster bails if we already have rows, so wipe first.
  store.students = [];
  store.loadRoster();
}
</script>
