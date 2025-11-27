<template>
  <div
    class="relative flex min-h-screen w-full flex-col bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark font-sans selection:bg-primary/20 overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <main class="flex-1">
        <!-- Hero Section -->
        <section class="relative pb-20 lg:pt-24 lg:pb-32">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <!-- Hero Text -->
              <div class="text-center lg:text-left">
                <div
                  class="inline-flex items-center gap-2 rounded-full border border-border-light bg-white px-3 py-1 text-xs font-medium text-text-secondary-light shadow-sm mb-6 dark:border-border-dark dark:bg-surface-dark dark:text-text-secondary-dark">
                  <span class="relative flex h-2 w-2">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Dự án học tiếng Đức cá nhân
                </div>
                <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
                  Chinh phục <span class="text-primary relative inline-block">
                    Tiếng Đức
                  </span> <br />
                  theo cách của bạn.
                </h1>
                <p
                  class="mx-auto lg:mx-0 max-w-2xl text-lg text-text-secondary-light dark:text-text-secondary-dark mb-8 leading-relaxed">
                  Hệ thống Flashcard thông minh (SRS), tích hợp AI Assistant và kho ngữ pháp phong phú.
                  Giúp bạn nhớ từ vựng lâu hơn và học hiệu quả hơn mỗi ngày.
                </p>

                <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <router-link to="/register"
                    class="h-12 px-8 inline-flex items-center justify-center rounded-xl bg-black text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5">
                    Học ngay
                    <span class="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
                  </router-link>
                  <a href="https://github.com/ntdcong" target="_blank"
                    class="h-12 px-8 inline-flex items-center justify-center rounded-xl border border-border-light bg-white text-text-primary-light font-medium hover:bg-gray-50 dark:bg-surface-dark dark:border-border-dark dark:text-text-primary-dark dark:hover:bg-gray-800 transition-all">
                    <span class="material-symbols-outlined text-xl mr-2">code</span>
                    Xem Source Code
                  </a>
                </div>

                <div
                  class="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">check_circle</span>
                    <span>Miễn phí</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">check_circle</span>
                    <span>Mã nguồn mở</span>
                  </div>
                </div>
              </div>

              <!-- Hero Visual (Interactive Flip Card) -->
              <div class="relative perspective-1000 group mx-auto w-full max-w-md">
                <!-- Decorative Elements behind -->
                <div
                  class="absolute -inset-4 bg-gradient-to-r from-primary to-primary-yellow rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500">
                </div>

                <!-- The Card -->
                <div class="relative w-full aspect-[4/5] transition-all duration-700 transform-style-3d cursor-pointer"
                  :class="{ 'rotate-y-180': isFlipped }" @click="toggleFlip">
                  <!-- Front Side -->
                  <div class="absolute inset-0 backface-hidden">
                    <div
                      class="h-full w-full rounded-2xl border border-border-light bg-white p-8 shadow-2xl dark:border-border-dark dark:bg-surface-dark flex flex-col items-center justify-between">
                      <div class="w-full flex justify-between items-center">
                        <span class="text-xs font-bold uppercase tracking-wider text-text-secondary-light/60">Wort des
                          Tages</span>
                        <span class="material-symbols-outlined text-text-secondary-light/40">volume_up</span>
                      </div>

                      <div class="text-center">
                        <h2 class="text-5xl font-bold text-primary mb-2">der Traum</h2>
                        <p class="text-xl text-text-secondary-light dark:text-text-secondary-dark italic">/traʊm/</p>
                      </div>

                      <div class="w-full">
                        <button
                          class="w-full py-3 rounded-xl bg-gray-100 text-text-secondary-light font-medium hover:bg-gray-200 dark:bg-gray-800 dark:text-text-secondary-dark dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                          <span class="material-symbols-outlined text-lg">touch_app</span>
                          Chạm để xem nghĩa
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Back Side -->
                  <div class="absolute inset-0 backface-hidden rotate-y-180">
                    <div
                      class="h-full w-full rounded-2xl border border-border-light bg-gradient-to-br from-primary to-red-600 p-8 shadow-2xl text-white flex flex-col items-center justify-center text-center">
                      <div class="mb-6">
                        <span class="material-symbols-outlined text-6xl opacity-80">lightbulb</span>
                      </div>
                      <h3 class="text-3xl font-bold mb-4">Giấc mơ</h3>
                      <p class="text-white/90 text-lg leading-relaxed">
                        "Ich habe einen Traum." <br />
                        (Tôi có một giấc mơ)
                      </p>
                      <div class="mt-8 pt-6 border-t border-white/20 w-full">
                        <p class="text-sm font-medium opacity-80">Danh từ giống đực (Der)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Bento Grid -->
        <section class="py-20 bg-gray-50 dark:bg-[#121212]/50 border-y border-border-light dark:border-border-dark">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
              <h2 class="font-display text-3xl font-bold text-text-primary-light dark:text-white sm:text-4xl mb-4">
                Mọi thứ bạn cần để giỏi tiếng Đức
              </h2>
              <p class="text-lg text-text-secondary-light dark:text-text-secondary-dark">
                Tích hợp các phương pháp học tập hiện đại nhất vào một nền tảng duy nhất.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              <!-- Feature 1: SRS (Large) -->
              <div
                class="md:col-span-2 group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-border-light hover:shadow-xl hover:border-primary/20 transition-all dark:bg-surface-dark dark:border-border-dark">
                <div
                  class="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-colors">
                </div>

                <div class="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div
                      class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 dark:bg-blue-900/30 dark:text-blue-400">
                      <span class="material-symbols-outlined text-2xl">psychology</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Spaced Repetition System (SRS)</h3>
                    <p class="text-text-secondary-light dark:text-text-secondary-dark max-w-md">
                      Thuật toán thông minh tự động tính toán thời điểm vàng để ôn tập, giúp bạn ghi nhớ từ vựng vĩnh
                      viễn với nỗ lực tối thiểu.
                    </p>
                  </div>

                  <!-- Visual representation of SRS curve -->
                  <div class="mt-6 h-32 w-full flex items-end gap-2 opacity-80">
                    <div
                      class="w-full bg-blue-100 dark:bg-blue-900/20 rounded-t-lg relative overflow-hidden group-hover:h-full transition-all duration-700 h-[40%]">
                    </div>
                    <div
                      class="w-full bg-blue-200 dark:bg-blue-900/40 rounded-t-lg relative overflow-hidden group-hover:h-full transition-all duration-700 delay-75 h-[60%]">
                    </div>
                    <div
                      class="w-full bg-blue-300 dark:bg-blue-900/60 rounded-t-lg relative overflow-hidden group-hover:h-full transition-all duration-700 delay-100 h-[30%]">
                    </div>
                    <div
                      class="w-full bg-blue-400 dark:bg-blue-900/80 rounded-t-lg relative overflow-hidden group-hover:h-full transition-all duration-700 delay-150 h-[80%]">
                    </div>
                    <div
                      class="w-full bg-blue-500 dark:bg-blue-500 rounded-t-lg relative overflow-hidden group-hover:h-full transition-all duration-700 delay-200 h-[95%]">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Feature 2: AI Assistant -->
              <div
                class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-border-light hover:shadow-xl hover:border-primary/20 transition-all dark:bg-surface-dark dark:border-border-dark">
                <div
                  class="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-colors">
                </div>

                <div class="relative z-10 h-full flex flex-col">
                  <div
                    class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 dark:bg-purple-900/30 dark:text-purple-400">
                    <span class="material-symbols-outlined text-2xl">smart_toy</span>
                  </div>
                  <h3 class="text-xl font-bold mb-2">AI Assistant</h3>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                    Hỏi đáp ngữ pháp, tạo ví dụ, và sửa lỗi sai tức thì với trợ lý ảo thông minh.
                  </p>
                  <div
                    class="mt-auto rounded-lg bg-gray-50 p-3 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <div class="flex gap-2 mb-2">
                      <div class="w-2 h-2 rounded-full bg-red-400"></div>
                      <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div class="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-2 w-3/4 bg-gray-200 rounded dark:bg-gray-600"></div>
                      <div class="h-2 w-1/2 bg-gray-200 rounded dark:bg-gray-600"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Feature 3: Grammar -->
              <div
                class="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-border-light hover:shadow-xl hover:border-primary/20 transition-all dark:bg-surface-dark dark:border-border-dark">
                <div
                  class="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl group-hover:bg-yellow-500/20 transition-colors">
                </div>

                <div class="relative z-10 h-full flex flex-col">
                  <div
                    class="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-6 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <span class="material-symbols-outlined text-2xl">menu_book</span>
                  </div>
                  <h3 class="text-xl font-bold mb-2">Ngữ pháp & Ví dụ</h3>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Kho tàng ngữ pháp được trình bày dễ hiểu, kèm ví dụ thực tế giúp bạn áp dụng ngay.
                  </p>
                </div>
              </div>

              <!-- Feature 4: Statistics (Medium) -->
              <div
                class="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-sm border border-gray-800 hover:shadow-xl transition-all text-white">
                <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20">
                </div>

                <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 h-full">
                  <div class="flex-1">
                    <h3 class="text-2xl font-bold mb-2">Theo dõi tiến độ</h3>
                    <p class="text-gray-400">
                      Biểu đồ trực quan giúp bạn nhìn thấy sự tiến bộ của mình mỗi ngày. Giữ lửa động lực học tập.
                    </p>
                  </div>
                  <div class="flex gap-6">
                    <div class="text-center">
                      <div class="text-3xl font-bold text-primary-yellow">1000+</div>
                      <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Từ vựng</div>
                    </div>
                    <div class="text-center">
                      <div class="text-3xl font-bold text-primary">50+</div>
                      <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Chủ đề</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="py-24 relative overflow-hidden">
          <div class="absolute inset-0 -z-10 bg-surface-light dark:bg-surface-dark">
            <div
              class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            </div>
          </div>

          <div class="mx-auto max-w-4xl px-4 text-center">
            <h2 class="font-display text-4xl font-bold mb-6 text-text-primary-light dark:text-white">
              Sẵn sàng để bắt đầu?
            </h2>
            <p class="text-xl text-text-secondary-light dark:text-text-secondary-dark mb-10 max-w-2xl mx-auto">
              Tham gia ngay hôm nay và trải nghiệm cách học tiếng Đức hoàn toàn mới. Miễn phí và mã nguồn mở.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <router-link to="/register"
                class="min-w-[200px] h-14 inline-flex items-center justify-center rounded-xl bg-black text-white font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
                Tạo tài khoản
              </router-link>
              <router-link to="/login"
                class="min-w-[200px] h-14 inline-flex items-center justify-center rounded-xl bg-white border border-border-light text-text-primary-light font-bold text-lg hover:bg-gray-50 dark:bg-surface-dark dark:border-border-dark dark:text-white dark:hover:bg-gray-800 transition-all">
                Đăng nhập
              </router-link>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isFlipped = ref(false)

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>