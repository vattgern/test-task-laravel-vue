<script setup>
import { onMounted, computed } from "vue";
import { Link } from "@inertiajs/vue3";
import { useProductApi } from "../../Composables/useProductApi";

import Loader from "../../Components/Loader.vue";
import Failed from "../../Components/Failed.vue";

const props = defineProps({
    product: [String, Number],
});
const { state, fetchProduct } = useProductApi();

const price = computed(() => {
    if (!state.currentProduct || !state.currentProduct.price) return '';

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(state.currentProduct.price);
});

onMounted(async () => {
    await fetchProduct(props.product);
});
</script>

<template>
    <div class="container static mx-auto px-4 py-8">

        <Link
            href="/"
            class="text-blue-500 hover:underline mb-4 inline-block"
        >
            Назад к списку
        </Link>

        <Transition name="fade">
            <Loader v-if="state.loading && !state.failed" />
        </Transition>

        <Transition name="fade">
            <Failed v-if="state.failed && !state.loading">
                Данные о товаре №{{ props.product }} не найдена
            </Failed>
        </Transition>

        <div
            v-if="!state.loading && !state.failed"
            class="border rounded-lg p-6 shadow-lg"
        >
            <h1 class="text-3xl font-bold mb-4">{{ state.currentProduct?.name }}</h1>
            <p class="text-gray-600 mb-2">{{ state.currentProduct?.category?.name }}</p>
            <p class="text-2xl font-bold text-green-600 mb-4">{{ price }}</p>
            <p class="text-gray-700 leading-relaxed">{{ state.currentProduct?.description }}</p>
        </div>
    </div>
</template>
