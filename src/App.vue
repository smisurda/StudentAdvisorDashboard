<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from "./components/AppHeader.vue";
// Header stays put; RouterView is whichever page we're on.
</script>
