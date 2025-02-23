<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const form = ref({
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
})

const handleLogin = async () => {
    await userStore.loginUser(form.value)
    router.push('/posts')
}
</script>

<template>
    <div class="login-container">
        <h2>用户登录</h2>
        <el-input v-model="form.email" placeholder="请输入邮箱" />
        <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            style="margin: 20px 0"
        />
        <el-button type="primary" @click="handleLogin">立即登录</el-button>
        <p class="tip">使用测试账号直接登录</p>
    </div>
</template>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;
}

.tip {
    color: #666;
    font-size: 12px;
    margin-top: 15px;
}
</style>
