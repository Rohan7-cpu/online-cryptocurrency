// Import action type constants
import {
  GET_DATAOFCRYPTOCURRENCY_REQUEST,
  GET_DATAOFCRYPTOCURRENCY_PASSED,
 GET_DATAOFCRYPTOCURRENCY_FAILED,
} from "../react-consistent/cryptocurrencyDataConstant";

// Reducer function to handle crypto data state
export const cryptoDataReducer = (state = { coins: [] }, action) => {
  switch (action.type) {
    // Case to handle the initiation of the data fetch
    case GET_DATAOFCRYPTOCURRENCY_REQUEST:
      return {
        loading: true, // Set loading state to true
        coins: [],     // Reset coins data to an empty array
      };

    // Case to handle successful data fetch
    case GET_DATAOFCRYPTOCURRENCY_PASSED:
      return {
        loading: false,     // Set loading state to false
        coins: action.payload, // Populate state with fetched coin data
      };

    // Case to handle failure during the data fetch
    case GET_DATAOFCRYPTOCURRENCY_FAILED:
      return {
        loading: false,       // Set loading state to false
        error: action.payload, // Set error message in state
      };

    // Default case: return the current state if no matching action type
    default:
      return state;
  }
};
