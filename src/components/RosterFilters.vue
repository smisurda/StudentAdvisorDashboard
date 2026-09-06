<template>
  <section class="filters" aria-label="Roster filters">
    <label class="field grow">
      <span>Search students</span>
      <input
        v-model="store.query"
        type="search"
        placeholder="Name, email, ID, or program"
        autocomplete="off"
      />
    </label>
    <label class="field">
      <span>Campus</span>
      <select v-model="store.campus">
        <option value="all">All campuses</option>
        <option v-for="item in store.campuses" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>
    <label class="field">
      <span>Program</span>
      <select v-model="store.program">
        <option value="all">All programs</option>
        <option v-for="item in store.programs" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>
    <label class="field">
      <span>Level</span>
      <select v-model="store.level">
        <option value="all">All levels</option>
        <option v-for="item in store.levels" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>
    <label class="toggle">
      <input v-model="store.attentionOnly" type="checkbox" />
      Needs attention
    </label>
    <button type="button" class="linkish" @click="store.resetFilters()">Clear</button>
  </section>
</template>

<script setup>
import { useRosterStore } from "../stores/roster";

// Bound straight to the store so we don't invent a second copy of the filters.
const store = useRosterStore();
</script>
