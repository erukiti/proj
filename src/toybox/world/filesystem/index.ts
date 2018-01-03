import { Handler } from '../handler'
import { FsInfra } from '../infra'
import { Cache } from './cache'
import { Content } from './types'

export * from './types'

export class Filesystem {
  private _cache: Cache
  private _infra: FsInfra
  public handler: Handler
  constructor(handler: Handler, cache: Cache, infra: FsInfra) {
    this._cache = cache
    this._infra = infra
    this.handler = handler
  }

  public async read(filename: string) {
    const res = this._cache.read(filename)
    if (res.error && res.error.code === 'NOT_FOUND') {
      return this._read(filename)
    }
    return res
  }

  public async write(filename: string, content: Content) {
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
