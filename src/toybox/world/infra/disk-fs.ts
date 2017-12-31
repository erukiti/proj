import * as path from 'path'

import { ReadResult, WriteResult } from '../filesystem'
import { FsInfra } from './index'

export class DiskFs implements FsInfra {
  private _fs
  private _root: string

  constructor(fs, root: string) {
    this._fs = fs
    this._root = root
  }

  public async read(filename: string) {
    const filepath = path.join(this._root, filename)
    return this._fs.readFileSync(filepath)
  }

  public async write(filename: string, content: string | Buffer) {
    const filepath = path.join(this._root, filename)
    return this._fs.writeFileSync(filepath, content)
  }
}
