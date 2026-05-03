<script setup>
import { Link } from "@inertiajs/vue3";
import { onMounted, reactive, ref } from "vue";
import { useProductApi } from "../Composables/useProductApi";
import Loader from "../Components/Loader.vue";
import Product from "../Components/Product.vue";

const selectedCategory = ref('');
const { state, fetchCategories, fetchProducts } = useProductApi();

const getCurrentParams = () => {
    let params = {};
    if (selectedCategory.value !== '')
        params.category_id = selectedCategory.value;
    if (state.meta?.current_page)
        params.page = state.meta.current_page;
    return params;
}

const refreshProducts = async () => {
    let params = getCurrentParams();

    await fetchProducts(params);

    if (state.products.length === 0 && params.page > 1) {
        params.page--;
        await fetchProducts(params);
    }
}

const handlePage = async (v) => {
    if (!v.url) return;

    let params = {};
    if (selectedCategory.value !== '')
        params.category_id = selectedCategory.value;
    params.page = v.page;

    await fetchProducts(params);
}

const handleCategory = async () => {
    let params = {};
    if (selectedCategory.value !== '')
        params.category_id = selectedCategory.value;
    params.page = 1;

    await fetchProducts(params);
}

onMounted(async () => {
    await Promise.all([
        fetchCategories(),
        fetchProducts()
    ]);
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">

        <Transition name="fade">
            <Loader v-if="state.loading" />
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

        <div
            v-if="state.products.length"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <Product
                v-for="el in state.products"
                :key="el.id"
                :data="el"
            />
        </div>
        <div v-else>
            <p class="text-center">Ничего не найдено</p>
        </div>

        <div class="mt-8">
            <div class="flex justify-center gap-2">
                <button
                    v-for="(el, index) in state.meta.links"
                    :key="index"
                    @click="handlePage(el)"
                    class="cursor-pointer px-3 py-1 border rounded"
                    :class="{ 'bg-blue-500 text-white': el.active }"
                    v-html="el.label"
                />
            </div>
        </div>
    </div>
</template>
