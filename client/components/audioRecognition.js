import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases } from '../store'
import Audio from 'react-audioplayer';
import { Player } from 'video-react';
import axios from 'axios';


const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool

}



class AudioRecognition extends Component{
  constructor(props){
    super(props);

    this.props.loadPhraseData();
    this.feelings = ['happy', 'sad', 'tired', 'nervous'];
    this.clickHandler = this.clickHandler.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
    this.response = '';
    this.videoUrl = '';
    this.getGeoLocation();
    this.weather = '';


  }


 async getGeoLocation(){
    let weatherUrl;
    //debugger;
    if (navigator.geolocation){
      //Geolocation to determine user's position
      //debugger;
      console.log('in navigator.geolocation');

      weatherUrl = await navigator.geolocation.getCurrentPosition((position) => {
        console.log('coords', position.coords.latitude, position.coords.longitude);
        weatherUrl = `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        axios.get(weatherUrl)
        .then((weatherData) => {
          console.log('weatherData', weatherData);
          this.weather = weatherData;
        })
      })
      // let weatherData = await axios.get(weatherUrl)
      // console.log('weatherData', weatherData);
    }
  }


  clickHandler(){
    this.found = false;
    this.props.resetTranscript();

  }

  toggleSetting(){
    this.video = !this.video;
  }

  componentDidMount(){
    console.log('in componentDidMount');
    this.found = false;
  }

  render() {
    this.counter++;

    const { transcript, browserSupportsSpeechRecognition } = this.props;

    console.log('transcript ', transcript);

    let transcriptArr = transcript.split(' ');

    for (let word of transcriptArr){
      if (this.found === false){
        if (this.feelings.includes(word)){
          this.response = this.props.motivationalWords[word].response;
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
          this.videoUrl = this.props.motivationalWords[word].videoUrl;
          this.found = true;
          break;
        } else if (word === 'temperature'){
          console.log('this.weather', this.weather);
          if (this.weather){
            let fahrenheit = this.weather.data.main.temp * 1.8 + 32;
            fahrenheit = Math.round(fahrenheit);
            fahrenheit.toString();
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('The temperature is ' + fahrenheit + 'degrees fahrenheit'));
            this.found = true;
          } else{
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('The temperature is currently unavailiable'));
          }

        } else if (word === 'weather'){
          if (this.weather){
            console.log('this.weather.maindhhddhdhdhdh', this.weather.data.weather[0].main);
            let weather = this.weather.data.weather[0].main;
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('The weather is ' + weather));
            this.found = true;
          } else {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('The weather is currently unavailiable'));
          }

        }
      }

    }


    // this.feelings.forEach((feeling) => {
    //   if (this.found === false && transcript.includes(feeling)){
    //     this.response = this.props.motivationalWords[feeling].response;
    //     window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
    //     this.videoUrl = this.props.motivationalWords[feeling].videoUrl;
    //     this.found = true;

    //   }
    // })

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div>
        <button onClick={this.clickHandler}>Reset</button>
        <span>{transcript}</span>
        { !this.found
          ? null
          : (<div><h1>{this.response}</h1>
            <iframe width="560" height="315" src={`${this.videoUrl}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen /></div>)
        }
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


//https://drive.google.com/uc?export=download&id=1GKL_Jax3_f4dVMNKM0I2qcTy3E0Crf46

