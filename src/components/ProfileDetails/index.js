import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProfileDetails extends Component {
  state = {
    profileData: [],
    apiRequestStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiRequestStatus: apiStatus.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedProfile,
        apiRequestStatus: apiStatus.success,
      })
    } else {
      this.setState({apiRequestStatus: apiStatus.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-success-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-error-view-container">
      <button
        type="button"
        className="profile-failure-button"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiRequestStatus} = this.state
    switch (apiRequestStatus) {
      case apiStatus.success:
        return this.renderProfileSuccessView()
      case apiStatus.failure:
        return this.renderProfileFailureView()
      case apiStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }
}

export default ProfileDetails
