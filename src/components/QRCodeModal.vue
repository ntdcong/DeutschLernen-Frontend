<script setup lang="ts">
import { ref, watch } from 'vue';
import { publicSharingService } from '@/services/publicSharingService';

const props = defineProps<{
    token: string;
    deckName: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const qrCode = ref('');
const type = ref<'simple' | 'custom'>('simple');
const loading = ref(false);

watch(type, loadQR, { immediate: true });

async function loadQR() {
    loading.value = true;
    try {
        qrCode.value = await publicSharingService.getQRCode(
            props.token,
            type.value,
            300 // Fixed size
        );
    } catch (error: any) {
        console.error('Failed to load QR code', error);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }

        // Fallback to simple if custom fails
        if (type.value === 'custom') {
            console.log('Falling back to simple QR code...');
            try {
                type.value = 'simple';
                return;
            } catch (e) {
                console.error('Fallback failed', e);
            }
        }
    } finally {
        loading.value = false;
    }
}

function download() {
    const url = publicSharingService.getQRDownloadUrl(props.token, type.value, 300);
    window.open(url, '_blank');
}
</script>

<template>
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click="emit('close')">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900" @click.stop>
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">QR Code: {{ deckName }}</h2>
                <button @click="emit('close')"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <div class="mb-6 flex flex-col gap-4 sm:flex-row">
                <label class="flex flex-1 flex-col">
                    <span class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kiểu dáng</span>
                    <select v-model="type"
                        class="rounded-xl border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <option value="simple">Đơn giản</option>
                        <option value="custom">Cách điệu</option>
                    </select>
                </label>
            </div>

            <div class="mb-6 flex min-h-[300px] items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div v-if="loading"
                    class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <img v-else-if="qrCode" :src="qrCode" alt="QR Code" class="max-w-full rounded-lg shadow-sm" />
                <span v-else class="text-gray-500">Không thể tải QR Code</span>
            </div>

            <div class="flex justify-end gap-3">
                <button @click="emit('close')"
                    class="rounded-xl px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                    Đóng
                </button>
                <button @click="download"
                    class="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white hover:bg-primary/90">
                    <span class="material-symbols-outlined">download</span>
                    Tải xuống
                </button>
            </div>
        </div>
    </div>
</template>
