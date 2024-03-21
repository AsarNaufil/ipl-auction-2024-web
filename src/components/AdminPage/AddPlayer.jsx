// import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const TEAMS = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PBKS", "RCB", "RR", "SRH"];

const AddPlayerForm = () => {
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [slot, setSlot] = useState('');
  const [price, setPrice] = useState('');
  const [msgDisplay, setMsgDisplay] = useState(false);
  const [resMsg, setResMsg] = useState('');

  const timeOut = () => {
    setTimeout(() => {
      setMsgDisplay(false); 
    }, 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVERURL}/adminAddPlayer`, {
        playerName,
        teamName,
        slot: Number(slot),
        price: Number(price),
      });

      setResMsg(response.data.message);
      setMsgDisplay(true);
      setPlayerName('');
      setTeamName('');
      setPrice('');
      timeOut();
    } catch (err) {
      console.error('Error submitting form: ', err);
    }
  };

  return (
    <>
      {msgDisplay && <h2 className='response-text'> {resMsg} </h2>}
      <div className="admin-form-container">
        <h2 className='h2'>Add Player</h2>

        <form onSubmit={handleSubmit} className="form">
          <label className='label'>
            Team Name:
            <select className='select' value={teamName} onChange={(e) => setTeamName(e.target.value)} required>
              <option className='option' value="">Select Team</option>
              {TEAMS.map((team, index) => (
                <option key={index} value={team} className='option'>
                  {team}
                </option>
              ))}
            </select>
          </label>

          <br />
          <label className='label'>
            Player Name :
            <input className='input' type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} required />
          </label>
          <br />
          <label className='label'>
            Slot :
            <input className='input' type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
          </label>
          <br />
          <label className='label'>
            Price :
            <input className='input' type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <br />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AddPlayerForm;
