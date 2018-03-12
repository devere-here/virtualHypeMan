import axios from 'axios'

/**
 * ACTION TYPES
 */
const SET_DINOSAUR = 'SET_DINOSAUR';

/**
 * INITIAL STATE
 */
const defaultDinosaur = '';

/**
 * ACTION CREATORS
 */
export const setDinosaur = (dinosaur) => {
  console.log('in setDinosaur');
  return {type: SET_DINOSAUR, dinosaur}
}

// //THUNKS
// export const fetchDefinition = (word) => async (dispatch) => {
//   try {

//     let value = await axios.post('api/apiRequests', {word});
//     console.log('returned this value', value);
//     let obj = {
//       text: `${word}, ${value.data[0].definition}`,
//       image: value.data[0].image
//     }

//     dispatch(getDefinition(obj));

//   }
//   catch (err) {
//     console.log(err)
//   }
// }


/**
 * REDUCER
 */
export default function (state = defaultDinosaur, action) {
  switch (action.type) {
    case SET_DINOSAUR:
      console.log('in reducer action.dinosaur ', action.dinosaur);
      return action.dinosaur
    default:
      return state
  }
}
