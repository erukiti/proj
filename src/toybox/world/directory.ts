import * as assert from 'assert'

export interface Directory {
  [props: string]: string | Buffer | Directory
}

const isDirectory = file => typeof file === 'object' && !(file instanceof Buffer)

const intoDirectory = (
  dir: Directory,
  filename: string,
  isMkdir?: boolean
): { dir?: string | Buffer | Directory; basename?: string; error?: any } => {
  assert(filename !== '')
  assert(typeof dir === 'object')
  const paths = filename.split('/')
  assert(paths.length >= 1)

  let file: string | Buffer | Directory = dir

  while (paths.length > 1) {
    const node = paths.shift()
    if (node in (file as Directory)) {
      if (!isDirectory(file[node])) {
        return { error: { code: 'NOT_DIRECTORY', message: `${node} is not directory.` } }
      }
    } else {
      if (!isMkdir) {
        return { error: { code: 'NOT_FOUND', message: `${node} is not found.` } }
      }
      file[node] = {}
    }
    file = file[node]
  }

  return { dir: file, basename: paths[0] }
}

export const read = (dir: Directory, filename: string): { error?; content?: string | Buffer; files?: string[] } => {
  const { dir: targetDir, basename, error } = intoDirectory(dir, filename)
  if (error) {
    return { error }
  }

  if (!(basename in dir)) {
    return { error: { code: 'NOT_FOUND', message: `${filename} is not found.` } }
  }
  if (isDirectory(dir[basename])) {
    return { files: Object.keys(dir[basename]) }
  } else {
    return { content: dir[basename] as any }
  }
}

export const write = (dir: Directory, filename: string, content: string | Buffer): { error?: any } => {
  const { dir: targetDir, basename, error } = intoDirectory(dir, filename, true)
  if (error) {
    return { error }
  }
  if (basename in dir && isDirectory(dir[basename])) {
    return { error: { code: 'ALREADY_DIRECTORY_EXISTS', message: `${filename} is directory.` } }
  }

  targetDir[basename] = content
  return {}
}