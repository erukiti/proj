import { getArgv } from './get-argv'

const conf = {
  usage: 'Usage: $0 <subcommand> [args...]',
  global: {
    verbose: { default: false, desc: 'show verbose message', alias: 'v' },
    debug: { default: false, desc: 'show debug message' }
  },
  commands: {
    list: {},
    'register <archetypeName> [files...]': {},
    'diff <archetypeName> [files...]': {},
    'install <archetypeName> [files...]': {}
  }
}

export const cli = () => {
  getArgv(conf)
}
