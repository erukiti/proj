import { Directory, read, write } from './directory'
export class FileSystem {
  private _files: Directory
  private _infra: any
  constructor(infra) {
    this._files = {}
    this._infra = infra
  }

  public async read(filename: string) {
    return read(this._files, filename)
  }

  public async write(filename: string, content: string | Buffer) {}
}
