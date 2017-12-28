import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
const mkdirp = require('mkdirp')
const assert = require('assert')
const { diffLines } = require('diff')

export class Repository {
  private _dir
  constructor() {
    this._dir = path.join(os.homedir(), '.waterslide')
    mkdirp.sync(this._dir)
  }

  private _fileCopy(src, dest) {
    console.log(`copy: ${src} -> ${dest}`)
    fs.copyFileSync(src, dest)
  }

  public getList() {
    return fs.readdirSync(this._dir)
  }

  public register(archetypeName: string, files: string[]) {
    assert(/^[a-zA-Z_]+$/.test(archetypeName))

    const archeDir = path.join(this._dir, archetypeName)
    mkdirp(archeDir)

    if (files.length === 0) {
      const destFiles = fs.readdirSync(archeDir)
      destFiles.forEach(destFile => {
        const dest = path.join(archeDir, destFile)
        const src = path.resolve(destFile)
        if (fs.existsSync(src)) {
          this._fileCopy(src, dest)
        }
      })
      return
    }

    files.forEach(file => {
      const src = path.resolve(file)
      const dest = path.join(archeDir, file)
      this._fileCopy(src, dest)
    })
  }

  public install(archetypeName: string, files: string[]) {
    assert(/^[a-zA-Z_]+$/.test(archetypeName))

    const archeDir = path.join(this._dir, archetypeName)
    const srcFiles = fs.readdirSync(archeDir).filter(srcFile => files.length === 0 || files.includes(srcFile))
    const unknownFiles = files.filter(file => !srcFiles.includes(file))
    if (unknownFiles.length > 0) {
      console.log('unknownFiles:', unknownFiles)
      return
    }

    srcFiles.forEach(srcFile => {
      const src = path.join(archeDir, srcFile)
      const dest = path.resolve(srcFile)
      this._fileCopy(src, dest)
    })
  }

  public diff(archetypeName: string, files: string[]) {
    assert(/^[a-zA-Z_]+$/.test(archetypeName))

    const archeDir = path.join(this._dir, archetypeName)
    mkdirp(path.join(this._dir, archetypeName))

    if (files.length === 0) {
      files = fs.readdirSync(archeDir)
    }

    files.forEach(file => {
      const src = path.resolve(file)
      const dest = path.join(this._dir, archetypeName, file)
      if (!fs.existsSync(src)) {
        console.log('exists only repository', dest)
        console.log()
        return
      }

      if (!fs.existsSync(dest)) {
        console.log('new file', file)
        console.log()
        return
      }

      const destCode = fs.readFileSync(dest).toString()
      const diffs = diffLines(destCode, fs.readFileSync(src).toString())
      if (diffs.length === 1) {
        assert(!diffs[0].added && !diffs[0].removed)
        console.log(file, 'is same')
        console.log()
      } else {
        console.log(file)
        diffs.forEach(diff => {
          if (diff.added && diff.removed) {
            console.log(diff)
            throw new Error('added & removed')
          }

          let leading = ''
          if (!diff.added && !diff.removed) {
            leading = '  '
          } else if (diff.added) {
            leading = '\x1b[32m+ '
          } else {
            leading = '\x1b[31m- '
          }

          console.log(
            diff.value
              .split('\n')
              .slice(0, diff.count)
              .map(line => `${leading}${line}\x1b[m`)
              .join('\n')
          )
        })
        console.log()
      }
    })
  }
}
