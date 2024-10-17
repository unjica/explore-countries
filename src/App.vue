<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeToggle from "@/components/ThemeToggle.vue"
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-800">
    <header class="p-5 mx-auto h-fit w-full" style="max-width: 1200px">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl text-black dark:text-white">List of countries</h1>
        <ThemeToggle></ThemeToggle>
      </div>
    </header>

    <RouterView class="h-full" />
  </div>
</template>
