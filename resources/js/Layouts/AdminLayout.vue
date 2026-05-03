<script setup>
import Sidebar from '../Components/Sidebar.vue';
import { Head } from "@inertiajs/vue3";

const props = defineProps({
    title: String,
});
</script>

<template>

    <Head>
        <title>{{ props.title }}</title>
    </Head>
    <div class="flex h-screen">
        <Sidebar />

        <main class="flex-1 bg-gray-100 p-8 overflow-auto">
            <h1 class="text-2xl font-bold mb-6">
                {{ props.title }}
            </h1>

            <div class="relative bg-white rounded-lg shadow p-6">
                <slot />
            </div>
        </main>
    </div>
</template>
