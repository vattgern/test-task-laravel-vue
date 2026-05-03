<script setup>
import { onMounted } from "vue";
import { useAuth } from "../../Composables/useAuth";
import AdminLayout from "../../Layouts/AdminLayout.vue";

const { checkAuth, logout } = useAuth();
onMounted(() => {
    checkAuth();
});
defineOptions({
    layout: AdminLayout
})
</script>

<template>

</template>
