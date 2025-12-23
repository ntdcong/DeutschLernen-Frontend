<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import deckService, { type Deck } from '@/services/deck.service'

const decks = ref<Deck[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showModal = ref(false)
const saving = ref(false)

const form = reactive({
    id: '',
    name: '',
    isPublic: false
})

const fetchDecks = async () => {
    try {
        loading.value = true
        const response = await deckService.getDecks()
        // Admin likely sees all decks, depends on backend
        decks.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
        error.value = 'Failed to load decks'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const originalIsPublic = ref(false)

const openEditModal = (deck: Deck) => {
    form.id = deck.id
    form.name = deck.name
    form.isPublic = deck.isPublic
    originalIsPublic.value = deck.isPublic
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    form.id = ''
    form.name = ''
    form.isPublic = false
}

const submitForm = async () => {
    try {
        saving.value = true

        // 1. Handle Public Share specific endpoints if status changed
        if (form.isPublic !== originalIsPublic.value) {
            try {
                if (form.isPublic) {
                    await deckService.enablePublicShare(form.id)
                } else {
                    await deckService.disablePublicShare(form.id)
                }
            } catch (shareErr) {
                console.warn('Share endpoint error:', shareErr)
            }
        }

        // 2. Update Deck Manifest (Name AND isPublic explicit flag)
        await deckService.updateDeck(form.id, {
            name: form.name,
            isPublic: form.isPublic
        })

        await fetchDecks()
        closeModal()
    } catch (err) {
        alert('Failed to update deck')
        console.error(err)
    } finally {
        saving.value = false
    }
}

const deleteDeck = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return
    try {
        await deckService.deleteDeck(id)
        await fetchDecks()
    } catch (err) {
        alert('Failed to delete deck')
    }
}

onMounted(fetchDecks)
</script>

<template>
    <div class="deck-management">
        <div class="header-actions">
            <h2>Deck Management</h2>
            <button @click="fetchDecks" class="refresh-btn">Refresh</button>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Visibility</th>
                        <th>Word Count</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="deck in decks" :key="deck.id">
                        <td class="font-medium">{{ deck.name }}</td>
                        <td>
                            <span :class="['badge', deck.isPublic ? 'public' : 'private']">
                                {{ deck.isPublic ? 'Public' : 'Private' }}
                            </span>
                        </td>
                        <td>{{ deck.wordCount || '-' }}</td>
                        <td>{{ new Date(deck.createdAt).toLocaleDateString() }}</td>
                        <td>
                            <div class="actions">
                                <button @click="openEditModal(deck)" class="action-btn edit">Edit</button>
                                <button @click="deleteDeck(deck.id)" class="action-btn delete">Delete</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="decks.length === 0" class="empty-state">No decks found.</div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal">
                <header class="modal-header">
                    <h3>Edit Deck</h3>
                    <button @click="closeModal" class="close-btn">×</button>
                </header>

                <form @submit.prevent="submitForm" class="modal-body">
                    <div class="form-group">
                        <label>Deck Name</label>
                        <input v-model="form.name" required placeholder="Deck Name" />
                    </div>

                    <div class="form-group checkbox">
                        <label>
                            <input type="checkbox" v-model="form.isPublic" />
                            Publicly Available
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button type="button" @click="closeModal" class="btn secondary">Cancel</button>
                        <button type="submit" class="btn primary" :disabled="saving">
                            {{ saving ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.deck-management {
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

.refresh-btn {
    padding: 8px 16px;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
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
}

.badge {
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge.public {
    background-color: #dbeafe;
    color: #1e40af;
}

.badge.private {
    background-color: #f3f4f6;
    color: #374151;
}

.actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.action-btn.edit {
    color: #1d4ed8;
    background-color: #eff6ff;
}

.action-btn.edit:hover {
    background-color: #dbeafe;
}

.action-btn.delete {
    color: #dc2626;
    background-color: #fee2e2;
}

.action-btn.delete:hover {
    background-color: #fecaca;
}

.empty-state {
    padding: 32px;
    text-align: center;
    color: #6b7280;
}

/* Modal Styles */
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
    max-width: 500px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
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

.form-group input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
    box-sizing: border-box;
}

.form-group.checkbox {
    display: flex;
    align-items: center;
}

.form-group.checkbox input {
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

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
}

.btn.primary {
    background-color: #3b82f6;
    color: white;
}

.btn.secondary {
    background-color: white;
    border-color: #d1d5db;
    color: #374151;
}
</style>
