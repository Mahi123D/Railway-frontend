import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

const App = () => {
  const [incidentType, setIncidentType] = useState('');
  const [gender, setGender] = useState('');
  const [animalDescription, setAnimalDescription] = useState('');
  const [stolenItems, setStolenItems] = useState('');
  const [location, setLocation] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [searchedIncidents, setSearchedIncidents] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/railway/saveData', {
        incidentType,
        gender,
        animalDescription,
        stolenItems,
        location
      });
      console.log('Incident submitted:', response.data);
      // Fetch all incidents again to update the list
      fetchIncidents();
    } catch (error) {
      console.error('Error submitting incident:', error);
    }
  };

  const handleSearch = () => {
    if (!incidentType) {
      setSearchedIncidents(incidents);
    } else {
      const filteredIncidents = incidents.filter(incident => incident.incidentType === incidentType);
      setSearchedIncidents(filteredIncidents);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/railway/getData');
      setIncidents(response.data.data);
      setSearchedIncidents(response.data.data); // Initialize searchedIncidents with all incidents
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="container">
      <h1>Railway Incident Management</h1>
      <form className="incident-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type of Incident:</label>
          <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
            <option value="">Select...</option>
            <option value="Human Accident">Human Accident</option>
            <option value="Animal Accident">Animal Accident</option>
            <option value="Railway Track Derailment">Railway Track Derailment</option>
            <option value="Theft in Boogey">Theft in Boogey</option>
            <option value="Theft on Platform">Theft on Platform</option>
          </select>
        </div>
        {incidentType === 'Human Accident' && (
          <div className="form-group">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
        {incidentType === 'Animal Accident' && (
          <div className="form-group">
            <label>Animal Description:</label>
            <input type="text" value={animalDescription} onChange={(e) => setAnimalDescription(e.target.value)} />
          </div>
        )}
        {incidentType.startsWith('Theft') && (
          <div className="form-group">
            <label>Stolen Items:</label>
            <input type="text" value={stolenItems} onChange={(e) => setStolenItems(e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button className="submit-btn" type="submit">Submit</button>
      </form>

      <div className="search-container">
        <label>Search by Incident Type:</label>
        <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
          <option value="">All</option>
          <option value="Human Accident">Human Accident</option>
          <option value="Animal Accident">Animal Accident</option>
          <option value="Railway Track Derailment">Railway Track Derailment</option>
          <option value="Theft in Boogey">Theft in Boogey</option>
          <option value="Theft on Platform">Theft on Platform</option>
        </select>
        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      <div className="incidents-list">
        <h2>Incidents</h2>
        <ul>
          {searchedIncidents.map((incident, index) => (
            <li key={index}>
              <strong>Type:</strong> {incident.incidentType}, <strong>Gender:</strong> {incident.gender || 'N/A'}, <strong>Location:</strong> {incident.location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
