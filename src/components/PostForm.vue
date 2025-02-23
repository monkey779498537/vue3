<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const props = defineProps<{
    editData?: {
        id: number
        title: string
        body: string
    } | null
}>()

const emit = defineEmits(['submit'])

const form = ref({
    title: '',
    body: ''
})

watch(
    () => props.editData,
    newVal => {
        if (newVal) {
            form.value = { title: newVal.title, body: newVal.body }
        } else {
            form.value = { title: '', body: '' }
        }
    }
)

const handleSubmit = async () => {
    try {
        if (props.editData) {
            await api.updatePost(props.editData.id, form.value)
            ElMessage.success('修改成功')
        } else {
            await api.createPost(form.value)
            ElMessage.success('创建成功')
        }
        emit('submit')
    } catch (error) {
        ElMessage.error('操作失败')
    }
}
</script>

<template>
    <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
            <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
            <el-input v-model="form.body" type="textarea" rows="4" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleSubmit">
                {{ editData ? '保存修改' : '立即创建' }}
            </el-button>
        </el-form-item>
    </el-form>
</template>
