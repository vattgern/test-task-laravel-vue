// APP
import { h, createApp } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import MainLayout from "./Layouts/MainLayout.vue";
// LIBRARIES
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";


createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
        const page = pages[`./Pages/${name}.vue`];

        // Добавьте проверку и логгирование
        if (!page) {
            console.error(`Page not found: ./Pages/${name}.vue`);
            throw new Error(`Page "${name}" not found`);
        }

        if (page && page.default) {
            page.default.layout = page.default.layout || MainLayout;
        }

        return page;
    },
    title: title => title ? `${title}` : 'Главная',
    setup({ el, App, props, plugin }) {
        const VueApp = createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(PrimeVue, {
                theme: {
                    preset: Aura
                }
            });

        VueApp.mount(el);
        return VueApp;
    },
});
