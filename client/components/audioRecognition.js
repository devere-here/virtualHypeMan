import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SpeechRecognition from 'react-speech-recognition'
import { fetchPhrases, fetchDefinition, fetchTasks, removeTask, addTask } from '../store'
import axios from 'axios';
var GifPlayer = require('react-gif-player');

let addedEmotion = {
    sad: (<div>
            <p>It's perfectly OK to have sad feelings at times. As long as they don't happen too often or last too long, sad feelings — like all emotions — are just a natural part of life.Everyone feels sad at times.</p>
            <h4>Here are some positive ways to deal with sad feelings:</h4>
            <ul>
              <li><b>Notice how you feel and why:</b> Knowing your emotions helps you understand and accept yourself. If you feel sad, notice it — but don't dwell on it too long or give it too much drama. Show yourself a little understanding. Remind yourself that sadness will pass and you'll feel better.
              </li>
              <li><b>Bounce back from disappointments or failures:</b> When things don't go your way, don't give up! Stay in the game. There's always next time. Give yourself credit for trying.
              </li>
              <li><b>Get support:</b> Even the most capable kids need support. The people in your life who believe in you and care (like parents, friends, and teachers) can comfort you when you feel sad.
              </li>
            </ul>
          </div>)
}

class AudioRecognition extends Component {
  constructor(props) {
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
    this.mathHandler = this.mathHandler.bind(this);
    this.toDoListHandler = this.toDoListHandler.bind(this);
    this.dictionaryUrl = '';
    this.finishedAsync = false;
    this.addedMedia = '';


  }

  componentWillReceiveProps(nextProps) {

    if ((Object.keys(nextProps).length !== 0 && this.props.definition !== nextProps.definition) || this.props.toDoList.length !== nextProps.toDoList.length) {
      this.finishedAsync = true;
    }

  }

  componentDidMount() {
    console.log('this.dinosaur is', this.props.dinosaur);
    if (this.props.dinosaur === 'stegosaurus') {
      this.dinosaurGifUrl = 'https://drive.google.com/uc?export=download&id=1jwO0PLd1G4jNBQcbtsW3zDHsc1_K9Kf-';
    } else if (this.props.dinosaur === 'tyrannosaurus') {
      this.dinosaurGifUrl = 'https://drive.google.com/uc?export=download&id=10oYkrHB_q2plQJxzELy8EyKsheHEgEip';

    } else {
      this.dinosaurGifUrl = 'https://drive.google.com/uc?export=download&id=1G2eR26NW6DJGbUkAsSRsvafatiqzpKR1';

    }

  }


