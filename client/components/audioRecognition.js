import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logout} from '../store'
import SpeechRecognition from 'react-speech-recognition'

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool

}


class AudioRecognition extends Component{
  constructor(){
    super();
    this.feelings = ['happy', 'sad', 'tired', 'nervous'];
    this.clickHandler = this.clickHandler.bind(this);

  }

  clickHandler(){
    this.found = false;
    this.props.resetTranscript();

  }

  componentDidMount(){
    console.log('in componentDidMount');
    this.found = false;
  }

  componentWillReceiveProps(){
    console.log('in componentWillReceiveProps');
  }

  render() {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = this.props;

    console.log('transcript', transcript);

    console.log('this.found', this.found);


    this.feelings.forEach((feeling) => {
      if (this.found === false && transcript.includes(feeling)){
        console.log(feeling);
        this.found = true;
      }
    })

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div>
        <button onClick={this.clickHandler}>Reset</button>
        <span>{transcript}</span>
      </div>
    )
  }

}


AudioRecognition.propTypes = propTypes

export default SpeechRecognition(AudioRecognition)


// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     isLoggedIn: !!state.user.id
//   }
// }

// const mapDispatch = dispatch => {
//   return {
//     handleClick() {
//       dispatch(logout())
//     }
//   }
// }

// export default connect(mapState, mapDispatch)(Navbar)


// this.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
//     this.SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
//     this.SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//     this.feelings = ['happy', 'sad'];
//     this.grammar = '#JSGF V1.0; grammar colors; public <feeling> = ' + this.feelings.join(' | ') + ' ;'

//     this.recognition = new SpeechRecognition();
//     this.speechRecognitionList = new SpeechGrammarList();
//     this.speechRecognitionList.addFromString(this.grammar, 1);
//     this.recognition.grammars = speechRecognitionList;
//     //recognition.continuous = false;
//     this.recognition.lang = 'en-US';
//     this.recognition.interimResults = false;
//     this.recognition.maxAlternatives = 1;

