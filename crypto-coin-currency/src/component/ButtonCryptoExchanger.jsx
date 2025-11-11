import React, { useState, useEffect } from 'react';
import '../App.css';

const Exchange_Buttons = ({ coin }) => {
  const [fromCoinId, setFromCoinId] = useState('bitcoin');
  const [toCoinId, setToCoinId] = useState('ethereum');
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [tempAmount, setTempAmount] = useState('');

  useEffect(() => {
    const fromCoin = coin?.find(c => c.id === fromCoinId);
    const toCoin = coin?.find(c => c.id === toCoinId);
    if (fromCoin && toCoin) {
      const calculatedRate = toCoin.current_price / fromCoin.current_price;
      setRate(calculatedRate);
    }
  }, [fromCoinId, toCoinId, coin]);

  useEffect(() => {
    if (fromAmount && rate) {
      setToAmount((fromAmount * rate).toFixed(6));
    } else {
      setToAmount(0);
    }
  }, [fromAmount, rate]);

  const handleExchangeClick = () => {
    if (fromAmount && rate) {
      setToAmount((fromAmount * rate).toFixed(6));
    }
    alert("Exchange rate calculated successfully!");
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) > 0) {
      setTempAmount(value);
      if (value !== '') setFromAmount(parseFloat(value));
    }
  };

  const handleFromBlur = () => {
    if (tempAmount === '') {
      setTempAmount(fromAmount.toString());
    }
  };

  useEffect(() => {
    setTempAmount(fromAmount.toString());
  }, [fromAmount]);

  return (
    <div style={{
      maxWidth: "400px",
      margin: "20px auto",
      padding: "15px",
      borderRadius: "12px",
      backgroundColor: "#1f2937",
      boxShadow: "0 6px 15px rgba(0,0,0,0.3)"
    }}>
      
      <h2 style={{ textAlign: "center", color: "#fff", fontSize: "1.5rem", marginBottom: "15px", fontWeight: "bold" }}>
        🔁 Crypto Exchange
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* FROM COIN */}
        <div style={{ backgroundColor: "#374151", padding: "10px", borderRadius: "8px", border: "1px solid #f87171" }}>
          <label style={{ color: "#f87171", fontWeight: "600", fontSize: "0.9rem" }}>From (Sell)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "5px" }}>
            <input
              type="number"
              value={tempAmount}
              onChange={handleFromAmountChange}
              onBlur={handleFromBlur}
              min="0"
              placeholder="0.00"
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #6b7280",
                backgroundColor: "#111827",
                color: "#f87171",
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}
            />
            <select
              value={fromCoinId}
              onChange={(e) => setFromCoinId(e.target.value)}
              style={{
                width: "90px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #6b7280",
                backgroundColor: "#111827",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.85rem"
              }}
            >
              {coin?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Rate */}
        <div style={{ textAlign: "center", color: "#9ca3af", fontWeight: "500", fontSize: "0.85rem" }}>
          Rate: 1 {fromCoinId} = {rate.toFixed(6)} {toCoinId}
        </div>

        {/* TO COIN */}
        <div style={{ backgroundColor: "#374151", padding: "10px", borderRadius: "8px", border: "1px solid #34d399" }}>
          <label style={{ color: "#34d399", fontWeight: "600", fontSize: "0.9rem" }}>To (Buy)</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "5px" }}>
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.000000"
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #6b7280",
                backgroundColor: "#111827",
                color: "#34d399",
                fontWeight: "bold",
                fontSize: "0.9rem",
                cursor: "default"
              }}
            />
            <select
              value={toCoinId}
              onChange={(e) => setToCoinId(e.target.value)}
              style={{
                width: "90px",
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #6b7280",
                backgroundColor: "#111827",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.85rem"
              }}
            >
              {coin?.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Button */}
        <button
          onClick={handleExchangeClick}
          disabled={!fromAmount || fromAmount <= 0}
          style={{
            marginTop: "12px",
            width: "60%",
            alignSelf: "center",
            padding: "8px",
            borderRadius: "6px",
            backgroundColor: "#6366f1",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Execute Exchange
        </button>
      </div>
    </div>
  );
};

export default Exchange_Buttons;
