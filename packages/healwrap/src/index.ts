import {getLatestVersion, getPathList, getPkgInfo} from "./utils";
import {program} from "commander";
import logger from "./helpers/logger";
import * as chalk from "chalk";

const figlet = require("figlet");

// 显示LOGO和一些其他提示文字
program
  .description(
    `\r${figlet.textSync("hp-cli", {
      font: "3D-ASCII",
      horizontalLayout: "default",
      verticalLayout: "default",
      // width: 120,
      whitespaceBreak: true,
    })}
    \rRun ${chalk.cyan(
      "healwrap <command> --help"
    )} for detailed usage of given command.
    `
  )
  // .option('-v, --version', '显示版本号') // 不需要，使用version命令就会有这个option

async function printLastVersion(version: string, name: string) {
  const latestVersion = await getLatestVersion(name);
  if (latestVersion !== version) {
    logger.info(
      `当前包有最新版本，可更新版本，${chalk.green(version)} -> ${chalk.green(
        latestVersion
      )} \n执行npm install -g ${name}`
    );
  }
}

async function start() {
  // 获取所有命令
  const commandsPath = await getPathList("./commands/*.*s");

  // 注册命令
  commandsPath.forEach((commandPath) => {
    const commandObj = require(`./${commandPath}`);
    const {command, description, optionList, action} = commandObj.default;
    const curp = program
      .command(command)
      .description(description)
      .action(action);

    optionList &&
    optionList.map((option: [string]) => {
      curp.option(...option);
    });
  });

  const packageInfo = getPkgInfo();
  const {version, name} = packageInfo;

  // 配置版号，执行 --version显示版本
  program.version(version);

  program.on("command:*", async ([cmd]) => {
    program.outputHelp();
    logger.error(`未知命令 command ${chalk.yellow(cmd)}.`);
    await printLastVersion(version, name)
    process.exitCode = 1;
  });

  // 调用参数解析去匹配命令
  program.parseAsync(process.argv);
}

start();
