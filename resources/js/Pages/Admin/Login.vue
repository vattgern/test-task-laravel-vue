<script setup>
import { router } from "@inertiajs/vue3";
import { reactive, onMounted } from "vue";
import Request from "../../Vendor/Request";

const state = reactive({
    errors: {}
});

const checkAuth = () => {
    let token = localStorage.getItem('auth_token');
    if (!token) return false;

    Request.get('/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(r => {
            router.visit('/admin');
        });
}

const handleLogin = (e) => {
    const fd = new FormData(e.target);

    Request.post('/api/login', fd)
        .then(r => {
            state.errors = {};
            localStorage.setItem('auth_token', r.token);
            router.visit('/admin');
        })
        .catch(err => {
            if (err.response.data && err.response.data.errors)
                state.errors = err.response.data.errors;
        })
};
onMounted(() => {
    checkAuth();
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-6">Вход в админ-панель</h2>

            <form @submit.prevent="handleLogin">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Логин</label>
                    <input
                        type="text"
                        name="login"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 mb-2"
                        required
                    />
                    <p class="text-sm text-red-500">
                        <span
                            v-for="(err, index) in state.errors.login"
                            :key="index"
                            v-html="err"
                        />
                    </p>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-2">Пароль</label>
                    <input
                        type="password"
                        name="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 mb-2"
                        required
                    />
                    <p class="text-sm text-red-500">
                        <span
                            v-for="(err, index) in state.errors.password"
                            :key="index"
                            v-html="err"
                        />
                    </p>
                </div>

                <button
                    type="submit"
                    class="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-500"
                >
                    Войти
                </button>
            </form>
        </div>
    </div>
</template>
