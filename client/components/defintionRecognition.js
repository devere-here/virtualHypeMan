import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases } from '../store'
import Audio from 'react-audioplayer';
import { Player } from 'video-react';
import axios from 'axios';


const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}


class DefintionRecognition extends Component{
  constructor(props){
    super(props);

    // this.response = '';
    // this.videoUrl = '';
    // this.weather = '';
    // this.listening = false;
    // this.typeOfResponse = '';
    // this.found = false;

  }

  componentDidMount(){

    console.log('started to listen');
  }

  componentWillReceiveProps(nextProps){
    console.log('in componentWillReceiveProps');
    nextProps.startListening();
  }


  render() {

    //const { transcript, stopListening, browserSupportsSpeechRecognition, listening } = this.props;

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    //this.props.startListening();
    // if (this.props.start){
    //   this.props.startListening();
    //   console.log('blah');
    // } else {
    //   console.log('nope');
    // }

    console.log('this.transcript in inner', this.props.transcript);

    return (
      <div>
        <h1>In definitions</h1>
        <p>words in def: {this.props.transcript}</p>
      </div>
    )
  }

}

// //
// AudioRecognition.propTypes = propTypes

/**
 * CONTAINER
 */
const mapState = (state, ownProps) => {

  return {
    //start: ownProps.start
    transcript: ownProps.transcript

  }
}


const mapDispatch = dispatch => {
  return {
    loadPhraseData () {
      dispatch(fetchPhrases(dispatch))
    }
  }
}



//export default connect(mapState, mapDispatch)(SpeechRecognition(DefintionRecognition))

export default connect(mapState, mapDispatch)(DefintionRecognition);


