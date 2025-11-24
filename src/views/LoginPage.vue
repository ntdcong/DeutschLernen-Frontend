<template>
  <div class="relative w-full bg-background-light dark:bg-background-dark">

    <div class="layout-container">

      <div class="pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div class="layout-content-container flex w-full max-w-md flex-col items-center mx-auto">

          <div class="mb-2 w-full text-center">
            <p
              class="text-3xl font-black leading-tight tracking-[-0.033em] text-yellow-500 sm:text-4xl dark:text-white">
              Đăng Nhập
            </p>
            <br />
          </div>

          <div v-if="authStore.error"
            class="mb-4 w-full rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {{ authStore.error }}
          </div>

          <form @submit.prevent="handleLogin" class="flex w-full flex-col gap-4">
            <label class="flex w-full flex-col">
              <p class="pb-2 text-base font-medium leading-normal text-[#0F1419] dark:text-gray-200">
                Email hoặc Tên người dùng
              </p>
              <input v-model="credentials.email" type="email" required
                class="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#e6dbdb] bg-white p-[15px] text-base font-normal leading-normal text-[#0F1419] placeholder:text-[#536471] focus:border-[#FFCC00] focus:outline-0 focus:ring-1 focus:ring-[#FFCC00]"
                placeholder="Nhập email của bạn" />
            </label>

            <label class="flex w-full flex-col">
              <p class="pb-2 text-base font-medium leading-normal text-[#0F1419] dark:text-gray-200">
                Mật khẩu
              </p>
              <div class="form-input flex h-14 w-full flex-1 items-stretch rounded-lg border border-[#e6dbdb] bg-white">
                <input v-model="credentials.password" :type="showPassword ? 'text' : 'password'" required
                  class="flex h-auto w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent p-[15px] pr-2 text-base font-normal leading-normal text-[#0F1419] placeholder:text-[#536471] focus:outline-0 focus:ring-0"
                  placeholder="Nhập mật khẩu của bạn" />
                <div class="flex items-center justify-center pr-[15px] text-[#536471]">
                  <span @click="showPassword = !showPassword" class="material-symbols-outlined cursor-pointer">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </div>
              </div>
            </label>

            <div class="w-full pt-2">
              <a class="text-sm font-medium leading-normal text-[#DD0000] underline hover:no-underline" href="#">
                Quên mật khẩu?
              </a>
            </div>

            <div class="w-full pt-2"> <button type="submit" :disabled="authStore.loading"
                class="flex h-14 w-full items-center justify-center rounded-full bg-[#000000] px-6 py-3 text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                {{ authStore.loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </div>
          </form>

          <p class="mt-4 text-base font-normal text-[#536471] dark:text-gray-400">
            Chưa có tài khoản?
            <router-link class="font-medium text-[#DD0000] underline hover:no-underline" to="/register">
              Đăng ký ngay
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const credentials = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

async function handleLogin() {
  try {
    await authStore.login(credentials.value)

    // Redirect to intended page or dashboard
    const redirect = route.query.redirect as string || '/dashboard'
    router.push(redirect)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>