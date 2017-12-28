import { Repository } from '../repository'

export default argv => {
  // console.log(argv)
  const repository = new Repository()
  repository.install(argv.archetypeName, argv.files)
}
