import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cryptoDataAction } from "./component/redux/action/cryptocurrencyDataAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./App.css";
import Coin from "./component/OnlineCurrency";
import CryptoChart from "./component/CryptocurrencyList";
import Exchange_buttons from "./component/ButtonCryptoExchanger";
import DisplayMarketCap from "./component/DisplayMarketCap";
import currencySymbols from "./component/serve_of_currency/Symbolsofcurrency";
import Nav from "./component/Navbar";
import monthWiseActions from "./component/redux/action/EverymonthDataAction";

const currencyOptions = [
  { value: "bitcoin", label: "Bitcoin" },
  { value: "ethereum", label: "Ethereum" },
  { value: "tether", label: "Tether" },
  { value: "ripple", label: "Ripple" },
  { value: "binancecoin", label: "Binance Coin" },
];

function App() {
  const dispatch = useDispatch();

  const GET_CRYPTO = useSelector((state) => state.GET_CRYPTO);
  const GET_MONTH_WISE = useSelector((state) => state.GET_MONTH_WISE);

  const { loading: loadingCrypto, coins, error: errorCrypto } = GET_CRYPTO;
  const { loading: loadingMonthWise, data, error: errorMonthWise } = GET_MONTH_WISE;

  const [overallLoading, setOverallLoading] = useState(true);
  const [overallError, setOverallError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [selectedCurrencies, setSelectedCurrencies] = useState([currencyOptions[0]]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const variousCountriesCurrency = ["usd", "inr", "euro", "aed", "yuan", "ruble", "yen"];

  useEffect(() => {
    dispatch(monthWiseActions(selectedCurrencies.map((currency) => currency.value)));
    dispatch(cryptoDataAction());
  }, [dispatch, selectedCurrencies]);

  useEffect(() => {
    if (!loadingCrypto && !loadingMonthWise) {
      setOverallLoading(false);
      if (errorCrypto || errorMonthWise) setOverallError(true);
      else setOverallError(false);
    } else {
      setOverallLoading(true);
    }
  }, [loadingCrypto, loadingMonthWise, errorCrypto, errorMonthWise]);

  const handleRetry = () => {
    setOverallError(null);
    dispatch(cryptoDataAction());
    dispatch(monthWiseActions(selectedCurrencies.map((currency) => currency.value)));
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrencies((prev) => {
      if (prev.some((selected) => selected.value === currency.value)) {
        return prev.filter((selected) => selected.value !== currency.value);
      } else {
        return [...prev, currency];
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const result = coins.find(
      (coin) => coin.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSearchResult(result ? result : "No coins found");
  };

  const closeModal = () => setSearchResult(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="app-container dark-theme">
      {overallLoading ? (
        <h2 className="loading-text">
          Loading Your Dashboard... <span id="spinner"></span>
        </h2>
      ) : overallError ? (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={handleRetry} className="retry-btn">
            ⟳ Retry
          </button>
        </div>
      ) : (
        <>
          <div className="nav-container">
            <Nav />
          </div>

          <div className="dashboard">
            <div className="dashboard-left">
              {/* ===== Search + Currency Dropdown ===== */}
              <div className="search-container">
                <div className="select-wrapper">
                  <label className="select-label">Currency</label>
                  <select
                    className="currency-select enhanced"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {variousCountriesCurrency.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="search"
                    placeholder="Search Coin..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input enhanced"
                  />
                </form>
              </div>

              {/* ===== Cryptocurrency Multi-Select Dropdown ===== */}
              <div className="chart-section">
                <div className="currency-dropdown enhanced" ref={dropdownRef}>
                  <div
                    className="dropdown-toggle enhanced"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    Cryptocurrency <KeyboardArrowDownIcon />
                  </div>

                  {dropdownOpen && (
                    <div className="dropdown-menu enhanced-menu">
                      {currencyOptions.map((currency) => (
                        <label key={currency.value} className="dropdown-item enhanced-item">
                          <input
                            type="checkbox"
                            checked={selectedCurrencies.some(
                              (selected) => selected.value === currency.value
                            )}
                            onChange={() => handleCurrencyChange(currency)}
                          />
                          <span>{currency.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <CryptoChart
                  data={data}
                  selectedCurrencies={selectedCurrencies.map((c) => c.value)}
                  className="crypto-chart"
                />
              </div>

              <div className="portfolio-exchange-section">
                <div className="portfolio-chart">
                  <Coin coin={coins} />
                </div>
                <div className="exchange-section">
                  <Exchange_buttons coin={coins} />
                </div>
              </div>
            </div>

            <div className="dashboard-right">
              <DisplayMarketCap coins={coins} selectedCurrency={selectedCurrency} />
            </div>
          </div>

          <div className="footer">
            <h1>Made with ❤️ by Rohan ©️ 2025</h1>
          </div>

          {searchResult && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>
                  &times;
                </button>
                {typeof searchResult === "string" ? (
                  <p>{searchResult}</p>
                ) : (
                  <div className="modal-coin-info">
                    <img
                      src={searchResult.image}
                      alt={searchResult.name}
                      className="modal-coin-img"
                    />
                    <h3>{searchResult.name}</h3>
                    <p>
                      Current Price: {currencySymbols[selectedCurrency]}
                      {searchResult.current_price.toLocaleString()}
                    </p>
                    <p>
                      Market Cap: {currencySymbols[selectedCurrency]}
                      {searchResult.market_cap.toLocaleString()}
                    </p>
                    <p
                      className={`price-change ${
                        searchResult.price_change_percentage_24h >= 0 ? "green" : "red"
                      }`}
                    >
                      {searchResult.price_change_percentage_24h >= 0 ? "▲" : "▼"}
                      {searchResult.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
