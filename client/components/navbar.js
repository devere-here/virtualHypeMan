import React from 'react'
import {connect} from 'react-redux'
import {Link, withRouter} from 'react-router-dom'

const Navbar = () => (
  <div>
    <h1>Emotional Support Dinosaurs</h1>
    <nav>
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/about">About</Link>
          <Link to="/choose">Choose Your Dinosaur</Link>
        </div>
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
  }
}

const mapDispatch = dispatch => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(Navbar))


