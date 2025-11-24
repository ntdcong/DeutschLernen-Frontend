<template>
  <div
    class="relative flex min-h-screen w-full flex-col bg-white text-slate-900 dark:bg-[#0f172a] dark:text-slate-100 font-sans selection:bg-primary/20">

    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        class="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-slate-50 blur-3xl dark:bg-slate-800/30">
      </div>
      <div
        class="absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-slate-50 blur-3xl dark:bg-slate-800/30">
      </div>
    </div>

    <div class="layout-container flex h-full grow flex-col">

      <header
        class="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-[#0f172a]/80">
        <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <router-link to="/" class="flex items-center gap-2 group">
            <span class="text-lg font-bold tracking-tight">GERMANLY</span>
          </router-link>

          <div class="flex items-center gap-4">
            <router-link to="/login"
              class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Đăng nhập
            </router-link>
            <router-link to="/register"
              class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all">
              Tạo tài khoản
            </router-link>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <section class="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div class="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            <div
              class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 mb-6 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              🚀 Personal Project
            </div>
            <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Học tiếng Đức <br class="sm:hidden" />
              <span class="text-primary">đơn giản & hiệu quả.</span>
            </h1>
            <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Một công cụ để giúp việc học từ vựng và ngữ pháp tiếng Đức trở nên dễ hơn.
            </p>

            <div class="mt-8 flex justify-center gap-4">
              <router-link to="/register"
                class="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-black text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Bắt đầu học
              </router-link>
              <a href="https://github.com/ntdcong" target="_blank"
                class="h-12 px-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all">
                <span class="material-symbols-outlined text-lg mr-2">code</span>
                Github
              </a>
            </div>

            <div class="mt-16 relative mx-auto max-w-3xl">
              <div
                class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900/50">
                <div
                  class="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-400"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div class="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div class="mx-auto h-5 w-60 rounded bg-slate-200/50 dark:bg-slate-700/50"></div>
                </div>
                <div class="p-8 sm:p-12 flex flex-col items-center gap-6">
                  <div class="text-center space-y-2">
                    <span class="text-sm uppercase tracking-wider text-slate-400 font-semibold">Flashcard</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Das Buch</h3>
                    <p class="text-slate-500">/das buːx/</p>
                  </div>
                  <div class="w-full max-w-md h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div class="h-full w-2/3 bg-primary rounded-full"></div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <button
                      class="py-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">Quên</button>
                    <button
                      class="py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 dark:bg-white dark:text-black">Đã
                      nhớ</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="py-16 border-t border-slate-100 dark:border-slate-800/50">
          <div class="mx-auto max-w-5xl px-4 sm:px-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                class="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors dark:bg-slate-800/50 dark:hover:bg-slate-800">
                <div
                  class="w-10 h-10 mb-4 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary dark:bg-slate-900">
                  <span class="material-symbols-outlined">style</span>
                </div>
                <h3 class="text-lg font-bold mb-2">Flashcard SRS</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hệ thống tự động nhắc lại từ vựng dựa trên độ quên của não bộ, giúp nhớ lâu hơn mà tốn ít thời gian.
                </p>
              </div>
              <div
                class="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors dark:bg-slate-800/50 dark:hover:bg-slate-800">
                <div
                  class="w-10 h-10 mb-4 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary dark:bg-slate-900">
                  <span class="material-symbols-outlined">menu_book</span>
                </div>
                <h3 class="text-lg font-bold mb-2">Ngữ pháp & Ví dụ</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tổng hợp các cấu trúc câu thông dụng kèm ví dụ thực tế, không lan man lý thuyết hàn lâm.
                </p>
              </div>
              <div
                class="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors dark:bg-slate-800/50 dark:hover:bg-slate-800">
                <div
                  class="w-10 h-10 mb-4 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary dark:bg-slate-900">
                  <span class="material-symbols-outlined">smart_toy</span>
                </div>
                <h3 class="text-lg font-bold mb-2">AI Assistant</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tích hợp AI để cung cấp thông tin và giải đáp thắc mắc nhanh chóng ngay trong lúc học.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="py-16 text-center">
          <div class="mx-auto max-w-2xl px-4">
            <h2 class="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sẵn sàng thử nghiệm?</h2>
            <p class="text-slate-600 dark:text-slate-400 mb-8">
              Dự án vẫn đang trong quá trình phát triển, rất mong nhận được đóng góp từ bạn để Germanly hoàn thiện hơn.
            </p>
            <router-link to="/register"
              class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-black">
              Tạo tài khoản miễn phí
            </router-link>
          </div>
        </section>
      </main>

      <footer class="border-t border-slate-200 py-8 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
        <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            © 2025-2026 Germanly. Built by <a href="#"
              class="font-medium text-slate-900 hover:underline dark:text-white">Duy Công</a>.
          </p>
          <div class="flex gap-6">
            <a href="https://github.com/ntdcong"
              class="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">Github</a>
            <a href="https://dcong.io.vn"
              class="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">Portfolio</a>
            <a href="https://dcong.io.vn"
              class="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white">Liên hệ</a>
          </div>
        </div>
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
// Minimal setup
</script>