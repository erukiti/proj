import { Repository } from '../repository'

export default argv => {
  const repository = new Repository()
  const list = repository.getList()
  console.log(list)
}
