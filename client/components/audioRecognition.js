import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases, fetchDefinition, fetchTasks, removeTask, addTask } from '../store'
import axios from 'axios';
//import Gif from 'react-gif';
var GifPlayer = require('react-gif-player');

const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}

class AudioRecognition extends Component{
  constructor(props){
    super(props);

    this.getGeoLocation();
    this.props.loadPhraseData();
    this.props.loadToDoList();
    this.feelings = ['happy', 'sad', 'tired', 'nervous', 'angry'];
    this.mathOperations = ['+', '-', '*', '/', 'plus', 'minus', 'times', 'multiplied', 'divided'];
    this.clickHandler = this.clickHandler.bind(this);
    this.response = '';
    this.videoUrl = '';
    this.weather = '';
    this.listening = false;
    this.typeOfResponse = '';
    this.found = false;
    this.definitionHandler = this.definitionHandler.bind(this);
    this.emotionHandler = this.emotionHandler.bind(this);
    this.weatherHandler = this.weatherHandler.bind(this);
    this.complimentHandler = this.complimentHandler.bind(this);
    this.mathHandler = this.mathHandler.bind(this);
    this.toDoListHandler = this.toDoListHandler.bind(this);
    this.dictionaryUrl = '';
    this.finishedAsync = false;

  }

  componentWillReceiveProps(nextProps){

    console.log('props.definition', this.props);
    console.log('nextProps.definition', nextProps);
    console.log('Object.keys(nextProps).length', Object.keys(nextProps).length);
    if (Object.keys(nextProps).length !== 0 && this.props.definition !== nextProps.definition){
      console.log(' in componentWillReceiveProps if statement');
      this.finishedAsync = true;
    }

  }


