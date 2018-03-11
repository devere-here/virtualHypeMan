import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TASKS = 'GET_TASKS';
const ADD_TASK = 'ADD_TASK';
const REMOVE_TASK = 'REMOVE_TASK';


/**
 * INITIAL STATE
 */
const defaultList = [];

/**
 * ACTION CREATORS
 */
const getTasks = (tasks) => ({type: GET_TASKS, tasks});
const postTask = (task) => ({type: ADD_TASK, task});
const deleteTask = (task) => ({type: REMOVE_TASK, task});




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

export const removeTask = (removedTask) => async (dispatch) => {
  try {
    console.log('about to remove', removedTask);
    dispatch(deleteTask(removedTask));

    const toDoList = await axios.delete('/api/todolist', {data: {task: removedTask}});
    console.log('passing to deleteTask', toDoList.data);
    //dispatch(deleteTask(toDoList.data));
    return toDoList;
  }
  catch (err) {
    console.log(err)
  }
}

export const addTask = (newTask) => async (dispatch) => {
  try {
    console.log('about to add', newTask);
    const toDoList = await axios.post('/api/todolist', {task: newTask});
    console.log('toDoList', toDoList);
    dispatch(postTask(toDoList.data));
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
    case ADD_TASK:
      return state.concat(action.task);
    case REMOVE_TASK:
    console.log('task', action.task);
    console.log('state', state);
    console.log('action.task', action.task);
      console.log('in REMOVE_TASK', state.filter((task) => task !== action.task));
      return state.filter((task) => {
        console.log('in loop task', task);
        console.log('in loop action.task', action.task);

        return task.task.toLowerCase() !== action.task.toLowerCase();
      });
    default:
      return state
  }
}
