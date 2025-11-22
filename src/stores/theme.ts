import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  // Initialize from localStorage or system preference
  function initializeTheme() {
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // Apply theme to document
  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Toggle theme
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  // Set theme explicitly
  function setTheme(dark: boolean) {
    isDark.value = dark
  }

  // Watch for theme changes and persist
  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme()
  })

  return {
    isDark,
    initializeTheme,
    toggleTheme,
    setTheme
  }
})
