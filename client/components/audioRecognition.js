import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases } from '../store'
import Audio from 'react-audioplayer';
import { Player } from 'video-react';
import axios from 'axios';
import DefintionRecognition from './defintionRecognition';
import { fetchDefinition } from '../store';


const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}

const dictionaryApiConfig = {
  headers: {
    Accept: 'application/json',
    app_id: 'eb6c4545',
    app_key: '3f6fbf950a841c0ade489f3f31e81e2c'
  }
}

const owlBotConfig = {
  headers: {'Access-Control-Allow-Origin': '*'},
  proxy: {}
}

console.log('owlBotConfig', owlBotConfig);


class AudioRecognition extends Component{
  constructor(props){
    super(props);

    this.getGeoLocation();
    this.props.loadPhraseData();
    this.feelings = ['happy', 'sad', 'tired', 'nervous'];
    this.clickHandler = this.clickHandler.bind(this);
    this.response = '';
    this.videoUrl = '';
    this.weather = '';
    this.listening = false;
    this.typeOfResponse = '';
    this.found = false;
    this.definitionHandler = this.definitionHandler.bind(this);

  }


 async getGeoLocation(){
    let weatherUrl;
    if (navigator.geolocation){

      weatherUrl = await navigator.geolocation.getCurrentPosition((position) => {
        console.log('coords', position.coords.latitude, position.coords.longitude);
        weatherUrl = `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        axios.get(weatherUrl)
        .then((weatherData) => {
          console.log('weatherData', weatherData);
          this.weather = weatherData;
        })
      })
    }
  }

  renderSwitch = (type) => {
    console.log('in the render switch type is', type);
    console.log('this.typeOfResponse', this.typeOfResponse);

    switch (type){
      case 'feeling':
        return (<div><h1>{this.response}</h1>
          <iframe width="560" height="315" src={`${this.videoUrl}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen /></div>);
      case 'weather':
          return (<div><h1>{this.response}</h1>
            <img width="560" height="315" src={this.props.weatherImages[this.weather.data.weather[0].main]} /></div>);
      case 'definition':
      this.transcript = '';
            return (
              <div>
                <h1>definition</h1>
                {!this.finishedAsync
                  ? <p>Waiting...</p>
                  : (<div>
                      {window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response))}
                      <p>{this.response}</p>
                    </div>)
                  }
              </div>
            )
      default:
              return (<h1>Hello Steven</h1>)
    }

  }


  clickHandler(){
    this.listening = !this.listening;
    this.found = false;
    this.props.resetTranscript();
    this.props.listening ? this.props.stopListening() : this.props.startListening();


  }

  onThankYou(){
    this.transcript = '';
    this.props.stopListening();
  }

  async definitionHandler(word){
    console.log('in definition handler if block');
    this.typeOfResponse = 'definition';
    //stopListening();
    this.found = true;
    console.log('about to define ', word);

    //this.props.loadDefinition(word);
    //let obj = {apiUrl: `https://owlbot.info/api/v2/dictionary/${word}/?format=json`};
    //let obj = {apiUrl: `https://owlbot.info/api/v2/dictionary/${word}/?format=json`};


    let value = await axios.post('api/apiRequests', {word});
      this.finishedAsync = true;
      console.log('returned this value', value);
      //console.log('value is ', value.data[0].definition);
      this.response = `${word}, ${value.data[0].definition}`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));


    //let value = await axios.get(`https://owlbot.info/api/v2/dictionary/${word}/?format=json`, owlBotConfig)
    //console.log('value is, ', value);

  }

  componentDidMount(){
    console.log('in componentDidMount');
  }

  render() {

    const { transcript, stopListening, browserSupportsSpeechRecognition, listening } = this.props;

    console.log('transcript ', transcript);
    let transcriptArr = transcript.split(' ');
    let prevWord = '';

    for (let word of transcriptArr){
      if (listening === true){
        console.log('prevWord', prevWord);
        if (this.feelings.includes(word)){
          this.response = this.props.motivationalWords[word].response;
          this.videoUrl = this.props.motivationalWords[word].videoUrl;
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
          stopListening();
          this.found = true;
          this.typeOfResponse = 'feeling';
          break;
        } else if (word === 'temperature' || word === 'weather'){
          if (this.weather){
            let fahrenheit = this.weather.data.main.temp * 1.8 + 32;
            let percipitation = this.weather.data.weather[0].main;
            if (percipitation === 'Clear') percipitation = 'Clear Skies';
            fahrenheit = Math.round(fahrenheit).toString();
            this.response = `It is ${fahrenheit} degrees fahrenheit outside with ${percipitation}`;
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
            stopListening();
            this.typeOfResponse = 'weather';
          } else {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('The temperature and weather is currently unavailiable'));
          }
          this.found = true;

        } else if (word === 'great' && prevWord === 'you\'re'){

          window.speechSynthesis.speak(new SpeechSynthesisUtterance('Thank You'));
          stopListening();
          this.found = true;
          break;

        } else if (word === 'hello'){
          window.speechSynthesis.speak(new SpeechSynthesisUtterance('Hello Steven'));
          stopListening();
          this.found = true;
        } else if (prevWord === 'define' || prevWord === 'Define'){
          console.log('in right if statement');
          this.definitionHandler(word);
          //stopListening();

          // console.log('in definition if block');
          // this.typeOfResponse = 'definition';

          stopListening();

          // this.found = true;
        }
      }

      prevWord = word;
    }

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div>
        <button onClick={this.clickHandler}>{listening ? 'Stop' : 'Start'}</button>
        <span>{transcript}</span>
        { !this.found
          ? null
          : (<div>{this.renderSwitch(this.typeOfResponse)}</div>)
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
    motivationalWords,
    weatherImages: {
      Clear: 'https://formingthethread.files.wordpress.com/2013/04/clearday.jpg',
      Clouds: 'https://vmcdn.ca/f/files/sudbury/140816_weather.jpg;w=630',
      Rain: 'https://pennalumniblog.files.wordpress.com/2012/01/rainy_day.jpg',
      Snow: 'https://static01.nyt.com/packages/images/multimedia/bundles/projects/2012/AvalancheDeploy/lure-intro.jpg',
      Mist: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOYEFBd9-513q7RB3Af9b_VNk1y2_J5KcFZzXQLLS8virDIUdJ',
      ThunderStorms: 'https://www.flyingmag.com/sites/flyingmag.com/files/styles/1000_1x_/public/images/2017/06/everything-explained-june.jpg?itok=UsjdV7uz&fc=50,50'
    }
  }
}


const mapDispatch = dispatch => {
  return {
    loadPhraseData () {
      dispatch(fetchPhrases());
    },
    loadDefinition(word){
      dispatch(fetchDefinition(word));
    }
  }
}

const options = {
  autoStart: false
}


export default connect(mapState, mapDispatch)(SpeechRecognition(options)(AudioRecognition))


// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     isLoggedIn: !!state.user.id
//   }
// }


// export default connect(mapState, mapDispatch)(Navbar)
