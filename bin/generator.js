// lib/Generator.js

import downloadGitRepo from 'download-git-repo'
import util from 'util'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk';
import { rawlist, select } from '@inquirer/prompts'
import { getRepoList, getTagList } from './http.js'
// const downloadGitRepo = require('download-git-repo') // 不支持 Promise
import child_process from 'child_process';
const { spawn, exec } = child_process
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();

    try {
        // console.log(args);
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
            value: 'https://github.com/LiuYuanhuaG/vite-vue3-init.git',
            description: chalk.blue('github仓库源,vite+v3 的基础模板'),
        }, {
            name: 'vite-react',
            value: 'https://github.com/LiuYuanhuaG/vite-vue3-init.git',
            description: chalk.blue('github仓库源,vite+react 的基础模板'),
        },]
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        // 对 download-git-repo 进行 promise 化改造
        this.downloadCmd = (requestUrl) => {
            return new Promise((res, reg) => {
                exec(requestUrl, {}, function (error, stdout, stderr) {
                    if (error) {
                        console.log(chalk.red(error));
                    }
                    res(error)
                })
            })
        }

    }


    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, dir) {
        const requestUrl = 'git clone ' + repo + ' ' + this.name;

        // 2）调用下载方法
        await wrapLoading(
            this.downloadCmd, // 远程下载方法
            '正在下载模板', // 加载提示信息
            requestUrl, // 参数1: 下载地址
        ) 
    }

    async getRepo() {
        // 1）从远程拉取模板数据
        // 2）用户选择自己新下载的模板名称
        const repo = await select({
            name: 'repo',
            choices: this.template,
            message: '请选择想要下载的模板\n  Please choose a template to create project  =>>>>> '
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

        const tempSource = await select({
            name: 'tempSource',
            choices: [
                {
                    name: "自定模板来源",
                    value: 'custom',
                    description: chalk.blue('您可以提供所需下载的模板仓库地址以供下载'),
                },
                {
                    name: "内置仓库模板源GitHub",
                    value: 'gitHub',
                    description: chalk.blue('脚手架的仓库模板源--GitHub'),
                },
                {
                    name: "内置仓库模板源Gitee",
                    value: 'gitee',
                    description: chalk.blue('脚手架的仓库模板源--gitee'),
                },
            ],
            message: '请选择下载模板源\n  Please select the download template source  =>>>>> '
        })
        let source = []
        if (tempSource == 'custom') {

        }
        if (tempSource == 'gitHub') {
            const repo = await this.getRepo()
            await this.download(repo)
        }
        if (tempSource == 'gitee') {
            const repo = await this.getRepo()
        }
        // 1）获取模板名称

        // console.log(repo, 'repo');
        // 2) 获取 tag 名称
        // const tag = await this.getTag(repo)

        // 3）下载模板到模板目录
        // await this.download(repo, 'tag')

        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }
};
