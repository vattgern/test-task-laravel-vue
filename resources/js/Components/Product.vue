<script setup>
import { defineEmits } from "vue";
import { Link, router } from "@inertiajs/vue3";
import Request from "../Vendor/Request";

const props = defineProps({
    isAdmin: {
        type: Boolean,
        default: false
    },
    data: {
        type: Object,
        required: true
    }
});
const emits = defineEmits(['update', 'remove']);
const update = (id) => {
    router.visit(`/admin/prodcuts/${id}/edit`);
};
const remove = (id) => {

    emits('remove', id);

    // let token = localStorage.getItem('auth_token');
    // if (!token) return;

    // Request.delete(`/api/products/${id}`, {
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // })
    //     .then(r => {
    //         emits('update');
    //     });
};
</script>

<template>
    <div class="border rounded-lg p-4 shadow">
        <h2 class="text-xl font-semibold mb-2">{{ props.data.name }}</h2>
        <p class="text-gray-600 mb-2">{{ props.data.category.name }}</p>
        <p class="text-lg font-bold text-green-600 mb-2">{{ props.data.price }}</p>
        <p class="text-gray-700 mb-4">{{ props.data.description }}</p>

        <Link
            class="text-blue-500 hover:underline"
            :href="`/product/${props.data.id}`"
        >
            Подробнее
        </Link>

        <div
            v-if="props.isAdmin"
            class="w-100 flex flex-row gap-5 mt-3"
        >
            <button
                class="cursor-pointer bg-orange-400 hover:bg-orange-600 text-white rounded px-4 py-2"
                @click="update(props.data.id)"
            >
                Редактировать
            </button>
            <button
                class="cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded px-4 py-2"
                @click="remove(props.data.id)"
            >
                Удалить
            </button>
        </div>
    </div>
</template>
