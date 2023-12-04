import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
          <ul className="nav-bar-mobile-icons-container">
            <li>
              <Link to="/">
                <AiFillHome className="nav-mobile-icon" />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <BsFillBriefcaseFill className="nav-mobile-icon" />
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="nav-mobile-btn"
                aria-label="btn"
                onClick={onClickLogOut}
              >
                <FiLogOut />
              </button>
            </li>
          </ul>
        </div>
        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>
          <ul className="nav-large-container">
            <li className="nav-large-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-large-item">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>
          <button
            className="nav-large-btn"
            type="button"
            onClick={onClickLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
