<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import PostForm from '@/components/PostForm.vue'
import api, { type Post } from '@/api'

const posts = ref<Post[]>([])
const loading = ref(false)
const showDialog = ref(false)
const currentPost = ref<Post | null>(null)

// 加载数据
const loadData = async () => {
    loading.value = true
    const response = await api.getPosts()
    posts.value = response
    loading.value = false
}

// 删除确认
const handleDelete = async (id: number) => {
    await ElMessageBox.confirm('确认删除该文章吗？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await api.deletePost(id)
    posts.value = posts.value.filter(post => post.id !== id)
}

// 打开编辑对话框
const openEdit = (post: Post) => {
    currentPost.value = post
    showDialog.value = true
}

onMounted(loadData)
</script>

<template>
    <div class="container">
        <div class="header">
            <h1>文章列表</h1>
            <el-button type="primary" @click="showDialog = true">新增文章</el-button>
        </div>

        <el-table v-loading="loading" :data="posts.slice(0, 10)">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip />
            <el-table-column prop="body" label="内容" width="180" show-overflow-tooltip />
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button size="small" @click="openEdit(row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="showDialog" :title="currentPost ? '编辑文章' : '新建文章'">
            <PostForm
                :edit-data="currentPost"
                @submit="
                    () => {
                        loadData()
                        showDialog = false
                        currentPost = null
                    }
                "
            />
        </el-dialog>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
</style>