 async getGeoLocation(){
    let weatherUrl;
    if (navigator.geolocation){



      weatherUrl = await navigator.geolocation.getCurrentPosition((position) => {
        weatherUrl = `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        console.log('position, ', position.coords.latitude, position.coords.longitude);
        axios.get(weatherUrl)
        .then((weatherData) => {
          this.weather = weatherData;
        })
      })
    }
  }

  renderSwitch = (type) => {

    switch (type){
      case 'feeling':
        return (<div><h1>{this.response}</h1>
          <iframe width="560" height="315" src={`${this.videoUrl}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen /></div>);
      case 'weather':
          return (<div><h1>{this.response}</h1>
            <img width="560" height="315" src={this.props.weatherImages[this.weather.data.weather[0].main]} /></div>);
      case 'math':
            return (
              <h3>The answer is {this.response}</h3>
            )
      case 'list':
      return (
        <h3>The answer is {this.response}</h3>
      )
      case 'definition':
      this.transcript = '';
            return (
              <div>
                <h1>definition</h1>
                {!this.finishedAsync
                  ? <p>Waiting...</p>
                  : (<div>
                      {window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.props.definition.text))}
                      <p>{this.props.definition.text}</p>
                      <img width="560" height="315" src={this.props.definition.image} />
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
    this.finishedAsync = false;
    this.props.resetTranscript();
    this.props.listening ? this.props.stopListening() : this.props.startListening();


  }

  onThankYou(){
    this.transcript = '';
    this.props.stopListening();
  }

  async definitionHandler(word){
    this.typeOfResponse = 'definition';
    this.found = true;
    this.props.stopListening();


    await this.props.loadDefinition(word)

  }

  emotionHandler(word){

    this.response = this.props.motivationalWords[word].response;
    this.videoUrl = this.props.motivationalWords[word].videoUrl;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
    this.props.stopListening();
    this.found = true;
    this.typeOfResponse = 'feeling';

  }

  weatherHandler(weather){

    if (weather){

      let fahrenheit = weather.data.main.temp * 1.8 + 32;
      let percipitation = weather.data.weather[0].main;
      if (percipitation === 'Clear') percipitation = 'Clear Skies';
      fahrenheit = Math.round(fahrenheit).toString();
      this.response = `It is ${fahrenheit} degrees fahrenheit outside with ${percipitation}`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
      this.props.stopListening();
      this.typeOfResponse = 'weather';

    } else {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('The temperature and weather is currently unavailiable'));
    }

    this.found = true;

  }

  greetingHandler(){
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('Hello Steven'));
    this.props.stopListening();
    this.found = true;

  }

  complimentHandler(){
    window.speechSynthesis.speak(new SpeechSynthesisUtterance('Thank You'));
    this.props.stopListening();
    this.found = true;

  }

  mathHandler(firstNumber, secondNumber, operation){
    console.log('firstNumber', firstNumber);
    console.log('secondNumber', secondNumber);
    console.log('operation', operation);

    let answer;
    if (operation === '+' || operation === 'plus'){
      answer = firstNumber + secondNumber;
    } else if (operation === '-' || operation === 'minus'){
      answer = firstNumber - secondNumber;
    } else if (operation === '*' || operation === 'times' || operation === 'multiplied'){
      answer = firstNumber * secondNumber;
    } else if (operation === '/' || operation === 'divided'){
      answer = firstNumber / secondNumber;
    }

    window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
    this.props.stopListening();
    this.found = true;
    this.response = answer;
    this.typeOfResponse = 'math';

  }

  toDoListHandler(arr, index){
    let modifierIndex;
    let endingIndex;
    if (arr.includes('add')){
      console.log('should add');
      modifierIndex = arr.indexOf('add');
      endingIndex = arr[index - 1] === 'to-do' ? index - 3 : index - 4;

      let newTask = arr.slice(modifierIndex + 1, endingIndex);

      console.log('newTask is', newTask.join(' '));

      //dispatch some add a task method

    } else if (arr.includes('remove')){
      console.log('should remove');
      modifierIndex = arr.indexOf('remove');
      endingIndex = arr[index - 1] === 'to-do' ? index - 3 : index - 4;

      let reovedTask = arr.slice(modifierIndex + 1, endingIndex);

      console.log('removeTask is', reovedTask.join(' '));

      //dispatch some remove a task method

    } else {

      let list = this.props.toDoList.map((task) => task.task);
      list = list.join(', ');

      if (this.props.toDoList.length > 1){
        let lastIndex = list.lastIndexOf(',');
        list = list.substring(0, lastIndex) + ' and ' + list.substring(lastIndex + 1);
      }

      list = `There are ${this.props.toDoList.length} things on your to do list. You should ${list}`;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(list));
      this.props.stopListening();
      this.found = true;
      this.response = list;
      this.typeOfResponse = 'list';


    }

  }

