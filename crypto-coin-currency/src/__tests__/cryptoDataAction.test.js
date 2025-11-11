import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import {
  GET_DATAOFCRYPTOCURRENCY_REQUEST,
  GET_DATAOFCRYPTOCURRENCY_PASSED,
  GET_DATAOFCRYPTOCURRENCY_FAILED,
} from '../component/redux/react-consistent/cryptocurrencyDataConstant';
import { cryptoDataAction } from '../component/redux/action/cryptocurrencyDataAction';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new AxiosMockAdapter(axios);

describe('cryptoDataAction', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    mock.reset();
  });

  it('should dispatch GET_DATAOFCRYPTOCURRENCY_PASSED when fetching data is successful', async () => {
    const mockData = [
      { id: 'bitcoin', name: 'Bitcoin', current_price: 30000 },
      { id: 'ethereum', name: 'Ethereum', current_price: 2000 },
    ];

    mock.onGet(/api\.coingecko\.com/).reply(200, mockData);

    const expectedActions = [
      { type: GET_DATAOFCRYPTOCURRENCY_REQUEST },
      { type: GET_DATAOFCRYPTOCURRENCY_PASSED, payload: mockData },
    ];

    await store.dispatch(cryptoDataAction());
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
  });

  it('should dispatch GET_DATAOFCRYPTOCURRENCY_FAILED when fetching data fails', async () => {
    const errorMessage = 'Network Error';
    mock.onGet(/api\.coingecko\.com/).reply(500, { message: errorMessage });

    const expectedActions = [
      { type: GET_DATAOFCRYPTOCURRENCY_REQUEST },
      { type: GET_DATAOFCRYPTOCURRENCY_FAILED, payload: errorMessage },
    ];

    await store.dispatch(cryptoDataAction());
    const actions = store.getActions();

    expect(actions).toEqual(expectedActions);
  });
});
