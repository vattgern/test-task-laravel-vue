<script setup>
import { router } from "@inertiajs/vue3";
import { reactive, onMounted } from "vue";
import Request from "../../../Vendor/Request";

const state = reactive({
    categories: [],
    errors: {}
})

const fetchCategories = () => {
    Request.get('/api/categories')
        .then(r => {
            state.categories = r;
        })
};
const handleSubmit = (e) => {
    const fd = new FormData(e.target),
        token = localStorage.getItem('auth_token');
    if (!token) return;

    Request.post('/api/products', fd, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(r => {
            router.visit('/admin/products');
        })
        .catch(err => {
            if (err.response.data && err.response.data.errors)
                state.errors = err.response.data.errors;
        })
};
onMounted(() => {
    fetchCategories();
})
</script>

<template>
    <div
        class="w-6xl min-h-screen mt-10"
        style="margin: 0 auto;"
    >
        <h1 class="text-3xl font-bold mb-6">Создание товара</h1>

        <form
            class="w-sm"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Название</label>
                <input
                    type="text"
                    name="name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 mb-2"
                    required
                />
                <p class="text-sm text-red-500">
                    <span
                        v-for="(err, index) in state.errors.name"
                        :key="index"
                        v-html="err"
                    />
                </p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Цена</label>
                <input
                    type="number"
                    name="price"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 mb-2"
                    required
                >
                <p class="text-sm text-red-500">
                    <span
                        v-for="(err, index) in state.errors.price"
                        :key="index"
                        v-html="err"
                    />
                </p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Категория</label>
                <select
                    name="category_id"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 w-64"
                    required
                >
                    <option value="">Все категории</option>
                    <template
                        v-for="el in state.categories"
                        :key="el.id"
                    >
                        <option :value="el.id">{{ el.name }}</option>
                    </template>
                </select>
                <p class="text-sm text-red-500">
                    <span
                        v-for="(err, index) in state.errors.category_id"
                        :key="index"
                        v-html="err"
                    />
                </p>
            </div>
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Описание</label>
                <textarea
                    name="description"
                    class="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 mb-2"
                ></textarea>
                <p class="text-sm text-red-500">
                    <span
                        v-for="(err, index) in state.errors.description"
                        :key="index"
                        v-html="err"
                    />
                </p>
            </div>

            <button
                type="submit"
                class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
                Сохранить
            </button>
        </form>
    </div>
</template>
