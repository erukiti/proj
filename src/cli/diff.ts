import { Repository } from '../repository'

export default argv => {
  // console.log(argv)
  const repository = new Repository()
  repository.diff(argv.archetypeName, argv.files)
}
