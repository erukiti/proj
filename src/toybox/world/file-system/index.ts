import { Cache } from './cache'

export class FileSystem {
  private _cache: Cache
  private _infra: any
  constructor(cache: Cache, infra) {
    this._cache = cache
    this._infra = infra
    // this._infra.on('')
  }

  public async read(filename: string) {
    return this._cache.read(filename)
  }

  public async write(filename: string, content: string | Buffer) {
    return this._infra.write(filename, content)
  }
}
