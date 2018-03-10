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
const getDefinition = (definition) => ({type: GET_DEFINITION, definition})


//THUNKS
export const fetchDefinition = (word) => async (dispatch) => {
  try {

    let value = await axios.post('api/apiRequests', {word});
    console.log('returned this value', value);
    let obj = {
      text: `${word}, ${value.data[0].definition}`,
      image: value.data[0].image
    }

    console.log('this will be definition', obj);

    dispatch(getDefinition(obj));

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
      console.log('in reducer action.definition ', action.definition);
      return action.definition
    default:
      return state
  }
}
