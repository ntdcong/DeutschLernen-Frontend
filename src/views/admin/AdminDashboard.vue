<script setup lang="ts">
import { ref, onMounted } from 'vue'
import userService from '@/services/user.service'
import shadowingService from '@/services/shadowing.service'
import deckService from '@/services/deck.service'

const stats = ref({
    totalUsers: 0,
    totalTexts: 0,
    totalDecks: 0,
})

const loading = ref(true)

onMounted(async () => {
    try {
        const [usersRes, textsRes, decksRes] = await Promise.all([
            userService.getAllUsers(),
            shadowingService.getTexts(),
            deckService.getDecks()
        ]) as [any, any, any]

        if (usersRes?.data) {
            stats.value.totalUsers = usersRes.data.length || 0;
        }

        if (textsRes) {
            if (textsRes.count !== undefined) {
                stats.value.totalTexts = textsRes.count;
            } else if (Array.isArray(textsRes.data)) {
                stats.value.totalTexts = textsRes.data.length;
            }
        }

        if (decksRes?.data) {
            stats.value.totalDecks = Array.isArray(decksRes.data) ? decksRes.data.length : 0;
        }
    } catch (error) {
        console.error('Failed to load stats', error)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="dashboard-home">
        <div v-if="loading" class="loading">Loading stats...</div>

        <div v-else class="stats-grid">
            <div class="stat-card users">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <h3>Total Users</h3>
                    <p class="stat-value">{{ stats.totalUsers }}</p>
                </div>
            </div>

            <div class="stat-card texts">
                <div class="stat-icon">📚</div>
                <div class="stat-info">
                    <h3>Shadowing Texts</h3>
                    <p class="stat-value">{{ stats.totalTexts }}</p>
                </div>
            </div>

            <div class="stat-card decks">
                <div class="stat-icon">🎴</div>
                <div class="stat-info">
                    <h3>Flashcard Decks</h3>
                    <p class="stat-value">{{ stats.totalDecks }}</p>
                </div>
            </div>
        </div>

        <!-- Placeholder for specific recent activity or charts -->
        <div class="welcome-section">
            <h2>Welcome to the Admin Dashboard</h2>
            <p>Use the sidebar to manage users, content, and system settings.</p>
        </div>
    </div>
</template>

<style scoped>
.dashboard-home {
    max-width: 1200px;
    margin: 0 auto;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
}

.stat-icon {
    font-size: 2.5rem;
    margin-right: 20px;
    background-color: #f3f4f6;
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-info h3 {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.stat-value {
    margin: 4px 0 0 0;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
}

.users .stat-icon {
    color: #3b82f6;
    background-color: #eff6ff;
}

.texts .stat-icon {
    color: #10b981;
    background-color: #ecfdf5;
}

.decks .stat-icon {
    color: #8b5cf6;
    background-color: #f5f3ff;
}

.welcome-section {
    background-color: #fff;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
}

.welcome-section h2 {
    margin-top: 0;
    color: #111827;
}

.welcome-section p {
    color: #4b5563;
}
</style>
