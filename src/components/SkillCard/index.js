import './index.css'

const SkillCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <li className="skills-item-container">
      <div className="skills-container">
        <img src={imageUrl} alt={name} className="skill-image" />
        <p className="skill-name">{name}</p>
      </div>
    </li>
  )
}
export default SkillCard
