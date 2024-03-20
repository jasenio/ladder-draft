import React, { useState, useEffect } from 'react';

function MatchScoreForm() {
  const [scores, setScores] = useState({
    sets: [
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' }
    ],
    tiebreakers: [
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' }
    ],
  });

  const handleChange = (event, setIndex, player) => {
    const value = event.target.value;
    if(setIndex>=3){
      setScores(prevScores => ({
        ...prevScores,
        tiebreakers: prevScores.tiebreakers.map((set, index) => {
          if (index === setIndex-3) {
            return { ...set, [player]: value };
          }
          return set;
        })
      }));
    }
    else{
      setScores(prevScores => ({
        ...prevScores,
        sets: prevScores.sets.map((set, index) => {
          if (index === setIndex) {
            return { ...set, [player]: value };
          }
          return set;
        })
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting Scores: ", scores);
    // Further processing...
    const setScoresArray = [
      { playerOne: scores.sets[0].playerOne, playerTwo: scores.sets[0].playerTwo },
      { playerOne: scores.sets[1].playerOne, playerTwo: scores.sets[1].playerTwo },
      { playerOne: scores.sets[2].playerOne, playerTwo: scores.sets[2].playerTwo },
    ];
    const tieScoresArray = [
      { playerOne: scores.tiebreakers[0].playerOne, playerTwo: scores.tiebreakers[0].playerTwo },
      { playerOne: scores.tiebreakers[1].playerOne, playerTwo: scores.tiebreakers[1].playerTwo },
      { playerOne: scores.tiebreakers[2].playerOne, playerTwo: scores.tiebreakers[2].playerTwo },
    ];

    const validationErrors = [];

    let winCount = 0;
    for (let index = 0; index < setScoresArray.length; index++) {
      const set = setScoresArray[index];
      const { playerOne, playerTwo } = set;
      const playerOneGames = parseInt(playerOne, 10);
      const playerTwoGames = parseInt(playerTwo, 10);
      
      const tieOne = parseInt(tieScoresArray[index].playerOne, 10);
      const tieTwo = parseInt(tieScoresArray[index].playerTwo, 10);
      
      //Checks if more than two sets were won
      if(Math.abs(winCount)===2){
        if(playerOneGames!==''){
          break;
        }
        else{
          validationErrors.push(`Set ${index + 1} has invalid scores.`);
        }
      }
      //Checks if a number
      if(!isNaN(playerOneGames) || !isNaN(playerTwoGames)){
        //check for negative
        if(playerOneGames < 0 || playerTwoGames < 0){
          validationErrors.push(`Set ${index + 1} has invalid scores.`);
        }

        //Checks for a tiebreaker
        if((playerOneGames===6 && playerTwoGames===7) || (playerOneGames===7 && playerTwoGames===6)){
            if(playerOneGames===6){
              if(tieOne < 0 || tieTwo < 0){
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if both players have reached at least 7 points
              if (tieOne < 7 && tieTwo < 7) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if the difference between the scores is at least 2
              const scoreDifference = tieOne-tieTwo;
              if (scoreDifference < 2) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if either player has reached 7 points and wins by 2
              if (tieOne >= 7 || tieTwo >= 7) {
                  if (scoreDifference !== 2) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.`);
                  }
              }
            }
            else{
              if(tieOne < 0 || tieTwo < 0){
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if both players have reached at least 7 points
              if (tieOne < 7 && tieTwo < 7) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }

              // Check if the difference between the scores is at least 2
              const scoreDifference = tieTwo-tieOne;
              if (scoreDifference < 2) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
            }
        }
        //Checks for third tiebreaker
        else if(((playerOneGames===1 && playerTwoGames===0) || (playerOneGames===0 && playerTwoGames===1)) && index ===2){
            if(playerOneGames===1){
              if(tieOne < 0 || tieTwo < 0){
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if both players have reached at least 7 points
              if (tieOne < 11 && tieTwo < 11) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if the difference between the scores is at least 2
              const scoreDifference = tieOne-tieTwo;
              if (scoreDifference < 2) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if either player has reached 7 points and wins by 2
              if (tieOne >= 11 || tieTwo >= 11) {
                  if (scoreDifference !== 2) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.`);
                  }
              }
            }
            else{
              if(tieOne < 0 || tieTwo < 0){
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if both players have reached at least 7 points
              if (tieOne < 11 && tieTwo < 11) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if the difference between the scores is at least 2
              const scoreDifference = tieTwo-tieOne;
              if (scoreDifference < 2) {
                validationErrors.push(`Set ${index + 1} has invalid scores.`);
              }
              // Check if either player has reached 7 points and wins by 2
              if (tieOne >= 11 || tieTwo >= 11) {
                  if (scoreDifference !== 2) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.`);
                  }
              }
            }
        }
        else if(Math.abs(playerOneGames - playerTwoGames) < 2 ){
            validationErrors.push(`Set ${index + 1} has invalid scores.`);
        }
        else if((playerOneGames < 6 && playerTwoGames < 6) || playerOneGames > 7 || playerTwoGames > 7){
              validationErrors.push(`Set ${index + 1} has invalid scores.`);
        }
      }
      else{
        validationErrors.push(`Set ${index + 1} has invalid scores.`);
      }
      winCount += playerOneGames>playerTwoGames? 1: -1;
    };

    if (validationErrors.length > 0) {
      // Handle errors
      console.log("Validation Errors:", validationErrors);
    } else {
      // Proceed with valid scores
      console.log("Scores are valid!");
    }
  };


  return (
    <form className="match-form" onSubmit={handleSubmit}>
        <div className="sets-container">
          {scores.sets.map((set, index) => (
            <div className ="set-all">
            <label>
                {`Set ${index+1}`}
            </label>
            <div key={index} className="set-container">
              <div className="set-score">
                <div>
                  <input
                    type="number"
                    value={set.playerOne}
                    onChange={(e) => handleChange(e, index, 'playerOne')}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={set.playerTwo}
                    onChange={(e) => handleChange(e, index, 'playerTwo')}
                  />
                </div>
              </div>
              {((index===2 && (String(set.playerOne) === '1' && String(set.playerTwo) === '0') || (String(set.playerOne) === '0' && String(set.playerTwo) === '1')) 
                || ((String(set.playerOne) === '6' && String(set.playerTwo) === '7') || (String(set.playerOne) === '7' && String(set.playerTwo) === '6')))
              && (
                <div className="tiebreak-score">
                  <div>
                    <input
                      type="number"
                      value={scores.tiebreakers[index].playerOne}
                      onChange={(e) => handleChange(e, 3 + index, 'playerOne')}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={scores.tiebreakers[index].playerTwo}
                      onChange={(e) => handleChange(e, 3 + index, 'playerTwo')}
                    />
                  </div>
                </div>
              )}
            </div>
            </div>
          ))}
        </div>
        <button type="submit">Submit Scores</button>
      </form>

    
  );
}

export default MatchScoreForm;
