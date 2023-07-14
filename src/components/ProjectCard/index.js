import './index.css'

const ProjectCard = props => {
  const {projectCardDetails} = props
  const {name, imageUrl} = projectCardDetails

  return (
    <li className="project-list-item">
      <img className="image-list" src={imageUrl} alt={name} />
      <p className="project-list-description">{name}</p>
    </li>
  )
}

export default ProjectCard
