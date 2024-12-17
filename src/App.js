import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [totalFoodAmount, setTotalFoodAmount] = useState("");
  const [totalLiquorAmount, setTotalLiquorAmount] = useState("");
  const [totalCigaretteAmount, setTotalCigaretteAmount] = useState("");
  const [friends, setFriends] = useState([]);
  const [billResult, setBillResult] = useState([]);

  // Function to generate a random pastel color
  const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 127 + 128); // Generate values between 128-255
    const g = Math.floor(Math.random() * 127 + 128);
    const b = Math.floor(Math.random() * 127 + 128);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const addFriend = () => {
    setFriends([
      ...friends,
      { name: "", drinks: false, smokes: false, color: getRandomPastelColor() },
    ]);
  };

  const updateFriend = (index, key, value) => {
    const updatedFriends = [...friends];
    updatedFriends[index][key] = value;
    setFriends(updatedFriends);
  };

  const calculateBill = async () => {
    try {
      const response = await axios.post("http://localhost:5000/calculate-bill", {
        totalFoodAmount: parseFloat(totalFoodAmount),
        totalLiquorAmount: parseFloat(totalLiquorAmount),
        totalCigaretteAmount: parseFloat(totalCigaretteAmount),
        friends,
      });
      setBillResult(response.data);
    } catch (error) {
      console.error("Error calculating bill:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Bill Splitter</h1>

      {/* Total Amounts Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Total Amounts</h5>
          <div className="mb-3">
            <label className="form-label">Total Food Amount (Rs):</label>
            <input
              type="number"
              className="form-control"
              value={totalFoodAmount}
              onChange={(e) => setTotalFoodAmount(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Total Liquor Amount (Rs):</label>
            <input
              type="number"
              className="form-control"
              value={totalLiquorAmount}
              onChange={(e) => setTotalLiquorAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Total Cigarette Amount (Rs):</label>
            <input
              type="number"
              className="form-control"
              value={totalCigaretteAmount}
              onChange={(e) => setTotalCigaretteAmount(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Friends Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Friends</h5>
          <div className="row">
            {friends.map((friend, index) => (
              <div
                key={index}
                className="col-md-4 d-flex align-items-stretch mb-3" // Added spacing between boxes
              >
                <div
                  style={{
                    backgroundColor: friend.color,
                    borderRadius: "8px",
                    padding: "10px",
                    width: "100%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-control mb-2"
                    value={friend.name}
                    onChange={(e) => updateFriend(index, "name", e.target.value)}
                  />
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={friend.drinks}
                      onChange={(e) =>
                        updateFriend(index, "drinks", e.target.checked)
                      }
                    />
                    <label className="form-check-label">Drinks?</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={friend.smokes}
                      onChange={(e) =>
                        updateFriend(index, "smokes", e.target.checked)
                      }
                    />
                    <label className="form-check-label">Smokes?</label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Friend Button Positioned Below the Friend Boxes */}
          <div className="text-center mt-3">
            <button className="btn btn-primary w-100" onClick={addFriend}>
              Add Friend
            </button>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-4">
        <button className="btn btn-success w-100" onClick={calculateBill}>
          Calculate Bill
        </button>
      </div>

      {/* Results Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Results</h5>
          <ul className="list-group">
            {billResult.map((friend, index) => {
              const matchedFriend = friends[index];
              return (
                <li
                  className="list-group-item mb-2"
                  key={index}
                  style={{
                    backgroundColor: matchedFriend ? matchedFriend.color : "#f8f9fa",
                  }}
                >
                  {friend.name}: {friend.total} Rs
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
