<template>
  <div class="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark">
    <div class="layout-container flex h-full grow flex-col">
      <div class="flex flex-1 items-stretch">
        <div class="flex w-full flex-col items-center justify-center lg:w-1/3">
          <div class="flex w-full max-w-sm flex-col items-stretch p-6 sm:p-8">
            <!-- Logo -->
            <div class="flex items-center gap-2.5 pb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">GERMANLY</h2>
            </div>

            <h1 class="pb-4 text-left text-[32px] font-bold leading-tight tracking-tight text-[#181111] dark:text-white">
              Tạo tài khoản của bạn
            </h1>

            <!-- Error Message -->
            <div v-if="authStore.error" class="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {{ authStore.error }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleRegister" class="flex w-full flex-col items-stretch gap-4 py-3">
              <label class="flex flex-1 flex-col">
                <p class="pb-2 text-base font-medium leading-normal text-[#181111] dark:text-gray-200">
                  Họ và tên
                </p>
                <input
                  v-model="formData.fullName"
                  required
                  class="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#e6dbdb] bg-white p-[15px] text-base font-normal leading-normal text-[#181111] transition-all placeholder:text-[#896161] focus:outline-0 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0"
                  placeholder="Nhập họ và tên của bạn"
                />
              </label>

              <label class="flex flex-1 flex-col">
                <p class="pb-2 text-base font-medium leading-normal text-[#181111] dark:text-gray-200">
                  Email
                </p>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  class="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#e6dbdb] bg-white p-[15px] text-base font-normal leading-normal text-[#181111] transition-all placeholder:text-[#896161] focus:outline-0 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0"
                  placeholder="Nhập email của bạn"
                />
              </label>

              <div class="relative">
                <label class="flex flex-1 flex-col">
                  <p class="pb-2 text-base font-medium leading-normal text-[#181111] dark:text-gray-200">
                    Mật khẩu
                  </p>
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#e6dbdb] bg-white p-[15px] pr-12 text-base font-normal leading-normal text-[#181111] transition-all placeholder:text-[#896161] focus:outline-0 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0"
                    placeholder="Nhập mật khẩu"
                  />
                </label>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-12 text-gray-500 hover:text-gray-800"
                >
                  <span class="material-symbols-outlined">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>

              <div class="relative">
                <label class="flex flex-1 flex-col">
                  <p class="pb-2 text-base font-medium leading-normal text-[#181111] dark:text-gray-200">
                    Xác nhận mật khẩu
                  </p>
                  <input
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#e6dbdb] bg-white p-[15px] pr-12 text-base font-normal leading-normal text-[#181111] transition-all placeholder:text-[#896161] focus:outline-0 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-0"
                    placeholder="Nhập lại mật khẩu"
                  />
                </label>
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-4 top-12 text-gray-500 hover:text-gray-800"
                >
                  <span class="material-symbols-outlined">
                    {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>

              <!-- Password mismatch error -->
              <div v-if="passwordMismatch" class="text-sm text-red-600">
                Mật khẩu không khớp
              </div>

              <!-- Submit Button -->
              <div class="flex w-full flex-col items-stretch gap-4 pt-3">
                <button
                  type="submit"
                  :disabled="authStore.loading || passwordMismatch"
                  class="flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ authStore.loading ? 'Đang đăng ký...' : 'Đăng ký' }}
                </button>
              </div>
            </form>

            <!-- Terms and Login Link -->
            <p class="pt-6 text-center text-xs text-gray-500">
              Bằng cách đăng ký, bạn đồng ý với
              <a class="text-red-600 hover:underline" href="#">Điều khoản Dịch vụ</a> và
              <a class="text-red-600 hover:underline" href="#">Chính sách Bảo mật</a> của chúng tôi.
            </p>

            <p class="pt-8 text-center text-base text-gray-600">
              Đã có tài khoản?
              <router-link class="font-bold text-red-600 hover:underline" to="/login">Đăng nhập</router-link>
            </p>
          </div>
        </div>

        <!-- Right Side Decoration (Hidden on mobile) -->
        <div class="hidden w-2/3 flex-col items-center justify-center bg-gray-50 p-12 lg:flex">
          <div class="relative w-full max-w-lg">
            <div class="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-20 blur-2xl"></div>
            <div class="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-20 blur-2xl"></div>
            <div class="relative flex h-full w-full flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-2xl shadow-gray-300/30">
              <h3 class="mt-8 text-center text-3xl font-bold text-gray-900">
                Chinh phục tiếng Đức dễ dàng hơn bao giờ hết.
              </h3>
              <p class="mt-4 text-center text-gray-600">
                Tham gia Germanly để bắt đầu hành trình học tập của bạn ngay hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordMismatch = computed(() => {
  if (!formData.value.confirmPassword) return false
  return formData.value.password !== formData.value.confirmPassword
})

async function handleRegister() {
  if (passwordMismatch.value) return

  try {
    await authStore.register({
      email: formData.value.email,
      password: formData.value.password,
      fullName: formData.value.fullName,
      role: 'learner' // Default role
    })

    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
