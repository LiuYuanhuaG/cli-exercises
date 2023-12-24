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
import { getTemplates } from './http.js'
import util from 'util'
import Generator from './generator.js'
const __dirname = path.resolve()
// 定义需要按照的依赖
const dependencies = ['vue', 'vuex', 'vue-router']


/**
 * 构建项目方法
 *
 */
async function build(name, option) {
   
    // 当前命令行选择的目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name)
    if (fs.existsSync(targetAir)) {
        await fse.remove(targetAir)
        // removeFileDir(project)
    }
    // 创建项目
    const generator = new Generator(name, targetAir);

    // 开始创建项目
    generator.create()
  

}

export default build