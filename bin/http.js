import chalk from 'chalk';
// 获取默认模板仓库列表
export function getBaseTemp(type) {
    let tempList = []
    if (type == 'gitHub') {
        tempList = [{
            name: 'vite-vue3',
            value: 'https://github.com/LiuYuanhuaG/vite-vue3-init.git',
            description: chalk.blue('github仓库源,vite+v3 的基础模板'),
        }, {
            name: 'vite-react',
            value: 'https://github.com/LiuYuanhuaG/vite-react-init.git',
            description: chalk.blue('github仓库源,vite+react 的基础模板'),
        },]
    }
    if (type == 'gitee') {
        tempList = [{
            name: 'vite-vue3',
            value: 'https://gitee.com/begonia-macrophylla/vite-vue3-init.git',
            description: chalk.blue('gitee仓库源,vite+v3 的基础模板'),
        }, {
            name: 'vite-react',
            value: 'https://gitee.com/begonia-macrophylla/vite-react-init.git',
            description: chalk.blue('gitee仓库源,vite+react 的基础模板'),
        },]
    }
    return tempList
}