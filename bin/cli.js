#! /usr/bin/env node

import { input } from '@inquirer/prompts'
import chalk from 'chalk'
// import { spawnSync } from 'child_process'
import * as commander from 'commander'
import spawn from 'cross-spawn'
import ejs from 'ejs'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
// import packages from '../package.json' assert { type: 'json' }

const packages = JSON.parse(
	fs.readFileSync(
		new URL('../package.json', import.meta.url)
	)
)

const __dirname = path.resolve()
const program = new commander.Command()
// 定义需要按照的依赖
const dependencies = ['vue', 'vuex', 'vue-router']

program.command('create <name>')
	.description('创建你的项目')
	// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
	.option('-f, --force', '为强制创建，如果创建的目录存在则直接覆盖(overwrite target directory if it exist)')

	// .option('-d, --debug', 'output extra debugging')
	// .option('-s, --small', 'small pizza size')
	// .option('-p, --pizza-type <type>', 'flavour of pizza')
	// .version(`v${packages.version}`)
	// .usage('<command> [option]')
	.action(async (name, option) => {
		const { force } = option
		if (force) {

		}
		console.log(option);
		// // 打印命令行输入的值
		// console.log('project name is ' + name, option)

		// // 文本样式
		// console.log('project name is ' + chalk.bold(name))

		// // 颜色
		// console.log('project name is ' + chalk.cyan(name))

		// // 背景色
		// console.log('project name is ' + chalk.bgRed(name))

		// // 使用RGB颜色输出

		// console.log('rgb.underline(name)  ' + chalk.rgb(4, 156, 219).underline(name))
		// console.log('hex.bold(name)   ' + chalk.hex('#049CDB').bold(name))
		// console.log('bgHex.bold(name)  ' + chalk.bgHex('#049CDB').bold(name))

		await build(option)
	})
program.version(`v${packages.version}`, '-v, --version', 'output extra debugging').usage('<command> [option]')

program.parse(process.argv)

/**
 * 构建项目方法
 *
 */
async function build(option) {
	const { force } = option
	const answer = await input({
		name: 'name',
		message: '请输入项目名称',
		default: 'my-node-cli',
	})

	// 自定义文本信息
	const message = chalk.rgb(4, 156, 219).underline('正在创建。。。')
	// 初始化
	const spinner = ora(message)
	spinner.color = 'red';    

	spinner.start()
	// 模版文件目录
	const destUrl = path.join(__dirname, 'templates')
	// 生成文件目录
	// process.cwd() 对应控制台所在目录
	const cwdUrl = process.cwd()
	try {
		const files = fs.readdirSync(destUrl)

		let project = path.join(cwdUrl, `Text-${answer}`)
		// 是否强制创建
		if (force) {
			// path：要删除的文件夹路径
			if (fs.existsSync(project)) {
				removeFileDir(project)
			}
		}

		// 创建文件夹
		fs.mkdirSync(project)
		files.forEach(async (file) => {
			console.log(file);
	
			ejs.renderFile(path.join(destUrl, file), {
				name: answer,
				content: '这个是内容填充测试',
			}).then((data) => {
				console.log(data);
				// 生成 ejs 处理后的模版文件
				fs.writeFileSync(path.join(project, file), data)
			})
			//   const data = fs.readFileSync(path.join(destUrl, file))
			//   fs.writeFileSync(path.join(project, file), data)
		})

		spinner.stop() // 停止
		spinner.succeed(chalk.bgHex('#049CDB').bold('成功 ✔'))
		installDependencies(dependencies,project)
	} catch (error) {
		console.error(error)
		spinner.stop() // 停止
		spinner.fail(' 失败 ✖')
	}

}

/**
 *循环删除文件
 *
 * @param {*} path
 */
function removeFileDir(path) {
	var files = fs.readdirSync(path)
	for (let item of files) {
		var stats = fs.statSync(`${path}/${item}`)
		if (stats.isDirectory()) {
			removeFileDir(`${path}/${item}`)
		} else {
			fs.unlinkSync(`${path}/${item}`)
		}
	}
	fs.rmdirSync(path)
}
/**
 *安装依赖
 *
 * @param {*} dependencies
 */
function installDependencies(dependencies,path) {
	const spinner = ora(chalk.bgBlue('正在安装依赖 '))
	const cmd = spawn('npm',[`install`].concat(dependencies),{
		cwd:path // 设置工作路径
	})

	spinner.start()
	// 监听执行结果
	cmd.on('close', function (code) {
		// 执行失败
		if (code !== 0) {
			process.exit(1)
			spinner.fail(chalk.bgRed(' 依赖安装失败 ✖ '))
		}
		// 执行成功
		else {
			spinner.succeed(chalk.bgRed(' 依赖安装成功'))
		}
		spinner.stop()
	})
}
