<script setup lang="ts">
import { ref, onMounted } from 'vue'
import userService, { type User } from '@/services/user.service'

const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchUsers = async () => {
    try {
        loading.value = true
        const response = await userService.getAllUsers()
        users.value = response.data
    } catch (err) {
        error.value = 'Failed to load users'
        console.error(err)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}

onMounted(fetchUsers)
</script>

<template>
    <div class="user-management">
        <div class="header-actions">
            <h2>User List</h2>
            <button @click="fetchUsers" class="refresh-btn">Refresh</button>
        </div>

        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

        <div v-else class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td class="font-mono">{{ user.id.slice(0, 8) }}...</td>
                        <td class="font-medium">{{ user.fullName }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span :class="['status-badge', user.isActive ? 'active' : 'inactive']">
                                {{ user.isActive ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td>{{ formatDate(user.createdAt) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.user-management {
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
    font-size: 1.25rem;
    color: #111827;
}

.refresh-btn {
    padding: 8px 16px;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    color: #374151;
    transition: all 0.2s;
}

.refresh-btn:hover {
    background-color: #e5e7eb;
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
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
}

td {
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    color: #1f2937;
    font-size: 0.875rem;
}

tr:last-child td {
    border-bottom: none;
}

.font-mono {
    font-family: monospace;
    color: #6b7280;
}

.font-medium {
    font-weight: 500;
}

.status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-badge.active {
    background-color: #dcfce7;
    color: #166534;
}

.status-badge.inactive {
    background-color: #fee2e2;
    color: #991b1b;
}
</style>
