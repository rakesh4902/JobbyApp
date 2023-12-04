import {Component} from 'react'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SkillCard from '../SkillCard'
import SimilarJobItemS from '../SimilarJobItemS'
import Header from '../Header'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    jobDetailsData: [],
    similarJobDetailsData: [],
    apiRequestStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formatJobDetailsData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  formatSimilarJobDetailsData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobDetails = async () => {
    this.setState({apiRequestStatus: apiStatus.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedJobDetailsData = this.formatJobDetailsData(data.job_details)
      console.log(updatedJobDetailsData)
      const updateSimilarJobDetailsData = data.similar_jobs.map(
        eachSimilarJob => this.formatSimilarJobDetailsData(eachSimilarJob),
      )
      console.log(updateSimilarJobDetailsData)
      this.setState({
        jobDetailsData: updatedJobDetailsData,
        similarJobDetailsData: updateSimilarJobDetailsData,
        apiRequestStatus: apiStatus.success,
      })
    } else {
      this.setState({apiRequestStatus: apiStatus.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetailsData, similarJobDetailsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobDetailsData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-success-view-container">
        <div className="job-details">
          <div className="job-logo-title-location-container">
            <div className="job-logo-title-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="job-title-container">
                <h1 className="job-title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating-heading">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-employee-container">
                <div className="location-container">
                  <MdLocationOn className="job-icon" />
                  <p className="location-name">{location}</p>
                </div>
                <div className="employee-container">
                  <BsBriefcaseFill className="job-icon" />
                  <p className="location-name">{employmentType}</p>
                </div>
              </div>
              <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="job-description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map(eachSkill => (
              <SkillCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="description-heading">Life at Company</h1>
          <div className="life-at-company-description-image-container">
            <p className="description-text">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobDetailsData.map(eachSimilarJob => (
            <SimilarJobItemS
              jobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsFailureView = () => (
    <div className="job-item-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-failure-img"
      />
      <h1 className="job-item-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-failure-description">
        We cannot seem to find the page you are looking for
      </p>

      <button
        type="button"
        className="job-item-failure-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiRequestStatus} = this.state
    switch (apiRequestStatus) {
      case apiStatus.success:
        return this.renderJobDetailsSuccessView()
      case apiStatus.failure:
        return this.renderJobDetailsFailureView()
      case apiStatus.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobDetails
