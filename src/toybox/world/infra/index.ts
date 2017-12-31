import { ReadResult, WriteResult } from '../filesystem'

export interface FsInfra {
  read: (filename: string) => Promise<ReadResult>
  write: (filename: string, content: string | Buffer) => Promise<WriteResult>
}
