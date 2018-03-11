import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TASKS = 'GET_TASKS';

/**
 * INITIAL STATE
 */
const defaultList = [];

/**
 * ACTION CREATORS
 */
const getTasks = (tasks) => ({type: GET_TASKS, tasks})


//THUNKS
export const fetchTasks = () => async (dispatch) => {
  try {
    const toDoList = await axios.get('/api/todolist');
    //let toDoList = {};
    // toDoList.data.forEach((task) => {
    //   toDoList[task.task] = {
    //     task: phrase.motivationalWords,
    //     videoUrl: phrase.videoUrl
    //   };

    // })
    dispatch(getTasks(toDoList.data));
    return toDoList;
  }
  catch (err) {
    console.log(err)
  }
}


/**
 * REDUCER
 */
export default function (state = defaultList, action) {
  switch (action.type) {
    case GET_TASKS:
      return action.tasks
    default:
      return state
  }
}
