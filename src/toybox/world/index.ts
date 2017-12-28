import { FileSystem } from './file-system'
export abstract class World {
  private _fs: FileSystem

  public abstract async setup()
  public abstract async runCode(sourceCode: string)
}
