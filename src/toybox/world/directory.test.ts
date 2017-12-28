import { Directory, read, write } from './directory'

describe('read', () => {
  it('read file', () => {
    const dir: Directory = {
      'hoge.txt': 'hoge'
    }
    const { error, files, content } = read(dir, 'hoge.txt')
    expect(error).toBeUndefined()
    expect(files).toBeUndefined()
    expect(content).toEqual('hoge')
  })

  it('read directory', () => {
    const dir: Directory = {
      hoge: {
        'fuga.txt': 'fuga'
      }
    }
    const { error, files, content } = read(dir, 'hoge')
    expect(error).toBeUndefined()
    expect(files).toEqual(['fuga.txt'])
    expect(content).toBeUndefined()
  })

  it('file is not found', () => {
    const dir: Directory = {
      'wrong.txt': 'wrong'
    }
    const { error, files, content } = read(dir, 'hoge.txt')
    expect(error).toEqual({ code: 'NOT_FOUND', message: 'hoge.txt is not found.' })
    expect(files).toBeUndefined()
    expect(content).toBeUndefined()
  })

  it('file is not directory', () => {
    const dir: Directory = {
      hoge: {
        fuga: 'fuga'
      }
    }
    const { error, files, content } = read(dir, 'hoge/fuga/hoge.txt')
    expect(error).toEqual({ code: 'NOT_DIRECTORY', message: 'fuga is not directory.' })
    expect(files).toBeUndefined()
    expect(content).toBeUndefined()
  })

  it('file is not found (directory)', () => {
    const dir: Directory = {
      hoge: {
        wrong: {
          fuga: 'fuga'
        }
      }
    }
    const { error, files, content } = read(dir, 'hoge/fuga/hoge.txt')
    expect(error).toEqual({ code: 'NOT_FOUND', message: 'fuga is not found.' })
    expect(files).toBeUndefined()
    expect(content).toBeUndefined()
  })
})

describe('write', () => {
  it('normal file', () => {
    const dir: Directory = {}
    const { error } = write(dir, 'hoge.txt', 'hoge')
    expect(error).toBeUndefined()
    expect(dir).toEqual({ 'hoge.txt': 'hoge' })
  })

  it('normal file with directory', () => {
    const dir: Directory = {}
    const { error } = write(dir, 'hoge/fuga.txt', 'fuga')
    expect(error).toBeUndefined()
    expect(dir).toEqual({ hoge: { 'fuga.txt': 'fuga' } })
  })

  it('dont overwrite direcotry by file', () => {
    const dir: Directory = {
      hoge: {
        'fuga.txt': 'fuga'
      }
    }
    const { error } = write(dir, 'hoge', 'hoge')
    expect(error).toEqual({ code: 'ALREADY_DIRECTORY_EXISTS', message: 'hoge is directory.' })
    expect(dir).toEqual({ hoge: { 'fuga.txt': 'fuga' } })
  })

  it('path is not directory', () => {
    const dir: Directory = {
      hoge: 'hoge'
    }
    const { error } = write(dir, 'hoge/fuga.txt', 'fuga')
    expect(error).toEqual({ code: 'NOT_DIRECTORY', message: 'hoge is not directory.' })
    expect(dir).toEqual({ hoge: 'hoge' })
  })
})
