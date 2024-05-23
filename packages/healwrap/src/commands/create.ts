import * as path from "path";
import {checkMkdirExists, copyTemplate} from "../utils/copy";
import {install} from "../utils/manager";
import {inquirerPrompt} from '../utils/inquirer'
import {Logger} from "../helpers/logger";
import spinner from "../helpers/spinner";

const logger = new Logger()

function action(name: string) {
  logger.warn(name)

  try {
    inquirerPrompt(name)
      .then((answers: any) => {
        console.log(answers)

        const {name, type} = answers;
        const isMkdirExists = checkMkdirExists(
          path.resolve(process.cwd(), `./src/pages/${name}/index.js`)
        );
        if (isMkdirExists) {
          console.log(`${name}/index.js文件已经存在`)
        } else {
          copyTemplate(
            path.resolve(__dirname, `../../template/${type}/index.tpl`),
            path.resolve(process.cwd(), `./src/pages/${name}/index.js`),
            {
              name,
            }
          )
          install(process.cwd(), answers);
        }
      })
  } catch (e) {
    spinner.fail(e)
    return
  }
}

export default {
  command: "create <name>",
  description: "创建模板",
  optionList: [
    ["--context <context>", "上下文路径(新建文件路径)"],
    ["--template <template>", "选择哪个模版"],
  ],
  action,
};
