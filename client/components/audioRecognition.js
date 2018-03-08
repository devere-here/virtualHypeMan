import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases } from '../store'

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool

}


class AudioRecognition extends Component{
  constructor(props){
    super(props);
    console.log('this.props', this.props);
    this.props.loadPhraseData();
    this.feelings = ['happy', 'sad', 'tired', 'nervous'];
    this.clickHandler = this.clickHandler.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
    this.counter = 0;
    this.response = '';

  }

  clickHandler(){
    this.found = false;
    this.props.resetTranscript();

  }

  toggleSetting(){}

  componentDidMount(){
    console.log('in componentDidMount');
    this.found = false;
  }

  render() {
    this.counter++;

    const { transcript, browserSupportsSpeechRecognition } = this.props;
    console.log('this.props', this.props);

    console.log('transcript', transcript);

    console.log('this.found', this.found);



    this.feelings.forEach((feeling) => {
      if (this.found === false && transcript.includes(feeling)){
        console.log('this.props.motivationalWords[feeling]', this.props.motivationalWords[feeling]);
        this.response = this.props.motivationalWords[feeling];
        //var msg = new SpeechSynthesisUtterance('Hello World');
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
        console.log('Text has been spoken.');
        this.found = true;
      }
    })

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div>
        <button onClick={this.toggleSetting}>Toggle</button>
        <button onClick={this.clickHandler}>Reset</button>
        <span>{transcript}</span>
        { this.found ? <h1>{this.response}</h1> : null}
      </div>
    )
  }

}


AudioRecognition.propTypes = propTypes

/**
 * CONTAINER
 */
const mapState = ({ motivationalWords }) => {
  return {
    motivationalWords
  }
}


const mapDispatch = dispatch => {
  return {
    loadPhraseData () {
      dispatch(fetchPhrases(dispatch))
    }
  }
}

export default connect(mapState, mapDispatch)(SpeechRecognition(AudioRecognition))


// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     isLoggedIn: !!state.user.id
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

