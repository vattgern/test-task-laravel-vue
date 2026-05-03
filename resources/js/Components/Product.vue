<script setup>
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
const emits = defineEmits(['update', 'remove', 'restore', 'forceDelete']);
const update = (id) => {
    router.visit(`/admin/products/${id}/edit`);
};
const restore = (id) => {
    emits('restore', id);
}
const remove = (id) => {
    emits(props.data.deleted_at ? 'forceDelete' : 'remove', id);
};
</script>

<template>
    <div class="border rounded-lg p-4 shadow">
        <div class="flex justify-between items-start">
            <h2 class="text-xl font-semibold mb-2">{{ props.data.name }}</h2>

            <span
                v-if="props.isAdmin && props.data.deleted_at"
                class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
            >
                Удален
            </span>
        </div>
        <p class="text-gray-600 mb-2">{{ props.data.category.name }}</p>
        <p class="text-lg font-bold text-green-600 mb-2">{{ props.data.price }}</p>
        <p class="text-gray-700 mb-4">{{ props.data.description }}</p>

        <a
            class="text-blue-500 hover:underline"
            :href="`/product/${props.data.id}`"
            target="_blank"
        >
            Подробнее
        </a>

        <div
            v-if="props.isAdmin"
            class="w-100 flex flex-row gap-5 mt-3"
        >
            <button
                v-if="!props.data.deleted_at"
                class="cursor-pointer bg-orange-400 hover:bg-orange-600 text-white rounded px-4 py-2"
                @click="update(props.data.id)"
            >
                Редактировать
            </button>
            <button
                v-if="props.data.deleted_at"
                class="cursor-pointer bg-fuchsia-400 hover:bg-fuchsia-600 text-white rounded px-4 py-2"
                @click="restore(props.data.id)"
            >
                Восстановить
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
