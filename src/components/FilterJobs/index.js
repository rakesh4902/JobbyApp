import {BsSearch} from 'react-icons/bs'

import ProfileDetails from '../ProfileDetails'
import './index.css'

const FilterJobs = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    onChangeEmploymentType,
    onChangeSalary,
    searchInput,
    onChangeSearchInput,
    getAllJobs,
    findSearchInput,
  } = props

  const onFindSearchInput = event => {
    findSearchInput(event)
  }

  const ChangeSearchInput = event => {
    onChangeSearchInput(event)
  }

  const renderSearchInputView = () => (
    <div className="search-input-small-container">
      <input
        type="search"
        className="search-input-small"
        placeholder="Search"
        value={searchInput}
        onChange={ChangeSearchInput}
        onKeyDown={onFindSearchInput}
      />
      <button
        type="button"
        className="search-button-container"
        aria-label="jobs"
        data-testid="searchButton"
        onClick={getAllJobs}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  const renderEmploymentTypeView = () => (
    <div className="employment-type-container">
      <h1 className="employee-type-heading">Type Of Employment</h1>
      <ul className="employee-list-container">
        {employmentTypesList.map(eachEmployeeType => {
          const onSelectedEmployeeType = event => {
            onChangeEmploymentType(event)
          }
          return (
            <li
              className="employee-item"
              key={eachEmployeeType.employmentTypeId}
              onChange={onSelectedEmployeeType}
            >
              <input
                type="checkbox"
                id={eachEmployeeType.employmentTypeId}
                className="check-input"
                value={eachEmployeeType.employmentTypeId}
              />
              <label
                htmlFor={eachEmployeeType.employmentTypeId}
                className="check-label"
              >
                {eachEmployeeType.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const renderSalaryRangeView = () => (
    <div className="salary-range-container">
      <h1 className="salary-range-heading">Salary Range</h1>
      <ul className="salary-range-list-container">
        {salaryRangesList.map(eachSalary => {
          const ChangeSalary = () => {
            onChangeSalary(eachSalary.salaryRangeId)
          }
          return (
            <li
              className="salary-item"
              key={eachSalary.salaryRangeId}
              onClick={ChangeSalary}
            >
              <input
                type="radio"
                id={eachSalary.salaryRangeId}
                name="salary"
                className="check-input"
              />
              <label htmlFor={eachSalary.salaryRangeId} className="check-label">
                {eachSalary.label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
  return (
    <div className="filter-jobs-container">
      {renderSearchInputView()}
      <ProfileDetails />
      <hr className="horizontal-line" />
      {renderEmploymentTypeView()}
      <hr className="horizontal-line" />
      {renderSalaryRangeView()}
    </div>
  )
}

export default FilterJobs
