import { Content, ReadResult, WriteResult } from '../filesystem'

export interface FsInfra {
  read: (filename: string) => Promise<ReadResult>
  write: (filename: string, content: Content) => Promise<WriteResult>
}
