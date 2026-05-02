<script setup>
import { Link } from "@inertiajs/vue3";
import { onMounted, reactive, ref } from "vue";
import Request from "../Vendor/Request";
import Loader from "../Components/Loader.vue";
import Product from "../Components/Product.vue";

const isLoading = ref(false);
const selectedCategory = ref('');
const state = reactive({
    categories: [],
    products: [],
    meta: [],
    url: location.origin + "/api/products",
});

const fetchProducts = () => {
    isLoading.value = true;

    Request.get(state.url)
        .then((r) => {
            state.products = r.data;
            state.meta = r.meta;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const fetchCategories = () => {
    Request.get('/api/categories')
        .then(r => {
            state.categories = r;
        });
};

const handlePage = (v) => {
    if (!v.url) return;

    state.url = v.url;
    fetchProducts();
};

const handleCategory = () => {
    let url = new URL(state.url);
    if (selectedCategory.value === '') {
        url.searchParams.delete('category_id');
    } else if (url.searchParams.has('category_id')) {
        url.searchParams.set('category_id', selectedCategory.value);
    } else {
        url.searchParams.append('category_id', selectedCategory.value);
    }

    state.url = url.toString();
    fetchProducts();
};

onMounted(() => {
    fetchCategories();
    fetchProducts();
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">

        <Transition name="fade">
            <Loader v-if="isLoading" />
        </Transition>

        <h1 class="text-3xl font-bold mb-8">Каталог товаров</h1>

        <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Фильтр по категории</label>
            <select
                v-model="selectedCategory"
                class="border rounded-lg px-4 py-2 w-64"
                @change="handleCategory"
            >
                <option value="">Все категории</option>
                <template
                    v-for="el in state.categories"
                    :key="el.id"
                >
                    <option :value="el.id">{{ el.name }}</option>
                </template>
            </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Product
                v-for="el in state.products"
                :key="el.id"
                :data="el"
            />
        </div>

        <div class="mt-8">
            <div class="flex justify-center gap-2">
                <button
                    v-for="(el, index) in state.meta.links"
                    :key="index"
                    @click="handlePage(el)"
                    class="px-3 py-1 border rounded"
                    :class="{ 'bg-blue-500 text-white': el.active }"
                    v-html="el.label"
                />
            </div>
        </div>
    </div>
</template>