  render() {

    const { transcript, stopListening, browserSupportsSpeechRecognition, listening } = this.props;

    console.log('transcript ', transcript);
    let transcriptArr = transcript.split(' ');
    let prevWord = '';
    let prevPrevWord = '';

    if (listening === true){
      for (let word of transcriptArr){
        if (word === 'please'){
          let spokenFeeling = this.feelings.find((feeling) => {
            return transcriptArr.includes(feeling);
          });
          if (spokenFeeling) {
            this.emotionHandler(spokenFeeling);
            break;
          }

          let spokenDefinition = transcriptArr.find((word) => {
            return word === 'define' || word === 'definition'
          });
          if (spokenDefinition){
            let word, index;
            index = spokenDefinition === 'define'
              ? transcriptArr.indexOf('define') + 1
              : transcriptArr.indexOf('definition') + 2
            this.definitionHandler(transcriptArr[index]);
            break;
          }

          let spokenOperation = this.mathOperations.find((operation) => {
            return transcriptArr.includes(operation);
          });

          if (spokenOperation){
            let index = transcriptArr.indexOf(spokenOperation);
            let secondIndex = spokenOperation === 'divided' || spokenOperation === 'multiplied' ? index + 2 : index + 1;
            this.mathHandler(transcriptArr[index - 1], transcriptArr[secondIndex], spokenOperation);
          }

          let spokenWeather = transcriptArr.find((word) => {
            return word === 'weather' || word === 'temperature'
          });

          if (spokenWeather){
            this.weatherHandler(this.weather);
            break;
          }

          console.log('transcriptArr', transcriptArr);
          if (transcriptArr.includes('list')){
            console.log('in first if');
            let index = transcriptArr.indexOf('list');
            if ((transcriptArr[index - 2] === 'to' && transcriptArr[index - 1] === 'do') || transcriptArr[index - 1] === 'to-do'){
              console.log('in second if');
              this.toDoListHandler(transcriptArr, index);

            }
          }

        }

      }

    }

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div>

      <GifPlayer gif={'https://drive.google.com/uc?export=download&id=1jwO0PLd1G4jNBQcbtsW3zDHsc1_K9Kf-'} still={'https://drive.google.com/uc?export=download&id=1zinfIIFvIwHsd6WiuG0kWBc0o_yelvyH'} />
      <GifPlayer gif={'https://drive.google.com/uc?export=download&id=10oYkrHB_q2plQJxzELy8EyKsheHEgEip'} still={'https://drive.google.com/uc?export=download&id=155VwgHXUupoZ24wwVfzqZs8TBz3b26oo'} />
      <GifPlayer gif={'https://drive.google.com/uc?export=download&id=1G2eR26NW6DJGbUkAsSRsvafatiqzpKR1'} still={'https://drive.google.com/uc?export=download&id=1ksCp0s2T_NwAwR_28SbOoG1HT124JZVH'} />
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
const mapState = (state) => {
  console.log('state is', state);
  return {
    motivationalWords: state.motivationalWords,
    definition: state.dictionary,
    toDoList: state.toDoList,
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
    },
    loadToDoList () {
      dispatch(fetchTasks());
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



// console.log('about to change finishedAsync');
    // this.finishedAsync = true;

    // let value = await axios.post('api/apiRequests', {word});
    //   console.log('returned this value', value);
    //   this.response = `${word}, ${value.data[0].definition}`;
    //   this.dictionaryUrl = value.data[0].image;
    //   window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
    //   console.log('about the change finishedAsync');
    //   this.props.finishedAsync = true;

   // this.response = this.props.motivationalWords[word].response;
          // this.videoUrl = this.props.motivationalWords[word].videoUrl;
          // window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
          // stopListening();
          // this.found = true;
          // this.typeOfResponse = 'feeling';



          // let fahrenheit = this.weather.data.main.temp * 1.8 + 32;
          //   let percipitation = this.weather.data.weather[0].main;
          //   if (percipitation === 'Clear') percipitation = 'Clear Skies';
          //   fahrenheit = Math.round(fahrenheit).toString();
          //   this.response = `It is ${fahrenheit} degrees fahrenheit outside with ${percipitation}`;
          //   window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
          //   stopListening();
          //   this.typeOfResponse = 'weather';


         // <Gif src={'https://media3.giphy.com/media/xThta83zMLHGNtRZcs/200w.webp'} />





        //  for (let word of transcriptArr){
        //   if (listening === true){
        //     console.log('prevWord', prevWord);
        //     if (this.feelings.includes(word)){
        //       this.emotionHandler(word);
        //       break;
        //     } else if (word === 'temperature' || word === 'weather'){
        //       this.weatherHandler(this.weather);
        //       break;
        //     } else if (word === 'great' && prevWord === 'you\'re'){

        //       this.complimentHandler();
        //       break;

        //     } else if (word === 'hello'){
        //       window.speechSynthesis.speak(new SpeechSynthesisUtterance('Hello Steven'));
        //       this.props.stopListening();
        //       this.found = true;
        //     } else if ((prevPrevWord === 'define' || prevPrevWord === 'Define') && word === 'please'){
        //       this.definitionHandler(prevWord);
        //       //stopListening();
        //     }
        //   }

        //   prevPrevWord = prevWord;
        //   prevWord = word;
        // }

