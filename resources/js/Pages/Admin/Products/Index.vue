<script setup>
import { router, Link } from "@inertiajs/vue3";
import { onMounted, ref, reactive } from "vue";
import { useAuth } from "../../../Composables/useAuth";
import { useProductApi } from "../../../Composables/useProductAPI";

import Loader from "../../../Components/Loader.vue";
import Product from "../../../Components/Product.vue";
import Modal from "../../../Components/Modal.vue";
import AdminLayout from "../../../Layouts/AdminLayout.vue";

const { state, fetchCategories, fetchProducts, deleteProduct, restoreProduct, forceDeleteProduct } = useProductApi();
const { checkAuth } = useAuth();

const modalDeleteOpen = ref(false);
const modalForceDeleteOpen = ref(false);
const modalData = ref(null);
const selectedCategory = ref('');
const withTrashed = ref(false);

const getCurrentParams = () => {
    let params = {};
    if (selectedCategory.value !== '')
        params.category_id = selectedCategory.value;
    if (state.meta?.current_page)
        params.page = state.meta.current_page;
    params.trashed = withTrashed.value;

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
    params.trashed = withTrashed.value;
    params.page = v.page;

    await fetchProducts(params);
}

const handleCategory = async () => {
    let params = {};
    if (selectedCategory.value !== '')
        params.category_id = selectedCategory.value;
    params.page = 1;
    params.trashed = withTrashed.value;

    await fetchProducts(params);
};

const handleRemove = (id) => {
    modalDeleteOpen.value = true;
    modalData.value = id;
}

const handleForceRemove = (id) => {
    modalForceDeleteOpen.value = true;
    modalData.value = id;
}

const handleRestore = async (id) => {
    const success = await restoreProduct(id);
    if (success) await refreshProducts();
};

const forceRemoveProduct = async () => {
    if (!modalData.value) return;

    const deleteId = modalData.value;
    modalForceDeleteOpen.value = false;

    const success = await forceDeleteProduct(deleteId);
    if (success) await refreshProducts();
    modalData.value = null;
}

const removeProduct = async () => {
    if (!modalData.value) return;

    const deleteId = modalData.value;
    modalDeleteOpen.value = false;

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
            <div class="flex flex-row gap-10">
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

                <label class="cursor-pointer flex flex-row items-center space-x-3">
                    <span class="block text-sm font-medium mb-2">С корзиной</span>
                    <input
                        type="checkbox"
                        v-model="withTrashed"
                        class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        @change="refreshProducts"
                    />
                </label>
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
                @restore="handleRestore"
                @force-delete="handleForceRemove"
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
        v-model:is-open="modalDeleteOpen"
        title="Подтверждение действия"
        content="Вы уверены, что хотите удалить эту запись?"
        @confirm="removeProduct"
    />
    <Modal
        v-model:is-open="modalForceDeleteOpen"
        title="Подтверждение действия"
        content="Вы уверены, что хотите полностью удалить эту запись?"
        @confirm="forceRemoveProduct"
    />
</template>
