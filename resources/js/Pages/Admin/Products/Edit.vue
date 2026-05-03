<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import Request from "../../../Vendor/Request";
import { Link, router } from "@inertiajs/vue3";

import Loader from "../../../Components/Loader.vue";
import Failed from "../../../Components/Failed.vue";

const props = defineProps({
    product: [String, Number]
});

const isLoading = ref(false);
const isFailed = ref(false);
const state = reactive({
    data: {},
    categories: [],
    errors: {}
});

const title = computed(() => `Редактирование товара №${props.product}`);

const fetchProduct = () => {
    isLoading.value = true;
    Request.get(`/api/products/${props.product}`)
        .then(r => {
            state.data = r.data;
            isLoading.value = false;
        })
        .catch(err => {
            isFailed.value = true;
        })
};
const clear = () => {
    localStorage.removeItem('auth_token');
    router.visit('/admin/login');
};
const checkAuth = () => {
    let token = localStorage.getItem('auth_token');
    if (!token) clear();

    Request.get('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((r) => {
            fetchCategories();
            fetchProduct();
        })
        .catch(err => clear());
};
const fetchCategories = () => {
    Request.get('/api/categories')
        .then(r => {
            state.categories = r;
        })
}

const handleSubmit = (e) => {
    const fd = new FormData(e.target),
        token = localStorage.getItem('auth_token');

    if (!token) return;

    fd.append('_method', 'PATCH');

    Request.post(`/api/products/${props.product}`, fd, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(r => {
            router.visit('/admin/products');
        })
}

onMounted(() => {
    checkAuth();
})
</script>

<template>
    <div class="container static mx-auto px-4 py-8">

        <Link
            href="/admin/products"
            class="text-blue-500 hover:underline mb-4 inline-block"
        >
            Назад к списку
        </Link>

        <Transition name="fade">
            <Failed v-if="isFailed && isLoading">
                Данные о товаре №{{ props.product }} не найдена
            </Failed>
        </Transition>

        <Transition name="fade">
            <Loader v-if="!isFailed && isLoading" />
        </Transition>

        <div
            v-if="!isLoading && !isFailed"
            class="border rounded-lg p-6 shadow-lg"
        >
            <h1 class="text-3xl font-bold mb-8">{{ title }}</h1>


            <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Название</label>
                    <input
                        type="text"
                        name="name"
                        :value="state.data.name"
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
                        :value="state.data.price"
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
                        <template
                            v-for="el in state.categories"
                            :key="el.id"
                        >
                            <option
                                :value="el.id"
                                :selected="state.data.category_id === el.id"
                            >
                                {{ el.name }}
                            </option>
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
                        :value="state.data.description"
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
    </div>

</template>
