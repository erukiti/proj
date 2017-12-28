import { Cache } from './cache'
import { FileSystem } from './index'

describe('read', () => {
  it('', async () => {
    expect.assertions(2)
    const cache = new Cache()
    cache.read = jest.fn(() => ({ content: 'hoge' }))
    const fs = new FileSystem(cache, null)
    const res = await fs.read('hoge.txt')
    expect(res).toEqual({ content: 'hoge' })
    expect(cache.read).toBeCalledWith('hoge.txt')
  })
})
