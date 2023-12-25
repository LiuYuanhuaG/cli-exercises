// lib/Generator.js

import downloadGitRepo from 'download-git-repo'
import util from 'util'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk';
import { rawlist, select, input } from '@inquirer/prompts'
import {  getBaseTemp } from './http.js'
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
            '正在下载模板, 请稍后。。。\n', // 加载提示信息
            requestUrl, // 参数1: 下载地址
        )
    }

    async getRepo(templateList) {
        // 1）从远程拉取模板数据
        // 2）用户选择自己新下载的模板名称
        const repo = await select({
            name: 'repo',
            choices: templateList,
            message: '请选择想要下载的模板\n  Please choose a template to create project  =>>>>> '
        })

        // 3）return 用户选择的名称
        return repo;
    }

    // 核心创建逻辑
    // 1）获取模板名称
    // 2）获取 tag 名称
    // 3）下载模板到模板目录
    // 4）模板使用提示
    async create() {
        // 下载地址
        let url = ''
        // 模板列表
        let templateList = []
        // 询问模板来源
        const tempSource = await select({
            name: 'tempSource',
            choices: [
                {
                    name: "自定模板来源",
                    value: 'custom',
                    description: chalk.blue('  您可以提供所需下载的模板仓库地址以供下载'),
                },
                {
                    name: "内置仓库模板源GitHub",
                    value: 'gitHub',
                    description: chalk.blue('  脚手架的仓库模板源--GitHub'),
                },
                {
                    name: "内置仓库模板源Gitee",
                    value: 'gitee',
                    description: chalk.blue('  脚手架的仓库模板源--gitee'),
                },
            ],
            message: '请选择下载模板源\n  Please select the download template source  =>>>>> '
        })
        // 自定义源
        if (tempSource == 'custom') {
            const _source = await input({
                message: '请输入您想要下载模板地址   =>>>>>',
            })
            const branch = await input({
                message: '请输入您想要下载模板分支  ' + chalk.yellow('默认为当前主分支') + '  =>>>>>',
            })
            url = '-b ' + `${branch} ` + _source
        }
        // 内置模板源
        if (['gitee', 'gitHub'].includes(tempSource)) {
            templateList = getBaseTemp(tempSource)
            url = await this.getRepo(templateList)
        }


        await this.download(url)
        // 4）模板使用提示
        console.log(`\r\n已成功创建项目(Successfully created project) ${chalk.cyan(this.name)}`)
        console.log(`可以运行以下命令`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }
};
