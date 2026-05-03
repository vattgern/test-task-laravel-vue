import { ref } from "vue";
import { router } from "@inertiajs/vue3";
import Request from "../Vendor/Request";

export function useAuth() {
    const isAuth = ref(!!localStorage.getItem('auth_token')),
        user = ref(null);

    const clear = () => {
        localStorage.removeItem('auth_token');
        isAuth.value = false;
        user.value = null;
        router.visit('/admin/login');
    }

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            clear();
            return false;
        }

        try {
            const response = await Request.get('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            user.value = response.data;
            isAuth.value = true;

            return true;
        } catch (error) {
            clear();
            return false;
        }
    }

    const logout = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;

        try {
            await Request.get('/api/logout', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            clear();
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        isAuth,
        user,
        checkAuth,
        logout,
        clear
    }
}