  async getGeoLocation() {
    let weatherUrl;
    if (navigator.geolocation) {

      weatherUrl = await navigator.geolocation.getCurrentPosition((position) => {
        weatherUrl = `https://fcc-weather-api.glitch.me/api/current?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        axios.get(weatherUrl)
          .then((weatherData) => {
            this.weather = weatherData;
          })
      })
    }
  }

  renderSwitch = (type) => {

    switch (type) {
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
          <div>
            {console.log('this should be an array', this.response)}
            <h3>The answer is {this.response}</h3>

          </div>
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
                <img height="150" src={this.props.definition.image} />
              </div>)
            }
          </div>
        )
      default:
        return (<h1>Hello Steven</h1>)
    }

  }


  clickHandler() {
    this.listening = !this.listening;
    this.found = false;
    this.finishedAsync = false;
    this.props.resetTranscript();
    this.props.listening ? this.props.stopListening() : this.props.startListening();
    this.addedMedia = '';
    this.addedEmotion = '';


  }

  onThankYou() {
    this.transcript = '';
    this.props.stopListening();
  }

  async definitionHandler(word) {
    this.typeOfResponse = 'definition';
    this.found = true;
    this.props.stopListening();


    await this.props.loadDefinition(word)

  }

  emotionHandler(word) {

    this.response = this.props.motivationalWords[word].response;
    this.videoUrl = this.props.motivationalWords[word].videoUrl;
    this.addedMedia = <iframe src={`${this.videoUrl}?autoplay=1`} allow="autoplay; encrypted-media" allowFullScreen />
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
    this.props.stopListening();
    this.found = true;
    this.typeOfResponse = 'feeling';
    this.typeOfEmotion = word;

  }

  weatherHandler(weather) {

    if (weather) {

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
    this.addedMedia = <img height="150px" src={this.props.weatherImages[this.weather.data.weather[0].main]} />

  }

  // greetingHandler() {
  //   window.speechSynthesis.speak(new SpeechSynthesisUtterance('Hello Steven'));
  //   this.props.stopListening();
  //   this.found = true;

  // }

  // complimentHandler() {
  //   window.speechSynthesis.speak(new SpeechSynthesisUtterance('Thank You'));
  //   this.props.stopListening();
  //   this.found = true;

  // }

  mathHandler(firstNumber, secondNumber, operation) {

    let answer;
    if (operation === '+' || operation === 'plus') {
      answer = firstNumber + secondNumber;
    } else if (operation === '-' || operation === 'minus') {
      answer = firstNumber - secondNumber;
    } else if (operation === '*' || operation === 'times' || operation === 'multiplied') {
      answer = firstNumber * secondNumber;
    } else if (operation === '/' || operation === 'divided') {
      answer = firstNumber / secondNumber;
    }

    window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
    this.props.stopListening();
    this.found = true;
    this.response = `The answer is ${answer}`;
    this.typeOfResponse = 'math';

  }

  toDoListHandler(arr, index) {
    let modifierIndex;
    let endingIndex;

    if (arr.includes('add')) {
      modifierIndex = arr.indexOf('add');
      endingIndex = arr[index - 1] === 'to-do' ? index - 3 : index - 4;

      let newTask = arr.slice(modifierIndex + 1, endingIndex);

      this.props.addToToDoList(newTask.join(' '));

      this.response = `You  have just added ${newTask.join(' ')} to your to-do list`;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));
      this.props.stopListening();
      this.found = true;
      //this.response = newTask.join(' ');
      this.typeOfResponse = 'list';
      this.listening = 'false';



    } else if (arr.includes('remove') || arr.includes('delete')) {

      modifierIndex = arr.indexOf('remove');
      if (modifierIndex === -1) {
        modifierIndex = arr.includes('delete');
      }
      endingIndex = arr[index - 1] === 'to-do' ? index - 3 : index - 4;
      let removedTask = arr.slice(modifierIndex + 1, endingIndex);


      this.props.removeFromToDoList(removedTask.join(' ').toLowerCase());
      this.response = `You  have just removed ${removedTask.join(' ')} from your to-do list`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.response));


    } else {

      let list = this.props.toDoList.map((task) => task.task);
      list = list.join(', ');

      if (this.props.toDoList.length > 1) {
        let lastIndex = list.lastIndexOf(',');
        list = list.substring(0, lastIndex) + ' and ' + list.substring(lastIndex + 1);
      }

      list = `There are ${this.props.toDoList.length} things on your to do list. You should ${list}`;
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(list));
      this.response = list;

    }

    this.props.stopListening();
    this.found = true;
    this.typeOfResponse = 'list';
    this.listening = 'false';

  }

  render() {
    console.log('dinosaur', this.props.dinosaur);

    const { transcript, stopListening, browserSupportsSpeechRecognition, listening } = this.props;

    let transcriptArr = transcript.split(' ');
    let prevWord = '';
    let prevPrevWord = '';

    if (listening === true) {
      for (let word of transcriptArr) {
        if (word === 'please') {
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
          if (spokenDefinition) {
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

          if (spokenOperation) {
            let index = transcriptArr.indexOf(spokenOperation);
            let secondIndex = spokenOperation === 'divided' || spokenOperation === 'multiplied' ? index + 2 : index + 1;
            this.mathHandler(transcriptArr[index - 1], transcriptArr[secondIndex], spokenOperation);
          }

          let spokenWeather = transcriptArr.find((word) => {
            return word === 'weather' || word === 'temperature'
          });

          if (spokenWeather) {
            this.weatherHandler(this.weather);
            break;
          }

          if (transcriptArr.includes('list')) {
            let index = transcriptArr.indexOf('list');
            if ((transcriptArr[index - 2] === 'to' && transcriptArr[index - 1] === 'do') || transcriptArr[index - 1] === 'to-do') {
              this.toDoListHandler(transcriptArr, index);

            }
          }

        }

      }

    }

    if (!browserSupportsSpeechRecognition) {
      return null
    }

    //return (

    console.log('this.typeOfResponse', this.typeOfResponse, 'this.addedEmotion', this.addedEmotion, 'this.typeOfEmotion', this.typeOfEmotion);
      return (

        <div id="audioPage">
          <button id="audioPageButton" onClick={this.clickHandler}>{listening ? 'Stop' : 'Start'}</button>
          <div id="audioUserBubble">
            <h2>{transcript}</h2>
          </div>
          <div id="audioDinoBubble">
            <div id="audioDinoPicture"><GifPlayer gif={this.dinosaurGifUrl} /></div>
            {this.typeOfResponse !== 'definition'
            ? (
              <div>
                <h2 id="audioDinoH2">{this.response}</h2>
                <div className="responseImage">{this.addedMedia}</div>
                <div>{this.typeOfResponse === 'feeling' ? addedEmotion[this.typeOfEmotion] : null}</div>
              </div>
            )
            :(
              <div>{this.renderSwitch(this.typeOfResponse)}</div>
            )

            }

          </div>
        </div>

      )




      // <div>


      //   <button onClick={this.clickHandler}>{listening ? 'Stop' : 'Start'}</button>
      //   <span>{transcript}</span>
      //   <GifPlayer gif={this.dinosaurGifUrl} autoplay />
      //   {!this.found
      //     ? null
      //     : (<div>{this.renderSwitch(this.typeOfResponse)}</div>)
      //   }
      // </div>
    //)
  }

}

/**
 * CONTAINER
 */
const mapState = (state) => {
  console.log('in mapState state is ', state);
  return {
    motivationalWords: state.motivationalWords,
    definition: state.dictionary,
    toDoList: state.toDoList,
    dinosaur: state.dinosaur,
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
    loadPhraseData() {
      dispatch(fetchPhrases());
    },
    loadDefinition(word) {
      dispatch(fetchDefinition(word));
    },
    loadToDoList() {
      dispatch(fetchTasks());
    },
    addToToDoList(task) {
      dispatch(addTask(task));
    },
    removeFromToDoList(task) {
      dispatch(removeTask(task));
    }
  }
}

const options = {
  autoStart: false
}



export default connect(mapState, mapDispatch)(SpeechRecognition(options)(AudioRecognition))


// return (

//   <div id="audioPage">
//     <button id="audioPageButton" onClick={this.clickHandler}>{listening ? 'Stop' : 'Start'}</button>
//     <div id="audioUserBubble">
//       <h2>{transcript}</h2>
//     </div>
//     <div id="audioDinoBubble">
//       <div><GifPlayer id="audioDinoPicture" gif={this.dinosaurGifUrl} />
//       <h2 id="audioDinoH2">{response}</h2></div>
//       <div className="responseImage">{addedMedia}</div>
//     </div>
//   </div>

// )

