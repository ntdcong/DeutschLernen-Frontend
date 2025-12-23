<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()

function matchPath(pattern: string, path: string): boolean {
  if (pattern === path) return true

  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/')

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

const hideLayout = computed(() => {
  const pathsWithoutLayout = [
    '/decks/:id/learn',
    '/decks/:id/practice',
    '/public/practice/:token',
    '/writing-practice',
    '/shadowing',
    '/admin',
    '/admin/users',
    '/admin/decks',
    '/admin/shadowing',
    '/admin/settings',
  ]
  return pathsWithoutLayout.some(pattern => matchPath(pattern, route.path))
})

const hideHeader = computed(() => {
  const pathsWithoutHeader = [
    '/decks/:id/learn',
    '/public/learn/:token',
  ]
  return pathsWithoutHeader.some(pattern => matchPath(pattern, route.path))
})

const hideFooter = computed(() => {
  const pathsWithoutFooter = [
    '/dashboard',
    '/decks',
    '/profile',
    '/decks/:id/learn',
    '/decks/:id/add',
    '/decks/:id/edit',
    '/favorites',
    '/dictionary',
    '/public/learn/:token',
  ]
  return pathsWithoutFooter.some(pattern => matchPath(pattern, route.path))
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header: Ẩn nếu hideLayout HOẶC hideHeader -->
    <Header v-if="!hideLayout && !hideHeader" />

    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer: Ẩn nếu hideLayout HOẶC hideFooter -->
    <Footer v-if="!hideLayout && !hideFooter" />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  font-family: 'Lexend', 'Work Sans', sans-serif;
}
</style>
