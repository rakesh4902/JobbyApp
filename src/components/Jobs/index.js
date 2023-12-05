import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import FilterJobs from '../FilterJobs'
import JobCard from '../JobCard'
import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    apiRequestStatus: apiStatus.initial,
    employmentType: [],
    salaryRange: 0,
  }

  componentDidMount() {
    this.getAllJobs()
  }

  getAllJobs = async () => {
    this.setState({apiRequestStatus: apiStatus.inProgress})
    const {searchInput, employmentType, salaryRange} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchInput}`
    console.log(apiUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        apiRequestStatus: apiStatus.success,
      })
    } else {
      this.setState({
        apiRequestStatus: apiStatus.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  findSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  onChangeSalary = sal => {
    this.setState({salaryRange: sal}, this.getAllJobs)
  }

  onChangeEmploymentType = event => {
    const {employmentType} = this.state
    const inputNotInList = employmentType.filter(
      eachItem => eachItem === event.target.value,
    )
    console.log(inputNotInList)
    console.log(employmentType)
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getAllJobs,
      )
    } else {
      const updatedData = employmentType.filter(
        eachItem => eachItem !== event.target.value,
      )
      this.setState({employmentType: updatedData}, this.getAllJobs)
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    const jobResults = jobsList.length > 0
    console.log(jobsList)
    return jobResults ? (
      <div className="jobs-results-search-container">
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobCard jobDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-job-results-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="jobs-failure-button"
        onClick={this.getAllJobs}
      >
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {apiRequestStatus} = this.state
    switch (apiRequestStatus) {
      case apiStatus.success:
        return this.renderJobsList()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.inProgress:
        return this.renderLoaderView()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <FilterJobs
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              onChangeEmploymentType={this.onChangeEmploymentType}
              onChangeSalary={this.onChangeSalary}
              searchInput={searchInput}
              onChangeSearchInput={this.onChangeSearchInput}
              findSearchInput={this.findSearchInput}
              getAllJobs={this.getAllJobs}
            />
            <div className="search-inputs-and-jobs-list-container">
              <div className="search-input-large-container">
                <input
                  type="search"
                  className="search-input-large"
                  placeholder="search"
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.findSearchInput}
                />
                <button
                  type="button"
                  aria-label="search"
                  className="search-input-large-button"
                  data-testid="searchButton"
                >
                  <BsSearch className="search-icon-large" />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
