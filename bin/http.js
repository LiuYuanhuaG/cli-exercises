import axios from 'axios';

axios.interceptors.response.use(res => res.data)

export async function getTemplates() {
    return await axios.get('https://api.github.com/repos/LiuYuanhuaG/vite-vue3-init')
}
