<script setup>
import { onMounted } from "vue";
import { Link } from "@inertiajs/vue3";
import { useAuth } from "../../../Composables/useAuth";
import { useProductApi } from "../../../Composables/useProductAPI";

import AdminLayout from "../../../Layouts/AdminLayout.vue";
import Loader from "../../../Components/Loader.vue";
import Failed from "../../../Components/Failed.vue";

const props = defineProps({
    product: [String, Number]
});

const { state, fetchCategories, fetchProduct, updateProduct } = useProductApi();
const { checkAuth } = useAuth();

const handleSubmit = (e) => {
    updateProduct(props.product, new FormData(e.target));
}

onMounted(() => {
    checkAuth();
    fetchCategories();
    fetchProduct(props.product);
});
defineOptions({
    layout: AdminLayout
});
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
            <Failed v-if="state.failed && !state.loading">
                Данные о товаре №{{ props.product }} не найдена
            </Failed>
        </Transition>

        <Transition name="fade">
            <Loader v-if="!state.failed && state.loading" />
        </Transition>

        <form
            v-if="!state.loading && !state.failed && state.currentProduct"
            @submit.prevent="handleSubmit"
        >
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Название</label>
                <input
                    type="text"
                    name="name"
                    :value="state.currentProduct.name"
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
                    :value="state.currentProduct.price"
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
                            :selected="state.currentProduct.category_id === el.id"
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
                    :value="state.currentProduct.description"
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
