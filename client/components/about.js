import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const About = () => (
  <div id="aboutPageContainer">
  <div id="about">
    <div id="aboutTextPortion">
      <h1 id="aboutTextH1">Emotional Support Dinosaurs</h1>
      <hr />
      <h3 id="aboutTextH3">Emotional Support Dinosaurs are personal assistants that you communicate to by talking. A much simpler version of the Amazon Echo or Google Home.
      This app was designed primarily for kids and focuses on helping kids understand their emotions better. Our app does this by giving kids funny videos when they express
      that they are sad, lonely, angry, etc. Under the videos are small blurbs about what these emotions mean, why it's ok to feel them, and what kids can do about those emotions.
      Emotional Support Dinosaurs also can perform some basic services through 3rd party APIs. This means that Emotional Support Dinosaurs can act as functional dictionaries, calculators,
      checklists, and can provide local weather info.</h3>
      <div id="aboutPageButtonContainer">
        <Link className="aboutPageButton" to="/choose">Choose Your Dinosaur</Link>
      </div>
    </div>
    <div id="aboutPictureContainer" />
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

export default connect(mapState, mapDispatch)(About)

