<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Модальное окно'
    },
    content: {
        type: String,
        default: 'Содержимое модального окна'
    },
    closeOnBackdropClick: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close', 'confirm', 'update:isOpen'])
const dialogElement = ref(null)

const open = () => {
    if (dialogElement.value)
        dialogElement.value.showModal()
}

const close = () => {
    if (dialogElement.value)
        dialogElement.value.close()

    emit('close')
    emit('update:isOpen', false)
}

const confirm = () => {
    emit('confirm')
    close()
}

const handleClose = () => {
    emit('close')
    emit('update:isOpen', false)
}

const handleBackdropClick = (event) => {
    if (
        props.closeOnBackdropClick &&
        event.target === dialogElement.value
    ) close()
}

// Отслеживаем изменение isOpen
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        open()
    } else {
        close()
    }
}, { immediate: true })

onMounted(() => {
    if (dialogElement.value)
        dialogElement.value.addEventListener('click', handleBackdropClick)
})

onUnmounted(() => {
    if (dialogElement.value)
        dialogElement.value.removeEventListener('click', handleBackdropClick)
})
</script>

<template>
    <dialog
        ref="dialogElement"
        class="rounded-xl p-0 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm open:flex open:flex-col"
        :class="isOpen ? 'flex' : 'hidden'"
        @close="handleClose"
        style="  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
        <div class="bg-white rounded-xl w-full max-w-md flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
                <slot name="header">
                    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                </slot>
                <button
                    @click="close"
                    class="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="p-6">
                <slot name="body">
                    <p class="text-gray-600">{{ content }}</p>
                </slot>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 p-6 pt-0">
                <slot name="footer">
                    <button
                        @click="close"
                        class="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                        Отмена
                    </button>
                    <button
                        @click="confirm"
                        class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Подтвердить
                    </button>
                </slot>
            </div>
        </div>
    </dialog>
</template>
