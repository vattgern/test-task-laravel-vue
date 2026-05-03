import { reactive } from "vue";
import { router, usePage } from "@inertiajs/vue3";
import Request from "../Vendor/Request";

export function useProductApi() {
    const page = usePage();
    const state = reactive({
        categories: [],
        products: [],
        meta: {},

        errors: {},
        loading: false,
        failed: false,
        currentProduct: null
    });

    const getToken = () => {
        return localStorage.getItem('auth_token');
    }

    const getHeaders = () => {
        const token = getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {}
    }

    const fetchCategories = async () => {
        state.loading = true;
        state.failed = false;
        try {
            const response = await Request.get('/api/categories', {
                headers: getHeaders()
            })
            state.categories = response.data || response;
            return state.categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            state.failed = true;
            throw error
        } finally {
            state.loading = false;
        }
    }

    const fetchProducts = async (params = {}) => {
        state.loading = true;
        state.failed = false;
        try {
            const response = await Request.get('/api/products', {
                headers: getHeaders(),
                params
            })

            state.products = response.data;
            state.meta = response.meta;
            return state.products;
        } catch (error) {
            state.failed = true;
            console.error('Error fetching products:', error);
            throw error
        } finally {
            state.loading = false;
        }
    }

    const fetchProduct = async (id) => {
        state.loading = true;
        state.failed = false;
        try {
            const response = await Request.get(`/api/products/${id}`, {
                headers: getHeaders()
            })

            state.currentProduct = response.data || response;
            return state.currentProduct;
        } catch (error) {
            state.failed = true;
            console.error('Error fetching product:', error);
            throw error
        } finally {
            state.loading = false;
        }
    }

    const createProduct = async (formData) => {
        const token = getToken();
        if (!token) {
            router.visit('/admin/login');
            return false;
        }

        state.loading = true;
        state.errors = {};

        try {
            const response = await Request.post('/api/products', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            router.visit('/admin/products');
            return true;
        } catch (error) {
            if (error.response?.data?.errors)
                state.errors = error.response.data.errors;
            return false;
        } finally {
            state.loading = false;
        }
    }

    const updateProduct = async (id, formData) => {
        const token = getToken();
        if (!token) {
            router.visit('/admin/login');
            return false;
        }

        state.loading = true;
        state.errors = {};

        try {
            formData.append('_method', 'PATCH');

            const response = await Request.post(`/api/products/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            router.visit('/admin/products')
            return true;
        } catch (error) {
            if (error.response?.data?.errors)
                state.errors = error.response.data.errors
            return false
        } finally {
            state.loading = false;
        }
    }

    const restoreProduct = async (id) => {
        const token = getToken();
        if (!token) {
            router.visit('/admin/login');
            return false;
        }

        state.loading = true;

        try {
            await Request.post(`/api/products/${id}/restore`, {}, {
                headers: getHeaders()
            })

            return true;
        } catch (error) {
            console.error('Error restoring product:', error)
            return false
        } finally {
            state.loading = false;
        }
    }

    const deleteProduct = async (id) => {
        const token = getToken();
        if (!token) {
            router.visit('/admin/login');
            return false;
        }

        state.loading = true;

        try {
            await Request.delete(`/api/products/${id}`, {
                headers: getHeaders()
            })

            return true;
        } catch (error) {
            console.error('Error deleting product:', error)
            return false
        } finally {
            state.loading = false;
        }
    }

    const forceDeleteProduct = async (id) => {
        const token = getToken();
        if (!token) {
            router.visit('/admin/login');
            return false;
        }

        state.loading = true;

        try {
            await Request.delete(`/api/products/${id}/force`, {
                headers: getHeaders()
            })

            return true;
        } catch (error) {
            console.error('Error deleting product:', error)
            return false
        } finally {
            state.loading = false;
        }
    }

    const clearError = () => {
        state.errors = {};
    }

    const resetState = () => {
        state.categories = [];
        state.products = [];
        state.meta = {};
        state.errors = {};
        state.loading = false;
        state.failed = false;
        state.currentProduct = null;
    }

    return {
        state,

        fetchCategories,
        fetchProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        forceDeleteProduct,

        clearError,
        resetState,
        getToken
    }
}
