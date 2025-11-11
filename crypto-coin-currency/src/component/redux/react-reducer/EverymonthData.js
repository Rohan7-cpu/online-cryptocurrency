// Import action type constants
import {
   GET_MONTHSOFYEAR_REQUEST,
   GET_MONTHSOFYEAR_PASSED,
   GET_MONTHSOFYEAR_FAILED,
} from '../react-consistent/EverymonthDataConstant';

// Define the initial state of the reducer
const initialState = {
  loading: false, // Indicates if the data is being loaded
  data: null,     // Holds the fetched month-wise data
  error: null,    // Holds any error that occurs during the fetch process
};

// Reducer function to handle state updates based on dispatched actions
export const monthWiseReducer = (state = initialState, action) => {
  switch (action.type) {
    // Case to handle request initiation
    case GET_MONTHSOFYEAR_REQUEST:
      return {
        ...state,         // Spread current state to retain unchanged values
        loading: true,    // Set loading to true while fetching data
        error: null,      // Reset error to null for a new request
      };

    // Case to handle successful data fetch
    case  GET_MONTHSOFYEAR_PASSED:
      return {
        ...state,         // Spread current state
        loading: false,   // Set loading to false as the request is completed
        data: action.payload, // Update state with the fetched data
        error: null,      // Ensure no error is present
      };

    // Case to handle errors during the fetch process
    case  GET_MONTHSOFYEAR_FAILED:
      return {
        ...state,         // Spread current state
        loading: false,   // Set loading to false as the request failed
        error: action.payload, // Update error with the error message/payload
      };

    // Default case: return the current state if action type doesn't match
    default:
      return state;
  }
};

export default monthWiseReducer;
