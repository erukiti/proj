import { FsInfra } from '../infra'
import { Cache } from './cache'
import { Handler } from './handler'

export interface ReadResult {
  error?: any
  content?: string | Buffer
  files?: string[]
}

export interface WriteResult {
  error?: any
}

export class Filesystem {
  private _cache: Cache
  private _infra: FsInfra
  public handler: Handler
  constructor(cache: Cache, infra: FsInfra) {
    this._cache = cache
    this._infra = infra
    this.handler = new Handler()
  }

  public async read(filename: string) {
    const res = this._cache.read(filename)
    if (res.error && res.error.code === 'NOT_FOUND') {
      return this._read(filename)
    }
    return res
  }

  public async write(filename: string, content: string | Buffer) {
    await this._infra.write(filename, content)
    this._cache.write(filename, content)
  }

  private async _read(filename: string) {
    const res = await this._infra.read(filename)
    if ('content' in res) {
      this._cache.write(filename, res.content)
    }
    return res
  }

  private async _remove(filename: string) {
    // this._cache.delete(filename)
  }
}
