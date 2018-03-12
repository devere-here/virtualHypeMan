import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Home, About, Choose, Main, AudioRecognition } from './components'
import {me} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {

  render () {
    return (
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/choose" component={Choose} />
        <Route exact path="/audio" component={AudioRecognition}/>
        <Route exact path="/" component={Home} />
      </Switch>
    )

  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

