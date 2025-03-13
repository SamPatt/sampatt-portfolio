import { useState, useEffect } from 'react';
import './ComponentStyles.css';

const WalkingCalculator = () => {
  const [distance, setDistance] = useState(1);
  const [unit, setUnit] = useState('miles');
  const [caloriesPerDay, setCaloriesPerDay] = useState(100);
  const [caloriesPerYear, setCaloriesPerYear] = useState(36500);
  const [pounds, setPounds] = useState(10);
  const [equivalents, setEquivalents] = useState({
    pizzaSlices: 130,
    lattes: 182,
    donuts: 146
  });

  // Calculate calories based on distance and unit
  useEffect(() => {
    const caloriesPerMile = 100;
    const caloriesPerKm = 62;
    
    let dailyCalories;
    if (unit === 'miles') {
      dailyCalories = distance * caloriesPerMile;
    } else {
      dailyCalories = distance * caloriesPerKm;
    }
    
    const yearlyCalories = dailyCalories * 365;
    const fatPounds = Math.round(yearlyCalories / 3500);
    
    setCaloriesPerDay(Math.round(dailyCalories));
    setCaloriesPerYear(Math.round(yearlyCalories));
    setPounds(fatPounds);
    
    // Calculate fun equivalents
    setEquivalents({
      pizzaSlices: Math.round(yearlyCalories / 280), // Avg thin crust veggie slice ~280 cals
      lattes: Math.round(yearlyCalories / 200),      // Avg grande latte ~200 cals
      donuts: Math.round(yearlyCalories / 250)       // Avg glazed donut ~250 cals
    });
  }, [distance, unit]);

  // Handle input change
  const handleDistanceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setDistance(value);
    }
  };

  // Handle unit toggle
  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  return (
    <div className="calculator-container">
      <h3 className="calculator-title">Walking Calories Calculator</h3>
      
      <div className="calculator-inputs">
        <div className="input-group">
          <label htmlFor="distance">Daily Walking Distance:</label>
          <div className="distance-input-container">
            <input
              type="number"
              id="distance"
              min="0"
              step="0.1"
              value={distance}
              onChange={handleDistanceChange}
              className="calculator-input"
            />
            <select 
              value={unit} 
              onChange={handleUnitChange}
              className="unit-selector"
            >
              <option value="miles">miles</option>
              <option value="kilometers">kilometers</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="calculator-results">
        <div className="daily-results">
          <h4>Daily Impact</h4>
          <p>You burn approximately <strong>{caloriesPerDay} calories</strong> each day from walking.</p>
        </div>
        
        <div className="yearly-results">
          <h4>Yearly Impact</h4>
          <div className="progress-bar-container">
            <div className="progress-bar-label">Yearly calories burned: <strong>{caloriesPerYear.toLocaleString()}</strong></div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(100, (caloriesPerYear / 73000) * 100)}%` }}></div>
            </div>
          </div>
          
          <div className="fat-pounds">
            <div className="pounds-visual">
              {[...Array(Math.min(20, pounds))].map((_, i) => (
                <div key={i} className="pound-icon">🔥</div>
              ))}
            </div>
            <p><strong>{pounds} pounds</strong> of fat burned in a year</p>
          </div>
          
          <div className="equivalence-container">
            <h4>Your yearly walking equals:</h4>
            <div className="equivalent-items">
              <div className="equivalent-item">
                <span className="equivalent-icon">🍕</span>
                <div className="equivalent-text">
                  <span className="equivalent-number">{equivalents.pizzaSlices}</span>
                  <span className="equivalent-label">pizza slices</span>
                </div>
              </div>
              <div className="equivalent-item">
                <span className="equivalent-icon">☕</span>
                <div className="equivalent-text">
                  <span className="equivalent-number">{equivalents.lattes}</span>
                  <span className="equivalent-label">lattes</span>
                </div>
              </div>
              <div className="equivalent-item">
                <span className="equivalent-icon">🍩</span>
                <div className="equivalent-text">
                  <span className="equivalent-number">{equivalents.donuts}</span>
                  <span className="equivalent-label">donuts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="calculator-note">
          <p>
            <small>Based on average values: ~100 calories per mile walking, ~62 calories per kilometer, and ~3,500 calories per pound of fat.</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalkingCalculator;