<script setup>
import { Link, router } from "@inertiajs/vue3";
import { onMounted } from "vue";
import Request from "../../Vendor/Request";

const clear = () => {
    localStorage.removeItem('auth_token');
    router.visit('/admin/login');
};
const checkAuth = () => {
    let token = localStorage.getItem('auth_token');
    if (!token) clear();

    Request.get('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .catch(err => clear());
};
const logout = () => {
    let token = localStorage.getItem('auth_token');
    if (!token) return false;

    Request.get('/api/logout', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(r => clear());
};
onMounted(() => {
    checkAuth();
});
</script>

<template>
    <div class="container h-screen border flex flex-col justify-center items-center">
        <Link
            href="/admin/products"
            class="text-blue-500 hover:underline"
        >Управление товарами</Link>
        <Link
            href="/"
            class="text-blue-500 hover:underline"
            @click.prevent="logout"
        >Выйти</Link>
    </div>

</template>
