
import fs from 'fs'
import ora from 'ora'
import spawn from 'cross-spawn'
import chalk from 'chalk'

/**
 *循环删除文件
 *
 * @param {*} path
 */
export function removeFileDir(path) {
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
export function installDependencies(dependencies,path) {
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
           spinner.succeed(chalk.bgBlue(' 依赖安装成功'))
       }
       spinner.stop()
   })
}
