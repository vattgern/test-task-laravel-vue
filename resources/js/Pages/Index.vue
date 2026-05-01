<script setup>
import { onMounted, reactive, ref } from "vue";
import Request from "../Vendor/Request";

const isLoading = ref(false);
const state = reactive({
    products: [],
    meta: [],
    currentPage: null,
});
const fetchProducts = () => {
    isLoading.value = true;

    let url = new URL(location.origin + "/api/products");
    if (state.currentPage) {
        url.searchParams.append("page", state.currentPage);
    }
    Request.get(url)
        .then((r) => {
            state.products = r.data;
            state.meta = r.meta;
            console.log(state.meta);
        })
        .finally(() => {
            isLoading.value = false;
        });
};
const handleCurrentPage = (v) => {
    state.currentPage = v;
    fetchProducts();
};

onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <el-table
        v-loading="isLoading"
        :data="state.products"
        table-layout="fixed"
        stripe
        height="600"
    >
        <el-table-column
            prop="id"
            label="№"
            width="40"
        />
        <el-table-column
            prop="name"
            label="Название"
            width="auto"
        />
        <el-table-column
            prop="description"
            label="Описание"
            width="auto"
        />
        <el-table-column
            prop="price"
            label="Цена"
            width="auto"
        />
        <el-table-column
            prop="category.name"
            label="Категория"
            width="auto"
        />
        <el-table-column
            prop="created_at"
            label="Дата создания"
            width="auto"
        />
        <el-table-column
            prop="updated_at"
            label="Дата редактирования"
            width="auto"
        />
        <el-table-column
            label="Действия"
            align="right"
        >
            <el-button size="small">
                Show
            </el-button>
            <el-button size="small">
                Edit
            </el-button>
            <el-button
                size="small"
                type="danger"
            >
                Delete
            </el-button>
        </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="state.meta.total"
        :page-size="state.meta.per_page"
        :current-page="state.meta.current_page"
        @update:page-size="(v) => state.meta.per_page = v"
        @update:current-page="handleCurrentPage"
        style="margin-top: 20px;"
    />
</template>

<style></style>
