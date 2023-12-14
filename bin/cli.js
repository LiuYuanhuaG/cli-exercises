#! /usr/bin/env node

import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import * as commander from 'commander'
import spawn from 'cross-spawn'
import ejs from 'ejs'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import build from './create.js'
import figlet from 'figlet'

const packages = JSON.parse(
	fs.readFileSync(
		new URL('../package.json', import.meta.url)
	)
)

const __dirname = path.resolve()
const program = new commander.Command()


program.command('create <name>')
	.description('项目构建命令。 它可以为你创建你的项目')
	// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
	.option('-f, --force', '为强制创建，如果创建的目录存在则直接覆盖(overwrite target directory if it exist)')
	.action(async (name, option) => {

		console.log(option);

		await build(name,option)
	})
program.version(`v${packages.version}`, '-v, --version', '查看当前版本').usage('<command> [option]')
program.helpOption('-h, --help','查看命令帮助')
program
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('liu', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 50,
      whitespaceBreak: true
    }));
    // 新增说明信息
    // console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
  })

program.parse(process.argv)
