<template>
  <header class="topbar">
    <div class="topbar-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark" aria-hidden="true">PSU</span>
        <span>
          <strong>Advisor Roster</strong>
          <span class="brand-sub">Data Empowered Learning</span>
        </span>
      </RouterLink>
      <p class="topbar-meta" v-if="store.advisorName">
        {{ store.rosterType }} view · {{ store.term }} · {{ store.advisorName }}
      </p>
    </div>
  </header>
</template>

<script setup>
import { useRosterStore } from "../stores/roster";

const store = useRosterStore();
</script>
