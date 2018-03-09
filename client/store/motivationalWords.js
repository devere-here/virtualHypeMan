import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_PHRASES = 'GET_PHRASES';

/**
 * INITIAL STATE
 */
const defaultPhrase = {}

/**
 * ACTION CREATORS
 */
const getPhrases = (phrases) => ({type: GET_PHRASES, phrases})


//THUNKS
export const fetchPhrases = () => async (dispatch) => {
  try {
    const phrases = await axios.get('/api/phrases');
    let phraseObj = {};
    phrases.data.forEach((phrase) => {
      phraseObj[phrase.keyWord] = {
        response: phrase.motivationalWords,
        videoUrl: phrase.videoUrl
      };

    })
    dispatch(getPhrases(phraseObj));
    return phrases
  }
  catch (err) {
    console.log(err)
  }
}


/**
 * REDUCER
 */
export default function (state = defaultPhrase, action) {
  switch (action.type) {
    case GET_PHRASES:
      return action.phrases
    default:
      return state
  }
}
