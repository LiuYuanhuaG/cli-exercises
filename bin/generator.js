// lib/Generator.js

import downloadGitRepo from 'download-git-repo'
import util from 'util'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk';
import { rawlist } from '@inquirer/prompts'
import { getRepoList, getTagList } from './http.js'
// const downloadGitRepo = require('download-git-repo') // 不支持 Promise
import child_process from 'child_process';
const { spawn } = child_process
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();

    try {
        console.log(args);
        // 执行传入方法 fn
        const result = await fn(...args);

        // 状态为修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        console.log(error);
        // 状态为修改为失败
        spinner.fail('Request failed, refetch ...')
    }

}

export default class Generator {
    constructor(name, targetDir) {
        this.template = [{
            name: 'vite-vue3',
            value: 'https://github.com/LiuYuanhuaG/vite-vue3-init.git#master'
        }, {
            name: 'vite-react',
            value: 'https://github.com/LiuYuanhuaG/vite-vue3-init.git#master'
        },]
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        // 对 download-git-repo 进行 promise 化改造
        this.downloadGitRepo = util.promisify(downloadGitRepo);

    }


    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag) {

        // 1）拼接下载地址
        const requestUrl = `direct: ${repo}`;

        // 2）调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            this.targetDir, { clone: true }) // 参数2: 创建位置
    }

    async getRepo() {
        // 1）从远程拉取模板数据
        // const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
        // if (!repoList) return;
        // console.log(repoList,'sdsdsa');
        // // 过滤我们需要的模板名称
        // const repos = this.template.map(item => ({name:item.name,value:item.name}));

        // 2）用户选择自己新下载的模板名称
        const repo = await rawlist({
            name: 'repo',
            choices: this.template,
            message: '请选择想要下载的模板\t Please choose a template to create project'
        })

        // 3）return 用户选择的名称
        return repo;
    }

    // 获取用户选择的版本
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    // 2）用户选择自己需要下载的 tag
    // 3）return 用户选择的 tag

    async getTag(repo) {
        // 1）基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
        if (!tags) return;

        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => ({ name: item.name, value: item.name }));
        console.log(tagsList, tags, 'tagsList');
        // 2）用户选择自己需要下载的 tag
        const { tag } = await rawlist({
            name: 'tag',
            choices: tagsList,
            message: 'Place choose a tag to create project'
        })

        // 3）return 用户选择的 tag
        return tag
    }



    // 核心创建逻辑
    // 1）获取模板名称
    // 2）获取 tag 名称
    // 3）下载模板到模板目录
    // 4）模板使用提示
    async create() {

        // 1）获取模板名称
        const repo = await this.getRepo()
        console.log(repo, 'repo');
        // 2) 获取 tag 名称
        // const tag = await this.getTag(repo)

        // 3）下载模板到模板目录
        await this.download(repo, 'tag')

        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }
};
