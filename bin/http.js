import axios from 'axios';

axios.interceptors.response.use(res => res.data)

export async function getTemplates() {
    return await axios.get('https://api.github.com/repos/LiuYuanhuaG/vite-vue3-init/tags')
}


/**
 * 获取模板列表
 * @returns Promise
 */
 export  async function getRepoList() {
    // return axios.get('https://api.github.com/repos/LiuYuanhuaG/vite-vue3-init')
    return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
  }
  
  /**
   * 获取版本信息
   * @param {string} repo 模板名称
   * @returns Promise
   */
   export  async function  getTagList(repo) {
    // return axios.get(`https://api.github.com/repos/LiuYuanhuaG/${repo}/tags`)
    return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
  }
  
