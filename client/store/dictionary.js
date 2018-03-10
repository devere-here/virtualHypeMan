import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_DEFINITION = 'GET_DEFINITION';

/**
 * INITIAL STATE
 */
const defaultDefinition = {}

/**
 * ACTION CREATORS
 */
const getPhrases = (definition) => ({type: GET_DEFINITION, definition})


//THUNKS
export const fetchDefinition = (word) => async (dispatch) => {
  try {
    const phrases = await axios.get(`https://owlbot.info/api/v2/dictionary/${word}/?format=json`);
    console.log('phrases', phrases);
    // let phraseObj = {};
    // phrases.data.forEach((phrase) => {
    //   phraseObj[phrase.keyWord] = {
    //     response: phrase.motivationalWords,
    //     videoUrl: phrase.videoUrl
    //   };

    // })
    // dispatch(getPhrases(phraseObj));
    // return phrases
  }
  catch (err) {
    console.log(err)
  }
}


/**
 * REDUCER
 */
export default function (state = defaultDefinition, action) {
  switch (action.type) {
    case GET_DEFINITION:
      return action.definition
    default:
      return state
  }
}
