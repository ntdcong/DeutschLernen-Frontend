<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const menuItems = [
    { label: 'Overview', path: '/admin', icon: '📊' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Shadowing', path: '/admin/shadowing', icon: '🗣️' },
    { label: 'Decks', path: '/admin/decks', icon: '🎴' },
]

const isActive = (path: string) => {
    if (path === '/admin') return route.path === '/admin'
    return route.path.startsWith(path)
}
</script>

<template>
    <div class="admin-layout">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>Admin Panel</h2>
            </div>

            <nav class="sidebar-nav">
                <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
                    :class="{ active: isActive(item.path) }">
                    <span class="icon">{{ item.icon }}</span>
                    <span class="label">{{ item.label }}</span>
                </router-link>
            </nav>

            <div class="sidebar-footer">
                <button @click="handleLogout" class="logout-btn">
                    <span class="icon">🚪</span>
                    Logout
                </button>
            </div>
        </aside>

        <main class="main-content">
            <header class="top-bar">
                <h1 class="page-title">{{ route.name }}</h1>
                <div class="user-info">
                    <span>{{ authStore.user?.fullName }}</span>
                    <div class="avatar">{{ authStore.user?.fullName?.charAt(0) || 'A' }}</div>
                </div>
            </header>

            <div class="content-wrapper">
                <RouterView />
            </div>
        </main>
    </div>
</template>

<style scoped>
.admin-layout {
    display: flex;
    height: 100vh;
    background-color: #f3f4f6;
    font-family: 'Inter', sans-serif;
    color: #1f2937;
}

/* Sidebar */
.sidebar {
    width: 260px;
    background-color: #111827;
    color: #e5e7eb;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.3s ease;
}

.sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    border-bottom: 1px solid #374151;
}

.sidebar-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.sidebar-nav {
    padding: 24px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    color: #9ca3af;
    text-decoration: none;
    transition: all 0.2s;
    font-weight: 500;
}

.nav-item:hover {
    background-color: #1f2937;
    color: #fff;
}

.nav-item.active {
    background-color: #3b82f6;
    color: #fff;
}

.nav-item .icon {
    margin-right: 12px;
    font-size: 1.2rem;
}

.sidebar-footer {
    padding: 16px;
    border-top: 1px solid #374151;
}

.logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    /* Match nav-item padding */
    background: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 1rem;
    font-weight: 500;
}

.logout-btn:hover {
    background-color: #fee2e2;
    color: #ef4444;
}

.logout-btn .icon {
    margin-right: 12px;
}

/* Main Content */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f9fafb;
}

.top-bar {
    height: 64px;
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-info span {
    font-weight: 500;
    color: #374151;
}

.avatar {
    width: 36px;
    height: 36px;
    background-color: #3b82f6;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.content-wrapper {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
}
</style>
