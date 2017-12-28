import * as path from 'path'

export const getArgv = config => {
  const yargs = require('yargs')

  let args = yargs
    .detectLocale(false)
    .version()
    .help()
    .wrap(yargs.terminalWidth())

  if (config.usage) {
    args = args.usage(config.usage)
  }

  if (config.global) {
    args = args.options(config.global)
  }

  if (config.commands) {
    Object.keys(config.commands).forEach(command => {
      const name = command.split(' ')[0]
      const cmd = config.commands[command]
      const describe = cmd.describe || cmd.desc || ''

      const builder = yargs2 => {
        Object.keys(config.global).forEach(key => {
          const opt = JSON.parse(JSON.stringify(config.global[key]))
          if ('default' in opt && !('type' in opt)) {
            opt.type = typeof opt.default
          }
          yargs2 = yargs2.option(key, opt)
        })
      }

      const handler = argv => {
        Object.keys(config.global).forEach(key => {
          const globalOptionHandler = config.global[key].handler || (() => {})
          globalOptionHandler(argv[key])
        })
        let module = require(`./${name}`)
        if ('default' in module) {
          module = module.default
        }
        module(argv)
      }
      args = args.command({ command, describe, builder, handler })
    })
    args = args.demandCommand(1)
  }
  return args.argv
}
