import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Home = () => (
  <div id="home">
    <div id="homeWelcome">
      <h1>Emotional Support Dinosaurs</h1>
      <Link to="/about" className="homeButton">About</Link>
      <Link to="/choose" className="homeButton">Choose Your Dinosaur</Link>
    </div>
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

export default connect(mapState, mapDispatch)(Home)


