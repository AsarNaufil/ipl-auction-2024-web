// import React from 'react';
import { useState, useEffect } from 'react';
import { Navbar } from '../Utils'
import io from 'socket.io-client';
import './LeaderboardPage.css'

// const teamsData = [
//   { name: 'Mumbai Indians', points: 20, position: 1 },
//   { name: 'Chennai Super Kings', points: 18, position: 2 },
//   { name: 'Delhi Capitals', points: 16, position: 3 },
//   { name: 'Royal Challengers Bangalore', points: 14, position: 4 },
//   { name: 'Kolkata Knight Riders', points: 12, position: 5 },
//   { name: 'Rajasthan Royals', points: 10, position: 6 },
//   { name: 'Kings XI Punjab', points: 8, position: 7 },
//   { name: 'Sunrisers Hyderabad', points: 6, position: 8 },
// ];

const socket = io(`${import.meta.env.VITE_SERVERURL}`);

const LeaderboardItem = ({ position, name, points }) => (
  <div className="flex items-center justify-between mb-3 min-h-12 text-cent er">
    <div className="text-3xl font-extrabold mx-1 min-w-8 min-h-8 p-1 px-2 bg-yellow-500 text-black">{position}</div>
    <div className="text-3xl mx-1 font-extrabold grow min-h-8 p-1 px-4 tilted-border">{name}</div>
    <div className="text-3xl font-extrabold mx-2 min-w-8 min-h-8 p-1 px-2 transform -skew-x-12 bg-yellow-500 text-black">{points}</div>
  </div>
);

const LeaderboardPage = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [teamsData, setTeamsData] = useState([]);
  const slot = localStorage.getItem("slot");

  useEffect(() => {
    socket.on('connect', () => {
      console.log("connected");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(`scoreUpdate${slot}`, (data) => {
      setTeamsData(prevTeamsData => {
        console.log(data);
        const teamName = data.payload.teamName;

        // Check if the team already exists in prevTeamsData
        const teamExists = prevTeamsData.some(team => team.name === teamName);

        // If the team doesn't exist, add it to the array
        if (!teamExists) {
          const obj = { name: teamName, points: data.payload.score };
          console.log(obj);
          return [...prevTeamsData, obj];
        }

        // If the team already exists, return the current state without modification
        return prevTeamsData;
      });
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [slot]);


  return (
    <div className="flex flex-col h-screen">
      <Navbar style={{ backdropFilter: 'blur(12.5px)' }} />
      <div className="flex flex-col items-center flex-grow overflow-y-auto custom-scrollbar" style={{ backdropFilter: 'blur(12.5px)' }}>
        <h2 className="title text-7xl my-16"> LEADERBOARD </h2>
        <div className="flex flex-col flex-grow justify-evenly p-2">
          {
            teamsData.length > 0 ? (teamsData.sort((a, b) => b.points - a.points)
              .map(
                (team, index) => <LeaderboardItem key={team.name} position={index + 1} name={team.name} points={team.points} />
              )
            ) : <div className="mt-2 text-3xl">Scoreboard will be displayed shortly...</div>
          }
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;