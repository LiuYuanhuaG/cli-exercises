#! /usr/bin/env node

import { input } from "@inquirer/prompts"
import chalk from "chalk"
import * as commander from "commander"
import spawn from "cross-spawn"
import ejs from "ejs"
import fs from "fs"
import ora from "ora"
import path from "path"
const __dirname = path.resolve()
const program = new commander.Command()
// 定义需要按照的依赖
const dependencies = ["vue", "vuex", "vue-router"]

program
  .option("-d, --debug", "output extra debugging")
  .option("-s, --small", "small pizza size")
  .option("-p, --pizza-type <type>", "flavour of pizza")
  .version("0.1.0")
  .command("create <name>")
  .description("创建你的项目")
  .action(async (name) => {
    // 打印命令行输入的值
    console.log("project name is " + name)

    // 文本样式
    console.log("project name is " + chalk.bold(name))

    // 颜色
    console.log("project name is " + chalk.cyan(name))

    // 背景色
    console.log("project name is " + chalk.bgRed(name))

    // 使用RGB颜色输出

    console.log("project name is " + chalk.rgb(4, 156, 219).underline(name))
    console.log("project name is " + chalk.hex("#049CDB").bold(name))
    console.log("project name is " + chalk.bgHex("#049CDB").bold(name))

    await build()
    await installDependencies(dependencies)
  })

program.parse()
// const options = program.opts()
// if (options.debug) console.log(options)
// console.log("pizza details:")
// if (options.small) console.log("- small pizza size")
// if (options.pizzaType) console.log(`- ${options.pizzaType}`)

/**
 * 构建项目方法
 *
 */
async function build() {
  const answer = await input({
    name: "name",
    message: "请输入项目名称",
    default: "my-node-cli",
  })

  // 自定义文本信息
  const message = chalk.rgb(4, 156, 219).underline("正在创建。。。")
  // 初始化
  const spinner = ora(message)
  spinner.start()
  // 模版文件目录
  const destUrl = path.join(__dirname, "templates")
  // 生成文件目录
  // process.cwd() 对应控制台所在目录
  const cwdUrl = process.cwd()
  try {
    const files = fs.readdirSync(destUrl)
    console.log(answer, "answer")
    let project = path.join(cwdUrl, `Text-${answer}`)
    // path：要删除的文件夹路径
    if (fs.existsSync(project)) {
      removeFileDir(project)
    }
    // 创建文件夹
    fs.mkdirSync(project)
    files.forEach(async (file) => {
      ejs
        .renderFile(path.join(destUrl, file), {
          name: answer,
          content: "这个是内容填充测试",
        })
        .then((data) => {
          // 生成 ejs 处理后的模版文件
          fs.writeFileSync(path.join(project, file), data)
        })
      //   const data = fs.readFileSync(path.join(destUrl, file))
      //   fs.writeFileSync(path.join(project, file), data)
    })

    spinner.stop() // 停止
    spinner.succeed(chalk.bgHex("#049CDB").bold("成功 ✔"))
  } catch (error) {
    console.error(error)
    spinner.stop() // 停止
    spinner.fail(" 失败 ✖")
  }

  console.log("my-node-cli working~", answer, destUrl, cwdUrl)
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

function installDependencies(dependencies) {
  const spinner = ora(chalk.bgBlue("正在安装依赖 "))
  // 执行安装
  const child = spawn("npm", ["install", "-D"].concat(dependencies), {
    stdio: "inherit",
  })
  spinner.start()
  // 监听执行结果
  child.on("close", function (code) {
    // 执行失败
    if (code !== 0) {
      process.exit(1)
      spinner.fail(chalk.bgRed(" 安装失败 ✖ "))
    }
    // 执行成功
    else {
      spinner.succeed(chalk.bgRed(" 安装成功"))
    }
    spinner.stop()
  })
}
