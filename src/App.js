import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectCard from './components/ProjectCard'
import Header from './components/Header'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getAllProjects()
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.getAllProjects(),
    )
  }

  getAllProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getAllProjects()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="falure-info">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="lodaer-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderProjectsView = () => {
    const {projectsList} = this.state

    return (
      <ul className="project-container">
        {projectsList.map(each => (
          <ProjectCard key={each.id} projectCardDetails={each} />
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderProjectsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <>
        <Header />
        <div className="bg-container">
          <select
            className="select-input"
            value={activeCategoryId}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </>
    )
  }
}

export default App
