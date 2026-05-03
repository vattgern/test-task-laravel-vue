<script setup>
import { router, Link } from "@inertiajs/vue3";
import { onMounted, ref, reactive } from "vue";
import { useAuth } from "../../../Composables/useAuth";
import { useProductApi } from "../../../Composables/useProductAPI";

import Loader from "../../../Components/Loader.vue";
import Product from "../../../Components/Product.vue";
import Modal from "../../../Components/Modal.vue";
import AdminLayout from "../../../Layouts/AdminLayout.vue";

const { state, fetchCategories, fetchProducts, deleteProduct } = useProductApi();
const { checkAuth } = useAuth();

const modalOpen = ref(false);
const modalData = ref(null);
const selectedCategory = ref('');

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
};

const handleRemove = (id) => {
    modalOpen.value = true;
    modalData.value = id;
}

const removeProduct = async () => {
    if (!modalData.value) return;

    const deleteId = modalData.value;
    modalOpen.value = false;

    const success = await deleteProduct(deleteId);
    if (success) await refreshProducts();
    modalData.value = null;
};

onMounted(async () => {
    await checkAuth();
    await Promise.all([
        fetchCategories(),
        fetchProducts()
    ]);
})
defineOptions({
    layout: AdminLayout
})
</script>

<template>
    <div class="container mx-auto px-4 py-8">

        <Transition name="fade">
            <Loader v-if="state.loading" />
        </Transition>

        <div class="w-full mb-6 flex flex-row justify-between items-center">
            <div>
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

            <Link
                class="w-fit h-fit cursor-pointer bg-blue-500 text-white rounded px-4 py-2"
                href="/admin/products/create"
            >
                Создать
                товар
            </Link>
        </div>

        <div
            v-if="state.products.length"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <Product
                v-for="el in state.products"
                :key="el.id"
                :data="el"
                :is-admin="true"
                @remove="handleRemove"
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

    <Modal
        v-model:is-open="modalOpen"
        title="Подтверждение действия"
        content="Вы уверены, что хотите удалить эту запись?"
        @confirm="removeProduct"
    />
</template>
