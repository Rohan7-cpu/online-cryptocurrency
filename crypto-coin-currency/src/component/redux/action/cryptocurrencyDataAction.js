import axios from 'axios';
// Import action type constants
import {
  GET_DATAOFCRYPTOCURRENCY_REQUEST,
   GET_DATAOFCRYPTOCURRENCY_PASSED,
   GET_DATAOFCRYPTOCURRENCY_FAILED,
} from '../react-consistent/cryptocurrencyDataConstant';

// API key for CoinGecko API
const apiKey = 'CG-JgyP1UZW9BcEytZtZDJKbvBR';

// List of cryptocurrency IDs that need to be displayed in the UI
// These IDs are compatible with the CoinGecko API
const ids = "bitcoin,ethereum,tether,binancecoin,terra-luna,solana,xrp,toncoin,usdc,dai,steller,stacks,maker,mantle,hedera,cronos,bonk,tron,avalanche,polkadot,uniswap,litecoin,pepe,polygon,kaspa,aptos,monero,filecoin,render,injective,okb,dogwifhat,vechain,arweave,bittensor,floki,jupiter,ondo,notcoin,fantom,core,sei,flow,gate";

// CoinGecko API endpoint for fetching cryptocurrency market data
// 'vs_currency' specifies the currency (USD in this case) for prices
const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&x_cg_demo_api_key=${apiKey}`;

// Redux action to fetch cryptocurrency market data
export const cryptoDataAction = () => async (dispatch) => {
  try {
    // Dispatch request action to indicate that loading has started
    dispatch({ type: GET_DATAOFCRYPTOCURRENCY_REQUEST });

    // Make the GET request to fetch data from the CoinGecko API
    const { data } = await axios.get(url);

    // Dispatch success action with the fetched data as payload
    dispatch({ type: GET_DATAOFCRYPTOCURRENCY_PASSED, payload: data });
  } catch (error) {
    // Handle any errors during the API call and dispatch failure action
    dispatch({
      type: GET_DATAOFCRYPTOCURRENCY_FAILED,
      payload: error.response && error.response.data.message
        ? error.response.data.message // Use API error message if available
        : error.message,              // Otherwise, use the general error message
    });
  }
};
