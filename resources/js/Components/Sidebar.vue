<script setup>
import { Link, usePage } from '@inertiajs/vue3';
import { useAuth } from '../Composables/useAuth';

const { logout } = useAuth();
const page = usePage();
// Навигационные ссылки
const navLinks = [
    { path: '/admin', label: 'Главная' },
    { path: '/admin/products', label: 'Товары' }
]

const isActive = (url) => {
    return page.url === url;
}
</script>

<template>
    <aside class="bg-gray-900 text-white w-64 flex flex-col shadow-lg">
        <div class="p-5 border-b border-gray-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <span class="font-bold text-xl">Админ-панель</span>
            </div>
        </div>

        <nav class="flex-1 py-6">
            <ul class="space-y-2">
                <li
                    v-for="link in navLinks"
                    :key="link.path"
                >
                    <Link
                        :href="link.path"
                        class="flex items-center gap-3 px-5 py-3 mx-2 rounded-lg transition-all duration-200 group"
                        :class="[
                            isActive(link.path)
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        ]"
                    >
                        {{ link.label }}
                    </Link>
                </li>
            </ul>
        </nav>

        <div class="p-4 border-t border-gray-800">
            <button
                @click="logout"
                class="cursor-pointer flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 group"
            >
                <span class="font-medium">Выход</span>
            </button>
        </div>
    </aside>
</template>

<style scoped>
/* Анимация для плавного изменения ширины */
aside {
    transition: width 0.3s ease;
}

/* Стили для скролла */
aside::-webkit-scrollbar {
    width: 5px;
}

aside::-webkit-scrollbar-track {
    background: #1f2937;
}

aside::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}
</style>
