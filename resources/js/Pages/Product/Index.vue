<script setup>
import { Link } from "@inertiajs/vue3";
import Request from "../../Vendor/Request";
import { onMounted, ref, reactive } from "vue";
import Loader from "../../Components/Loader.vue";

const props = defineProps({
    product: [String, Number],
});

const isLoading = ref(true);
const isFailed = ref(false);
const state = reactive({
    data: {}
})

const fetchProduct = () => {
    isLoading.value = true;
    Request.get(`/api/products/${props.product}`)
        .then(r => {
            console.log(r);
            state.data = r.data;
            isLoading.value = false;
        })
        .catch((err) => {
            isFailed.value = true;
        })
};

onMounted(() => {
    fetchProduct();
});
</script>

<template>
    <div class="container static mx-auto px-4 py-8">

        <Transition name="fade">
            <Loader v-if="isLoading" />
        </Transition>

        <Link
            href="/"
            class="text-blue-500 hover:underline mb-4 inline-block"
        >
            Назад к списку
        </Link>

        <div
            v-if="!isLoading"
            class="border rounded-lg p-6 shadow-lg"
        >
            <h1 class="text-3xl font-bold mb-4">{{ state.data?.name }}</h1>
            <p class="text-gray-600 mb-2">{{ state.data?.category?.name }}</p>
            <p class="text-2xl font-bold text-green-600 mb-4">{{ state.data?.price }}</p>
            <p class="text-gray-700 leading-relaxed">{{ state.data?.description }}</p>
        </div>
    </div>
</template>
