import { Cache } from './cache'
import { Filesystem } from './index'

const dummyInfra = {
  read: jest.fn(),
  write: jest.fn()
}

describe('read', () => {
  it('', async () => {
    expect.assertions(2)
    const cache = new Cache()
    cache.read = jest.fn(() => ({ content: 'hoge' }))
    const fs = new Filesystem(cache, dummyInfra)
    const res = await fs.read('hoge.txt')
    expect(res).toEqual({ content: 'hoge' })
    expect(cache.read).toBeCalledWith('hoge.txt')
  })
})
