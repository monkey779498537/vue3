import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || ''
    }),
    actions: {
        async loginUser(credentials: { email: string; password: string }) {
            const { token } = await api.login(credentials)
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.token = ''
            localStorage.removeItem('token')
        }
    }
})
