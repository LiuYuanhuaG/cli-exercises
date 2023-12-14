// lib/create.js

import { input, confirm } from '@inquirer/prompts'
import chalk from 'chalk'
// import { spawnSync } from 'child_process'
import * as commander from 'commander'
import spawn from 'cross-spawn'
import ejs from 'ejs'
import fs from 'fs'
import fse from 'fs-extra';
import ora from 'ora'
import path from 'path'
import { installDependencies, removeFileDir } from './utils.js'
import {getTemplates} from './http.js'
import downloadGitRepo  from 'download-git-repo'
const __dirname = path.resolve()
// 定义需要按照的依赖
const dependencies = ['vue', 'vuex', 'vue-router']


/**
 * 构建项目方法
 *
 */
async function build(name, option) {
    downloadGitRepo('https://api.github.com/repos/LiuYuanhuaG/vite-vue3-init')
    console.log(await getTemplates());
    return
    const { force } = option

    // 自定义文本信息
    const message = chalk.rgb(4, 156, 219).underline('正在创建。。。')
    // 初始化
    const spinner = ora(message)
    spinner.color = 'blue';

    // 模版文件目录
    const destUrl = path.join(__dirname, 'templates')
    // 生成文件目录
    // process.cwd() 对应控制台所在目录
    const cwdUrl = process.cwd()
    try {
        const files = fs.readdirSync(destUrl)

        let project = path.join(cwdUrl, `Text-${name}`)
        // 是否强制创建 -f
        if (force) {
            // path：要删除的文件夹路径
            if (fs.existsSync(project)) {
                await fse.remove(project)
                // removeFileDir(project)
            }
        } else {
            // 当 存在相同文件时询问 用户是否覆盖
            if (fs.existsSync(project)) {
                const isForce = await confirm({
                    message: '已存在文件是否覆盖',
                })
                if (isForce) {
                    await fse.remove(project)
                }
            }
        }
        spinner.start()
        // 创建文件夹
        fs.mkdirSync(project)
        await fse.copy(destUrl,project)
  

        spinner.stop() // 停止
        spinner.succeed(chalk.bgHex('#049CDB').bold('成功 ✔'))
        installDependencies(dependencies, project)
    } catch (error) {
        console.error(error)
        spinner.stop() // 停止
        spinner.fail(chalk.bgRgb(238, 89, 90, 0.1).bold(` 失败  \n ${error}`))
    }

}

export default build