import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../App';

// ✅ Mock CryptocurrencyList to avoid heavy rendering during tests
jest.mock('../component/CryptocurrencyList', () => () => <div>Mocked CryptocurrencyList</div>);

// ✅ Mock Redux dispatch to prevent real API calls
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.useFakeTimers();

describe('App component snapshot', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      GET_CRYPTO: { loading: false, coins: [], error: null },
      GET_MONTH_WISE: { loading: false, data: [], error: null },
    };
    store = mockStore(initialState);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders correctly and matches snapshot', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
