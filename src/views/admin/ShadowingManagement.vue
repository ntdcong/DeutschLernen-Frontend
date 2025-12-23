<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import shadowingService, { type ShadowingText } from '@/services/shadowing.service'

const texts = ref<ShadowingText[]>([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const form = reactive({
    id: '',
    title: '',
    content: '',
    level: 'A1',
    category: '',
    description: '',
    audioUrl: '',
    useCustomAudio: false,
    isActive: true
})

const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

const fetchTexts = async () => {
    try {
        loading.value = true
        const response = await shadowingService.getTexts()
        texts.value = response.data || []
    } catch (error) {
        console.error('Failed to load texts', error)
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    isEditing.value = false
    form.id = ''
    form.title = ''
    form.content = ''
    form.level = 'A1'
    form.category = ''
    form.description = ''
    form.audioUrl = ''
    form.useCustomAudio = false
    form.isActive = true
    showModal.value = true
}

const openEditModal = (text: ShadowingText) => {
    isEditing.value = true
    form.id = text.id
    form.title = text.title
    form.content = text.content
    form.level = text.level
    form.category = text.category
    form.description = text.description || ''
    form.audioUrl = text.audioUrl || ''
    form.useCustomAudio = text.useCustomAudio
    form.isActive = text.isActive
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const submitForm = async () => {
    try {
        saving.value = true
        const payload = {
            title: form.title,
            content: form.content,
            level: form.level as any,
            category: form.category,
            description: form.description,
            audioUrl: form.audioUrl,
            useCustomAudio: form.useCustomAudio,
            isActive: true, // simplified for now
        }

        if (isEditing.value) {
            await shadowingService.updateText(form.id, payload)
        } else {
            await shadowingService.createText(payload)
        }

        await fetchTexts()
        closeModal()
    } catch (error) {
        console.error('Failed to save text', error)
        alert('Failed to save text')
    } finally {
        saving.value = false
    }
}

const deleteText = async (id: string) => {
    if (!confirm('Are you sure you want to delete this text?')) return
    try {
        await shadowingService.deleteText(id)
        await fetchTexts()
    } catch (error) {
        console.error('Failed to delete', error)
        alert('Failed to delete text')
    }
}

onMounted(fetchTexts)
</script>

<template>
    <div class="shadowing-management">
        <div class="header-actions">
            <h2>Shadowing Library</h2>
            <button @click="openCreateModal" class="btn primary">
                <span class="icon">+</span> Add New Text
            </button>
        </div>

        <div v-if="loading" class="loading">Loading...</div>

        <div v-else class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Level</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="text in texts" :key="text.id">
                        <td class="ws-nowrap font-medium">{{ text.title }}</td>
                        <td><span :class="['level-badge', text.level]">{{ text.level }}</span></td>
                        <td>{{ text.category }}</td>
                        <td class="truncate" :title="text.description">{{ text.description }}</td>
                        <td>
                            <div class="actions">
                                <button @click="openEditModal(text)" class="btn icon-only info">✏️</button>
                                <button @click="deleteText(text.id)" class="btn icon-only danger">🗑️</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <header class="modal-header">
                    <h3>{{ isEditing ? 'Edit Text' : 'Create New Text' }}</h3>
                    <button @click="closeModal" class="close-btn">×</button>
                </header>

                <form @submit.prevent="submitForm" class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input v-model="form.title" required placeholder="E.g. Morning Routine" />
                    </div>

                    <div class="form-row">
                        <div class="form-group half">
                            <label>Level</label>
                            <select v-model="form.level">
                                <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
                            </select>
                        </div>
                        <div class="form-group half">
                            <label>Category</label>
                            <input v-model="form.category" required placeholder="E.g. Daily Life" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Content (German)</label>
                        <textarea v-model="form.content" required rows="6"
                            placeholder="Enter the German text here..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Description</label>
                        <input v-model="form.description" placeholder="Short description" />
                    </div>

                    <div class="form-group">
                        <label>Audio URL (Optional)</label>
                        <input v-model="form.audioUrl" placeholder="https://..." />
                    </div>

                    <div class="form-group checkbox">
                        <label>
                            <input type="checkbox" v-model="form.useCustomAudio" />
                            Use Custom Audio
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="btn secondary">Cancel</button>
                        <button type="submit" class="btn primary" :disabled="saving">
                            {{ saving ? 'Saving...' : 'Save Text' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shadowing-management {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header-actions h2 {
    margin: 0;
    color: #111827;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

th {
    background-color: #f9fafb;
    padding: 12px 16px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 1px solid #e5e7eb;
}

td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    color: #1f2937;
    vertical-align: middle;
}

.truncate {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.level-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.75rem;
    background: #eee;
}

.level-badge.A1 {
    background: #dcfce7;
    color: #166534;
}

.level-badge.A2 {
    background: #dcfce7;
    color: #166534;
}

.level-badge.B1 {
    background: #dbeafe;
    color: #1e40af;
}

.level-badge.B2 {
    background: #dbeafe;
    color: #1e40af;
}

.level-badge.C1 {
    background: #fce7f3;
    color: #9d174d;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn.primary {
    background-color: #3b82f6;
    color: white;
}

.btn.primary:hover {
    background-color: #2563eb;
}

.btn.secondary {
    background-color: white;
    border-color: #d1d5db;
    color: #374151;
}

.btn.secondary:hover {
    background-color: #f3f4f6;
}

.btn.icon-only {
    padding: 8px;
    font-size: 1rem;
}

.btn.info {
    background-color: #eff6ff;
    color: #3b82f6;
}

.btn.danger {
    background-color: #fef2f2;
    color: #ef4444;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    backdrop-filter: blur(4px);
}

.modal {
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    animation: modal-pop 0.3s ease-out;
}

@keyframes modal-pop {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
}

.modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
    /* Fix sizing */
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-row {
    display: flex;
    gap: 16px;
}

.half {
    flex: 1;
}

.checkbox {
    display: flex;
    align-items: center;
}

.checkbox input {
    width: auto;
    margin-right: 8px;
}

.modal-footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
