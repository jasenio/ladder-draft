import './styles/App.css';
import {useState, useRef, useContext, useEffect} from 'react';
import MatchScoreForm from './MatchScoreForm';

function App() {
  //Entire ladder represented by array
  const [ladder, setLadder] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(0);

  //Updates ladder
  const[finish, setFinish] = useState(false);
  const[selectRank, setSelectRank] = useState(-1);

  //Input score
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

  useEffect(()=>{
    setSelectRank(-1);
    console.log(ladder);
  }, [ladder]);
  useEffect(()=>{
    setScores({sets: [
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' }
    ],
    tiebreakers: [
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' },
      { playerOne: '', playerTwo: '' }
    ]});
  }, [selectRank]);

  //Input refs
  const inputNameRef1 = useRef('');
  const inputNameRef2 = useRef('');
  const inputNameRef3 = useRef('');

  const input1Ref1 = useRef('');
  const input2Ref1 = useRef('');
  const input1Ref2 = useRef('');
  const input2Ref2 = useRef('');
  const input1Ref3 = useRef('');
  const input2Ref3 = useRef('');


  //Gets the matches won, sets won, games won, and h2h
  const getMatchPoints = (score1, score2) => {
      let scores = score1.replace(/\([^)]*\)/g, '').split(' ');

      let matchesWon = 0;
      let matchesLost = 0;
      let setsWon = 0;
      let setsLost = 0;
      let gamesWon = 0;
      let endTiebreak = 0;
      const h2h =[0, 0];

      //Checks if special case score
      if(score1!== ''&& isNaN(parseInt(score1[0]))){
        if(score1.includes('PLAYER')){
          //Forfeit => match lost without playing match
          if(score1.includes('FORFEIT')){
            h2h[0] = -1;
            matchesLost+=3;
          }
          //Did not play => same as forfeit
          else if(score1.includes('DID')){
            h2h[0] = -1;
            matchesLost+=3;
          }
          //Injury is same as loss
          else if(score1.includes('INJURY')){
            h2h[0] = -1;
            matchesLost++;
          }
          //Retired is same as loss
          else if(score1.includes('RETIRED')){
            h2h[0] = -1;
            matchesLost++;
          }
        }
        else if(score1.includes('OPPONENT')){
          //Opponent did not play => same as weather problem
          if(score1.includes('DID')){
            h2h[0] = 0;
            matchesWon+=3;
          }
          //Everythign else counts as match played and won
          else{
            h2h[0] = 1;
            matchesWon++;
          }
        }
        //Same as schedule/weather, match is counted but no win or loss
        else{
          h2h[0] = 0;
          matchesWon+=3;
        }
      }
      //If match 1 was played, determines games, sets, and match won
      else if(score1 !== ''){
        for (const set of scores) {
          const [first, second] = set.split('-').map(Number);

          //tiebreak condition
          if(first+second < 6){
            if (first > second) {
              setsWon++;
              endTiebreak++;
            } else if (first < second) {
              setsLost++;
            }
          }
          else{
          gamesWon += first;
          if (first > second) {
            setsWon++;
          } else if (first < second) {
            setsLost++;
          }
        }}
        if(setsWon > setsLost){
          matchesWon++;
          h2h[0] = 1;
        }
        else{
            matchesLost++;
            h2h[0] = -1;
        }
      }
      

      //Accounts for sets won when ending tiebreak played
      if(endTiebreak===1) setsWon--;
      endTiebreak = 0;

      //Sets setsLost to setsWon to redetermine who won
      let tempLost = setsLost;
      let tempWon = setsWon;
      setsWon = 0;
      setsLost = 0;

      //Uses scores from match 2
      scores = score2.replace(/\([^)]*\)/g, '').split(' ');

      //Checks if special case score
      if(score2!== ''&& isNaN(parseInt(score2[0]))){
        if(score2.includes('PLAYER')){
          //Forfeit => match lost without playing match
          if(score2.includes('FORFEIT')){
            h2h[1] = -1;
            matchesLost+=3;
          }
          //Did not play => same as forfeit
          if(score2.includes('DID')){
            h2h[1] = -1;
            matchesLost+=3;
          }
          //Injury is same as loss
          else if(score2.includes('INJURY')){
            h2h[1] = -1;
            matchesLost++;
          }
          //Retired is same as loss
          else if(score2.includes('RETIRED')){
            h2h[1] = -1;
            matchesLost++;
          }
        }
        else if(score2.includes('OPPONENT')){
          //Opponent did not play => same as weather problem
          if(score2.includes('DID')){
            h2h[1] = 0;
            matchesWon+=3;
          }
          //Everythign else counts as match played and won
          else{
            h2h[1] = 1;
            matchesWon++;
          }
        }
        //Same as schedule/weather, match is counted but no win or loss
        else{
          h2h[0] = 0;
          matchesWon+=3;
        }
      }
      //If match 1 was played, determines games, sets, and match won
      else if(score2 !== ''){
        for (const set of scores) {
          const [first, second] = set.split('-').map(Number);
          
          //tiebreak condition
          if(first+second < 6){
            if (first > second) {
              setsWon++;
              endTiebreak++;
            } else if (first < second) {
              setsLost++;
            }
          }
          else{
          gamesWon += first;
          if (first > second) {
            setsWon++;
          } else if (first < second) {
            setsLost++;
          }
        }}
        if(setsWon > setsLost){
          matchesWon++;
          h2h[1] = 1;
        }
        else{
            matchesLost++;
            h2h[1] = -1;
        }
      }

      if(endTiebreak) setsWon--;
      endTiebreak = 0;

      setsWon += tempWon;
      setsLost += tempLost;
      return { matchesWon, matchesLost, setsWon, gamesWon, h2h };
  }

  //Gets an individual match result
  const getMatchResult = (score) =>{
    if(isNaN(parseInt(score[0]))){
      switch (score) {
        case "PLAYER RETIRED":
          return false;
        case "OPPONENT RETIRED":
          return true;
        case "PLAYER INJURY":
          return false;
        case "OPPONENT INJURY":
          return true;
        case "PLAYER FORFEIT":
          return false;
        case "OPPONENT FORFEIT":
          return true;
        default:
          return false;
      }
    }
    let scores = score.replace(/\([^)]*\)/g, '').split(' ');
    let setsWon = 0;
    let setsLost = 0;
    if(score !== ''){
      for (const set of scores) {
        const [first, second] = set.split('-').map(Number);

        if (first > second) {
          setsWon++;
        } else if (first < second) {
          setsLost++;
        }
      }
    }
    return setsWon > setsLost;
  }

  //Creates player object
  function createPlayer(name, ranking, score1, score2) {
    const points = getMatchPoints(score1, score2);
    return {
      name,
      ranking,
      score1,
      score2,
      ...points, // Spread the object returned by getMatchPoints
      cyclesSkipped: 0
    };
  }

  //Updates player's score points
  function updatePoints(player) {
    // Calculate new points based on the new scores
    const newPoints = getMatchPoints(player.score1, player.score2);
    
    // Return the updated player object with new scores and points
    return {
      ...player, // Spread the existing player object
      ...newPoints, // Spread the object returned by getMatchPoints
    };
  }

  //Determines the movement of 3 players in a set
  function getMovement(pl1, pl2, pl3){
    //Gets initial points for each player
    pl1.points = getPoints(pl1.matchesWon, pl1.matchesLost);
    pl2.points = getPoints(pl2.matchesWon, pl2.matchesLost);
    pl3.points = getPoints(pl3.matchesWon, pl3.matchesLost);
    
    //Assigns ranking relative to set
    pl1.set = 1;
    pl2.set = 2;
    pl3.set = 3;
    if(pl1.name==='BYE') pl1.points =-1;
    if(pl2.name==='BYE') pl2.points =-1;
    if(pl3.name==='BYE') pl3.points =-1;
    const players = [pl1, pl2, pl3];

    console.log(players);
    //Sorts
    players.sort((a, b) => {
      console.log('compare');
      //First compares points won
      if (a.points !== b.points) {
        console.log('points');
        return b.points - a.points;
      }
      
      //Compares head to head, doesn't work if 3 way tie
      //In the case of 3 way ties, h2h is not used
      let h2hComparison = compareHeadToHead(a, b);
      if (!(pl1.points === pl2.points && pl2.points === pl3.points) && h2hComparison !== 0) {
        console.log('h2h');
        return h2hComparison;
      }

      //Compares sets  won
      if (a.setsWon !== b.setsWon) {
        console.log('sets');
        return b.setsWon - a.setsWon;
      }

      //Compares games won
      if (a.gamesWon !== b.gamesWon) {
        console.log('games');
        return b.gamesWon - a.gamesWon;
      }

      // Original ranking as the last resort
      console.log('ranking');
      return a.ranking - b.ranking;
    });


    // For simplicity, returning the updated players array
    
    return [players[0].set, players[1].set, players[2].set,];
  }

  //Compares head to heads
  function compareHeadToHead(playerA, playerB) {

    if(playerA.set === 1){
      if(playerB.set === 2){
        return -playerA.h2h[0];
      }
      else return -playerA.h2h[1];
    }
    else if (playerA.set === 2){
      if(playerB.set === 1){
        return -playerA.h2h[0];
      }
      else return -playerA.h2h[1];
    }
    else{
      if(playerB.set === 1){
        return -playerA.h2h[0];
      }
      else return -playerA.h2h[1];
    }
  }

  //Determines points on matches won/lost
  function getPoints(matchesWon, matchesLost){
    //Checks if match is lost but no points for playing
    if(matchesLost > 2){
      //Both forfeit
      if(matchesLost===6){
        return 0;
      }
      matchesLost -=2;
      //Forfeit and null
      if(matchesWon===0 && matchesLost ===1){
        return 0;
      }
    }
    if(matchesWon > 2){
      if(matchesWon===6){
        return 1;
      }
      matchesWon-=3;
      //null case
      if(matchesWon ===0 && matchesLost ===0){
        return 1;
      }
    }
    if (matchesWon === 2 && matchesLost === 0) {
      return 4;
    } else if (matchesWon === 1 && matchesLost === 0) {
      return 3;
    } else if (matchesWon === 1 && matchesLost === 1) {
      return 2;
    } else if (matchesWon === 0 && matchesLost >= 1) {
      return 1;
    } else if (matchesWon === 0 && matchesLost === 0) {
      return 0;
    } else{
      return 0;
    }
  }

  //Get amount of pepole on ladder
  function getNumPeople(){
    let num = 0;
    for(const rung of ladder){
      for(const player of rung){
        if(player.name!=="BYE") num++;
      }
    }
    return num;
  }

  //Restores history
  const restoreHistory = () =>{
    if(!window.confirm(`Are you sure you want to restore version ${historyPage+1}`)) return;
    const newLadder = [...history[historyPage]];
    setLadder(newLadder);
    if(finish) toggleFinish();
  }
  
  //Returns movement
  function toggleFinish(){
    setFinish(!finish);
    
    //Calculate all movements
    setLadder(prevArray => {
      return prevArray.map((set, i) =>{
        const p1 =  updatePoints(set[0]);
        const p2 = updatePoints(set[1]);
        const p3 = updatePoints(set[2]);
        const movement = getMovement(p1, p2, p3);
        if(movement[0] === 1){
          p1.movement = "UP";
        }
        else if(movement[0] === 2){
          p2.movement = "UP";
        }
        if(movement[0] === 3){
          p3.movement = "UP";
        }
    
        if(movement[1] === 1){
          p1.movement = "STAY";
        }
        else if(movement[1] === 2){
          p2.movement = "STAY";
        }
        if(movement[1] === 3){
          p3.movement = "STAY";
        }
    
        if(movement[2] === 1){
          p1.movement = "DOWN";
        }
        else if(movement[2] === 2){
          p2.movement = "DOWN";
        }
        if(movement[2] === 3){
          p3.movement = "DOWN";
        }
        
        return [p1, p2, p3];
      });
    });
  }

  //Shifts ladder
  function shiftLadder(){
    const newLadder = ladder.map(innerArray => innerArray.map(player => ({ ...player })));

    let index = 0;
    let rung = 0;
    for (const set of ladder){
      index = 0;

    
      for(const player of set){
        const newPlayer = { ...ladder[rung][index] };
        newPlayer.score1 = '';
        newPlayer.score2 = '';
        if(newPlayer.points===0 && newPlayer.name!=='BYE') {
          newPlayer.cyclesSkipped++;
          let numPeople = getNumPeople();
          let moveRank = (rung*3);
          moveRank += player.movement === 'UP'? 1 : player.movement ==='STAY'? 2: player.movement ==='DOWN'? 3 : 0; 

          if(numPeople>=20 && ladder.length-rung <= 3){
            const dir = player.movement === 'UP'? 1 : player.movement ==='STAY'? 2: player.movement ==='DOWN'? 3 : 0; 
            //Disperse bottom ten players
            switch (ladder.length-rung) {
              case 3:
                switch (dir){
                  case 1:
                    newPlayer.ranking = (rung-1)*3+3;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 2:
                    newPlayer.ranking = (rung+1)*3+1;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 3:
                    newPlayer.ranking = (rung+2)*3+1;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                }
                break; 
              case 2:
                switch (dir){
                  case 1:
                    newPlayer.ranking = (rung-1)*3+2;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 2:
                    newPlayer.ranking = (rung)*3+2;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 3:
                    newPlayer.ranking = (rung+1)*3+2;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                }
                break;
              case 1:
                switch (dir){
                  case 1:
                    newPlayer.ranking = (rung-2)*3+3;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 2:
                    newPlayer.ranking = (rung-1)*3+3;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                  case 3:
                    newPlayer.ranking = (rung)*3+3;
                    newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                    break;
                }
                break;
              default:
   
            }
          }
        }
        else{
          newPlayer.cyclesSkipped=0;
        }
        console.log(newPlayer);
        console.log(rung);
        console.log(index);
        let currentRank = (rung*3)+index+1;
        let numPeople = getNumPeople();

        let moveRank = (rung*3);
        moveRank += player.movement === 'UP'? 1 : player.movement ==='STAY'? 2: player.movement ==='DOWN'? 3 : 0; 
        console.log(moveRank);
        //Conditional for top 10
        if(numPeople>=10 && moveRank <= 8){
          currentRank = (rung*3);
          currentRank += player.movement === 'UP'? 1 : player.movement ==='STAY'? 2: player.movement ==='DOWN'? 3 : 0; 
          switch (currentRank) {
            case 1:
              newPlayer.ranking = currentRank;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 2:
              newPlayer.ranking = currentRank+2;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 3:
              newPlayer.ranking = currentRank+4;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 4:
              newPlayer.ranking = currentRank-2;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 5:
              newPlayer.ranking = currentRank;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 6:
              newPlayer.ranking = currentRank+2;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 7:
              newPlayer.ranking = currentRank-4;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            case 8:
              newPlayer.ranking = currentRank-2;
              newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
              break;
            default:
 
          }
          
          console.log(player.name);
          console.log(currentRank);
          console.log(Math.floor((newPlayer.ranking-1)/3));
          console.log((newPlayer.ranking-1)%3);


          console.log(player.ranking);
          console.log(newPlayer.ranking);

          console.log(newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)]);

          console.log('');
        }
        //Condition for bottom 10
        else if(numPeople>=20 && ladder.length-rung <= 3){
          currentRank = (rung*3);
          const dir = player.movement === 'UP'? 1 : player.movement ==='STAY'? 2: player.movement ==='DOWN'? 3 : 0; 
          let dif = numPeople - currentRank +1;
          //Disperse bottom ten players
          switch (ladder.length-rung) {
            case 3:
              switch (dir){
                case 1:
                  newPlayer.ranking = (rung-1)*3+3;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 2:
                  newPlayer.ranking = (rung+1)*3+1;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 3:
                  newPlayer.ranking = (rung+2)*3+1;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
              }
              break; 
            case 2:
              switch (dir){
                case 1:
                  newPlayer.ranking = (rung-1)*3+2;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 2:
                  newPlayer.ranking = (rung)*3+2;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 3:
                  newPlayer.ranking = (rung+1)*3+2;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
              }
              break;
            case 1:
              switch (dir){
                case 1:
                  newPlayer.ranking = (rung-2)*3+3;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 2:
                  newPlayer.ranking = (rung-1)*3+3;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
                case 3:
                  newPlayer.ranking = (rung)*3+3;
                  newLadder[Math.floor((newPlayer.ranking-1)/3)][((newPlayer.ranking-1) % 3)] = newPlayer;
                  break;
              }
              break;
            default:
 
          }
        }
        else{
          if(player.movement === "UP"){
            if(rung === 0){
              newPlayer.ranking = 1+rung*3;
              newLadder[rung][0] = newPlayer;
              console.log(newLadder[rung][0]);
            }
            else{
              newPlayer.ranking = 3+(rung-1)*3;
              newLadder[rung-1][2] = newPlayer;
              console.log(newLadder[rung-1][2]);
            }
          }
          else if(player.movement === "STAY"){
            newPlayer.ranking = 2+rung*3;
            newLadder[rung][1] = newPlayer;
            console.log(newLadder[rung][1]);
          }
          else if(player.movement === "DOWN"){
            if(rung === ladder.length-1){
              newPlayer.ranking = 3+rung*3;
              newLadder[rung][2] = newPlayer;
              console.log(newLadder[rung][2]);
            }
            else{
              newPlayer.ranking = 1+(rung+1)*3;
              newLadder[rung+1][0] = newPlayer;
              console.log(newLadder[rung+1][0]);
            }
          }
        }
        index++;
      }
      rung++;
    }

    setHistory((prevArray => [...prevArray, ladder]));
    //Removes players who skipped more than 1 cycle:


    setLadder(newLadder);
    toggleFinish();
  }

  //Replaces a player at a certain rank and returns the player that was there previously
  function replaceAtRank(player, rank){
    const{rung, pos} = getRung(rank);
    if(rung>ladder.length) {
      return null;
    }
    let previous = ladder[rung-1][pos-1];
    console.log(previous);

    //Inserts replacement and shifts next one
    player.ranking = rank;
    console.log(player);
    console.log('check');
    setLadder(prevLadder => {
      return prevLadder.map((item, i) => {
        if (i === rung-1) {
          // Update the array at the specified index
          if(pos===3){
            return [prevLadder[rung-1][0], prevLadder[rung-1][1], player].map((p, idx) => ({
              ...p,
              score1: '',
              score2: '',
            }));
          } 
          else if(pos===2){
            return [prevLadder[rung-1][0], player, prevLadder[rung-1][2]].map((p, idx) => ({
              ...p,
              score1: '',
              score2: '',
            }));
          }
          else if(pos===1){
            return [player, prevLadder[rung-1][1], prevLadder[rung-1][2]].map((p, idx) => ({
              ...p,
              score1: '',
              score2: '',
            }));
          }
        } 
        else{
          return item;
        }
      });
    });
    console.log(ladder);
    return previous;
  }

  //Shifts down after adding a player
  function shiftDown(replace, rank){
    let newReplace = replaceAtRank(replace, rank);
    if(rank === getNumPeople()+1){
      newReplace = replace;
      rank--;
    }
    while(rank<getNumPeople()){
      newReplace = replaceAtRank(newReplace, rank+1);
      rank++;
    }
    const {pos} = getRung(rank+1);

    //If another rung needs to be inserted
    console.log(pos);
    if(pos === 1){
      const byeOne = createPlayer("BYE", getNumPeople()+2, '', '');
      const byeTwo = createPlayer("BYE", getNumPeople()+3, '', '');
      //Adds to ladder
      setLadder(prevArray => [...prevArray, [newReplace, byeOne, byeTwo].map((p, idx) => ({
        ...p,
        score1: '',
        score2: '',
      }))]);
    }
    //If there doesn't need to be a new rung
    else{
      replaceAtRank(newReplace, rank+1);
    }
  }

  //Shifts up after deleting a player
  function shiftUp(rank){
    if(rank>getNumPeople()){
      alert('INVALID RANK');
      return;
    }
    while(rank<getNumPeople()){
      const {rung, pos} = getRung(rank);
      replaceAtRank(pos === 3? ladder[rung][0] : ladder[rung-1][pos], rank);
      rank++;
    }
    const {pos} = getRung(rank);

    //Deletes the last rung
    if(pos===1){
      setLadder(prevLadder => prevLadder.slice(0, -1));
    }else{
      replaceAtRank(createPlayer("BYE", rank, '', ''), rank);
    }
  }

  //JSX bolds higher score
  function BoldScore(score) {
    const boldStyle = {
      fontWeight: 'bold', // Make the bold numbers more pronounced
      fontSize: '1.2em',  // Set the font size to make it larger
      color: 'black',     // Adjust the color as needed
    };
    const tieBoldStyle = {
      fontWeight: 'bold', // Make the bold numbers more pronounced
      fontSize: '.8em',  // Set the font size to make it larger
      color: 'black',     // Adjust the color as needed
    };
    if(isNaN(parseInt(score[0]))){
      return <span>{score}</span>
    }
    
    return score.split(' ').map((set, index) => {
      const match = set.match(/(\d+)-(\d+)(?:\((\d+)-(\d+)\))?/);
      
      if (match) {
        const [, first, second, tbFirst, tbSecond] = match;
        if(score==="6-4 1-6 1-0(11-9)") {console.log(match);
        console.log(tbFirst);
        console.log(tbSecond);
        console.log(Number(tbFirst) < Number(tbSecond));
      }
        const mainScore = (
          <>
            <span style={Number(first) > Number(second) ? boldStyle :  {fontSize: '.9em', color: 'darkgray'}}>{first}</span>
            <span>-</span>
            <span style={Number(first) < Number(second) ? boldStyle :  {fontSize: '.9em', color: 'darkgray'}}>{second}</span>
          </>
        );
  
        const tbScore = tbFirst && tbSecond ? (
          <>
            <span style = {{fontSize: '.6em'}}>(</span>
            <span style={Number(tbFirst) > Number(tbSecond) ? tieBoldStyle : {fontSize: '.6em', color: 'darkgray'}}>{tbFirst}</span>
            <span>-</span>
            <span style={Number(tbFirst) < Number(tbSecond) ? tieBoldStyle :  {fontSize: '.6em', color: 'darkgray'}}>{tbSecond}</span>
            <span style = {{fontSize: '.6em'}} >)</span>
          </>
        ) : null;
  
        return (
          <>
            {tbScore ? (
              <>
                {mainScore}
                <sup style={{ position: 'relative', top: '-0.5em', left: '0.2em' }}>
                  {tbScore}
                </sup>
              </>
            ) : mainScore}
            {index < score.split(' ').length - 1 && ' '} {/* Add space between sets */}
          </>
        );
      }
  
      return null; // Return null for invalid set formats
    });
  }
  
  const reverseTennisScores = (scoreString) => {
    if(scoreString === '') return '';
    if(isNaN(parseInt(scoreString[0]))){
      return scoreString.replace('PLAYER', 'TEMP').replace('OPPONENT', 'PLAYER').replace('TEMP', 'OPPONENT');
    };
    const scores = scoreString.split(' ').map(score => {
      const parts = score.split('(');
      const mainScores = parts[0].split('-').map(Number).reverse().join('-');
      if (parts[1]) {
        const tieBreakScores = parts[1].substring(0, parts[1].length - 1).split(')').map(tieBreak => tieBreak.split('-').map(Number).reverse().join('-')).join(')');
        return `${mainScores}(${tieBreakScores})`;
      }
      return mainScores;
    });
    return scores.join(' ');
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    if (name === 'input1-1') {
      input1Ref1.current.value = value;
      input2Ref1.current.value = reverseTennisScores(value);
    } else if (name === 'input2-1') {
      input2Ref1.current.value = value;
      input1Ref1.current.value = reverseTennisScores(value);
    }
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    if (name === 'input1-2') {
      input1Ref2.current.value = value;
      input2Ref2.current.value = reverseTennisScores(value);
    } else if (name === 'input2-2') {
      input2Ref2.current.value = value;
      input1Ref2.current.value = reverseTennisScores(value);
    }
  };

  const handleInputChange3 = (e) => {
    const { name, value } = e.target;
    if (name === 'input1-3') {
      input1Ref3.current.value = value;
      input2Ref3.current.value = reverseTennisScores(value);
    } else if (name === 'input2-3') {
      input2Ref3.current.value = value;
      input1Ref3.current.value = reverseTennisScores(value);
    }
  };
  
  const addRung = (e) => {
    e.preventDefault();

    let numPeople = getNumPeople();
    const p1 = createPlayer(
      inputNameRef1.current.value,
      numPeople+1,
      input1Ref1.current.value,
      input1Ref2.current.value,
    );
  
    const p2 = createPlayer(
      inputNameRef2.current.value,
      numPeople+2,
      input2Ref1.current.value,
      input1Ref3.current.value,
    );
  
    const p3 = createPlayer(
      inputNameRef3.current.value,
      numPeople+3,
      input2Ref2.current.value,
      input2Ref3.current.value,
    );
    
    //determines the player movement

    //Adds to ladder
    const{rung, pos} = getRung(getNumPeople());

    setLadder(prevLadder => {
      const updatedLadder = prevLadder.map((item, i) => {
        if (i === rung - 1) {
          // Update the array at the specified index
          if (pos === 2) {
            return [prevLadder[rung - 1][0], prevLadder[rung - 1][1], p1].map((p) => ({
              ...p,
              score1: '',
              score2: '',
            }));
          } else if (pos === 1) {
            return [prevLadder[rung - 1][0], p1, p2].map((p) => ({
              ...p,
              score1: '',
              score2: '',
            }));
          }
          else{
            return item;
          }
        } else {
          return item;
        }
      });
      const byeOne = createPlayer("BYE", (rung + 1) * 3 + 2, '', '');
      const byeTwo = createPlayer("BYE", (rung + 1) * 3 + 3, '', '');
    
      switch (pos) {
        case 1:
          updatedLadder.push([p3, byeOne, byeTwo].map((p) => ({
            ...p,
            score1: '',
            score2: '',
          })));
          break;
        case 2:
          updatedLadder.push([p2, p3, byeTwo].map((p) => ({
            ...p,
            score1: '',
            score2: '',
          })));
          break;
        case 3:
        case 0:
          updatedLadder.push([p1, p2, p3].map((p) => ({
            ...p,
            score1: '',
            score2: '',
          })));
          break;
        default:
          throw new Error();
      }
    
      return updatedLadder;
    });

  };

  //Edits a single player
  const editPlayer = (e) => {
    e.preventDefault();
   //Invalid ranks
    if(e.target.elements.rank.value < 1 || e.target.elements.rank.value > getNumPeople()){
      alert('INVALID RANK');
      return;
    }
    //Gets the rung and position fo a player
    const{rung, pos} = getRung(e.target.elements.rank.value);

    //Makes the new rung based off the pos
    const newRung = ladder[rung-1];
    const updatedPlayer = createPlayer(
      e.target.elements.name.value === '' ? newRung[pos-1].name : e.target.elements.name.value  ,
      e.target.elements.rank.value, 
      e.target.elements.score1.value === '' ? newRung[pos-1].score1 : e.target.elements.score1.value === 'clear'? '' : e.target.elements.score1.value,
      e.target.elements.score2.value === '' ? newRung[pos-1].score2 : e.target.elements.score2.value === 'clear'? '' :e.target.elements.score2.value,
    );
    console.log(e.target.elements.name.value);
    console.log(e.target.elements.rank.value);
    console.log(e.target.elements.score1.value);
    console.log(e.target.elements.score2.value);
    console.log(updatedPlayer.rank);
    console.log(updatedPlayer.score1);
    
    if(pos === 1){
      newRung[0] = updatedPlayer;

      //Updates the scores for other 2 players
      newRung[1].score1 = reverseTennisScores(updatedPlayer.score1);
      newRung[2].score1 = reverseTennisScores(updatedPlayer.score2);
    }
    else if (pos ===2){
      newRung[1] = updatedPlayer
      
      //Updates the scores for other 2 players
      newRung[0].score1 = reverseTennisScores(updatedPlayer.score1);
      newRung[2].score2 = reverseTennisScores(updatedPlayer.score2);
    }
    else{
      newRung[2] = updatedPlayer
      //Updates the scores for other 2 players
      newRung[0].score2 = reverseTennisScores(updatedPlayer.score1);
      newRung[1].score2 = reverseTennisScores(updatedPlayer.score2);
    }

    //Updates ladder
    setLadder(prevLadder => {
      return prevLadder.map((item, i) => {
        if (i === rung-1) {
          // Update the array at the specified index
          return newRung;
        } else {
          return item;
        }
      });
    });
  };

  //Adds a single player
  const addPlayer = (e) => {
    e.preventDefault();

    if(e.target.elements.name.value === ''){
      alert('NO NAME');
      return;
    }
    const updatedPlayer = createPlayer(
      e.target.elements.name.value,
      getNumPeople()+1,
      '',
      '',
    );
    shiftDown(updatedPlayer, getNumPeople()+1);
    alert(`Added ${e.target.elements.name.value} at bottom of ladder`);
  };

  //Inserts a single player
  const insertPlayer = (e) => {
    e.preventDefault();

    const rank = Number(e.target.elements.rank.value);
    if(e.target.elements.name.value === ''){
      alert('NO NAME');
      return;
    }
    if(e.target.elements.rank.value === '' || rank < 0 || rank > getNumPeople()+1){
      alert('INVALID RANK');
      return;
    }
    const updatedPlayer = createPlayer(
      e.target.elements.name.value,
      e.target.elements.rank.value,
      '',
      '',
    );

    shiftDown(updatedPlayer, rank);
    alert(`Inserted ${e.target.elements.name} at ${e.target.elements.rank.value} rank`);
  };

  //Inserts a single player
  const removePlayer = (e) => {
    e.preventDefault();
    if(!window.confirm(`Are you sure you want to remove this player? The ladder will shift to replace this player, deleting all matches in the process. Only remove at the beginning of the month.`)) return;
    shiftUp(Number(e.target.elements.rank.value));
  };

  //Gets rung and position in rung given a ranking
  const getRung = (rank) => {
    let rung = Math.floor((rank-1)/3)+1;
    let pos = (rank-1) % 3+1;
    return {rung, pos};
  }

  //Random generators
  const generateRandomMatch = () => {
      // Generate random tennis scores

      let setScores = '';
      
     
      let p1sets = 0;
      let p2sets = 0;
      
      //17% Chance of returning a random 'event' as match instead
      const randomNumber = Math.random();
      if (randomNumber <= 0.17) {
        const outcomesBank = [
          "WEATHER ISSUE",
          "SCHEDULE ISSUE",
          "PLAYER RETIRED",
          "OPPONENT RETIRED",
          "PLAYER INJURY",
          "OPPONENT INJURY",
          "PLAYER FORFEIT",
          "OPPONENT FORFEIT",
          "PLAYER DID NOT PLAY",
          "OPPONENT DID NOT PLAY"
        ];
        const randomIndex = Math.floor(Math.random() * outcomesBank.length);
        return outcomesBank[randomIndex];
        
      }

      //Generates two random sets
      for(let i = 0; i < 3; i++){
        let p1games = 0;
        let p2games = 0;

        if(p1sets === 2 || p2sets === 2){
          break;
        }
        let thirdTie = (p1sets===1&&p2sets===1);

        while (!(p1games >=6 || p2games >= 6)) {
          
          let random1games = Math.floor(Math.random() * 7);
          let random2games = Math.floor(Math.random() * 7);
          
          //tiebreak points
          let p1points =0;
          let p2points =0;
          // Check if the set is valid and follow tennis rules
          if(random1games === 6 && random2games < 5){
            p1sets++;
            p1games = random1games;
            p2games = random2games;
            setScores += `${random1games}-${random2games} `;
          } else if(random2games === 6 && random1games < 5){
            p2sets++;
            p1games = random1games;
            p2games = random2games;
            setScores += `${random1games}-${random2games} `;
          } else if (random1games === 6 && random2games ===5) {
            p1sets++;
            p1games = random1games;
            p2games = random2games;
            setScores += `${random1games+1}-${random2games} `;
          } else if (random2games === 6 && random1games === 5) {
            p2sets++;
            p1games = random1games;
            p2games = random2games;
            setScores += `${random1games}-${random2games+1} `;
          } else if (random1games === 6 && random2games === 6) {


            //if third set, chance to play a third set tiebreak
            if(thirdTie && Math.floor(Math.random()*2) === 1){
              while (!(p1points >=11 || p2points >= 11)) {
             
                let random1points = Math.floor(Math.random() * 12);
                let random2points  = Math.floor(Math.random() * 12);
                
                // Check if the set is valid and follow tennis rules
                if (random1points === 11 && random2points < 10) {
                  setScores += `${1}-${0}(${random1points}-${random2points}) `;
                  p1points = random1points;
                  p2points = random2points;
                } else if (random2points === 11 && random1points ===10) {
                  setScores += `${0}-${1}(${random1points}-${random2points}) `;
                  p1points = random1points;
                  p2points = random2points+1;
                } else if (random1points === 11 && random2points ===10) {
                  setScores += `${1}-${0}(${random1points+1}-${random2points}) `;
                  p1points = random1points+1;
                  p2points = random2points;
                } else if (random2points ===11 && random1points === 10) {
                    setScores += `${0}-${1}(${random1points}-${random2points+1}) `;
                    p1points = random1points;
                    p2points = random2points;
                } else if (random1points === 11 && random2points === 11) {
                  while(Math.abs(random1points-random2points) < 2){
                  
                    random1points += Math.floor(Math.random()*2);
                    random2points += Math.floor(Math.random()*2);
                  }
                  if(random1points>random2points){
                    p1sets++;
                    setScores += `${1}-${0}(${random1points}-${random2points}) `;
                    
  
                  }
                  else{
                    p2sets++;
                    setScores += `${0}-${1}(${random1points}-${random2points}) `;
                  }
                  p1points = random1points;
                  p2points = random2points;
                }
                
              }
              p1games = random1games;
              p2games = random2games;
            }
            else{

            // Generate tiebreak scores
            while (!(p1points >=7 || p2points >= 7)) {
             
              let random1points = Math.floor(Math.random() * 8);
              let random2points  = Math.floor(Math.random() * 8);
              
              // Check if the set is valid and follow tennis rules
              if (random1points === 7 && random2points < 6) {
                setScores += `${random1games+1}-${random2games}(${random1points}-${random2points}) `;
                p1sets++;
                p1points = random1points;
                p2points = random2points;
              } else if (random2points === 7 && random1points <6) {
                setScores += `${random1games}-${random2games+1}(${random1points}-${random2points}) `;
                p2sets++;
                p1points = random1points;
                p2points = random2points;
              } else if (random1points === 7 && random2points ===6) {
                setScores += `${random1games+1}-${random2games}(${random1points+1}-${random2points}) `;
                p1points = random1points;
                p2points = random2points;
                p1sets++;
              } else if (random2points === 7 && random1points ===6) {
                  setScores += `${random1games}-${random2games+1}(${random1points}-${random2points+1}) `;
                  p1points = random1points;
                  p2points = random2points;
                  p2sets++;
              } else if (random1points === 7 && random2points === 7) {
                while(Math.abs(random1points-random2points) < 2){
                
                  random1points += Math.floor(Math.random()*2);
                  random2points += Math.floor(Math.random()*2);
                }
                if(random1points>random2points){
                  p1sets++;
                  setScores += `${random1games+1}-${random2games}(${random1points}-${random2points}) `;
                  

                }
                else{
                  p2sets++;
                  setScores += `${random1games}-${random2games+1}(${random1points}-${random2points}) `;
                }
                p1points = random1points;
                p2points = random2points;
              }
              
            }
            p1games = random1games;
            p2games = random2games;
            }
          }
        }

      }
      return setScores.substring(0, setScores.length-1);
      
  }

  const addRandomRung = () =>{
    const namesBank = [
      "Emma",
      "Liam",
      "Olivia",
      "Noah",
      "Ava",
      "Ethan",
      "Isabella",
      "Sophia",
      "Mia",
      "James",
      "Charlotte",
      "Amelia",
      "Benjamin",
      "William",
      "Lucas",
      "Mason",
      "Elijah",
      "Alexander",
      "Michael",
      "Evelyn",
      "Abigail",
      "Harper",
      "Emily",
      "Ella",
      "Evelyn",
      "Avery",
      "Sofia",
      "Aria",
      "Scarlett",
      "Madison",
      "Luna",
      "Grace",
      "Chloe",
      "Victoria",
      "Penelope",
      "Riley",
      "Zoe",
      "Layla",
      "Nora",
      "Lily",
      "Hannah",
      "Aurora",
      "Zoey",
      "Leah",
      "Samantha",
      "Audrey",
      "Natalie",
      "Genesis"
    ];
  
    let r = Math.floor(Math.random() * namesBank.length);
    inputNameRef1.current.value = namesBank[r];
    r = Math.floor(Math.random() * namesBank.length);
    inputNameRef2.current.value = namesBank[r];
    r = Math.floor(Math.random() * namesBank.length);
    inputNameRef3.current.value = namesBank[r];

    const match1 = generateRandomMatch();
    const match2 = generateRandomMatch();
    const match3 = generateRandomMatch();

    input1Ref1.current.value = match1;
    let e = {
      target: {
        name: 'input1-1', // Or 'input2-1' depending on which input you want to update
        value: match1
      }
    };
    handleInputChange1(e);

    input1Ref2.current.value = match2;
    e = {
      target: {
        name: 'input1-2', // Or 'input2-1' depending on which input you want to update
        value: match2
      }
    };
    handleInputChange2(e);

    input1Ref3.current.value = match3;
    e = {
      target: {
        name: 'input1-3', // Or 'input2-1' depending on which input you want to update
        value: match3
      }
    };
    handleInputChange3(e);
    e = {
      preventDefault: () => {} // Mock the preventDefault function
    };
   addRung(e);

  }

  //Fills empty matches with a random matches
  const fillEmptyMatches = () =>{
    const updatedLadder = [...ladder];
    for(const set of updatedLadder){

      if(set[0].name !== "BYE" && set[1].name !== "BYE" && set[0].score1 === ''){
        const rand = generateRandomMatch();
        set[0].score1 = rand;
        set[1].score1 = reverseTennisScores(rand);  
      }
      if(set[0].name !== "BYE" && set[2].name !== "BYE" && set[0].score2 === ''){
        const rand = generateRandomMatch();
        set[0].score2 = rand;
        set[2].score1 = reverseTennisScores(rand);  
      }
     if(set[1].name !== "BYE" && set[0].name !== "BYE" && set[1].score1 === ''){
        const rand = generateRandomMatch();
        set[1].score1 = rand;
        set[0].score1 = reverseTennisScores(rand);  
      }
       if(set[1].name !== "BYE" && set[2].name !== "BYE" && set[1].score2 === ''){
        const rand = generateRandomMatch();
        set[1].score2 = rand;
        set[2].score2 = reverseTennisScores(rand);  
      }
       if(set[2].name !== "BYE" && set[0].name !== "BYE" &&  set[2].score1 === ''){
        const rand = generateRandomMatch();
        set[2].score1 = rand;
        set[0].score2 = reverseTennisScores(rand);  
      }
       if(set[2].name !== "BYE" && set[1].name !== "BYE" && set[2].score2 === ''){
        const rand = generateRandomMatch();
        set[2].score2 = rand;
        set[1].score2 = reverseTennisScores(rand);  
      }
    }
    setLadder(updatedLadder);
    alert("Filled every empty score with a random match");
  }

  //Reports the score for empty matches
  function MatchScoreForm(rank, score, player, opponent) {
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
      const selectedValue = event.target.elements['result-select'].value;
      //checks for combo box match results
      if(selectedValue !== 'complete'){
        let outcome = '';
        switch (selectedValue) {
          case 'weather':
            outcome = "WEATHER ISSUE";
            break;
          case 'schedule':
            outcome = "SCHEDULE ISSUE";
            break;
          case 'retired-player':
            outcome = "PLAYER RETIRED";
            break;
          case 'retired-opponent':
            outcome = "OPPONENT RETIRED";
            break;
          case 'injury-player':
            outcome = "PLAYER INJURY";
            break;
          case 'injury-opponent':
            outcome = "OPPONENT INJURY";
            break;
          case 'forfeit-player':
            outcome = "PLAYER FORFEIT";
            break;
          case 'forfeit-opponent':
            outcome = "OPPONENT FORFEIT";
            break;
          case 'dnp-player':
            outcome = "PLAYER DID NOT PLAY";
            break;
          case 'dnp-opponent':
            outcome = "OPPONENT DID NOT PLAY";
            break;
          default:
            throw new Error();
        }
        event = {
          preventDefault: () => {},
          target: {
            elements: {
              rank: { value: rank },
              name: { value: '' },
              [score]: { value: outcome },
              [score === 'score1' ? 'score2' : 'score1']: { value: '' }
            }
          }
        };
        editPlayer(event);
        setScores({
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
        return;
      }
      else{
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
                    validationErrors.push(`Set ${index + 1} has invalid scores.1`);
                  }
                  // Check if both players have reached at least 7 points
                  if (tieOne < 7 && tieTwo < 7) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.2`);
                  }
                  // Check if the difference between the scores is at least 2
                  const scoreDifference = tieTwo-tieOne;
                  if (scoreDifference < 2) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.3`);
                  }
                  // Check if either player has reached 7 points and wins by 2
                  if (tieOne > 7 || tieTwo > 7) {
                      if (scoreDifference !== 2) {
                        validationErrors.push(`Set ${index + 1} has invalid scores.4`);
                      }
                  }
                }
                else{
                  if(tieOne < 0 || tieTwo < 0){
                    validationErrors.push(`Set ${index + 1} has invalid scores.5`);
                  }
                  // Check if both players have reached at least 7 points
                  if (tieOne < 7 && tieTwo < 7) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.6`);
                  }
    
                  // Check if the difference between the scores is at least 2
                  const scoreDifference = tieOne-tieTwo;
                  if (scoreDifference < 2) {
                    validationErrors.push(`Set ${index + 1} has invalid scores.7`);
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
                  if (tieOne > 11 || tieTwo > 11) {
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
      }
      if (validationErrors.length > 0) {
        // Handle errors
        alert("Please check if your scores are valid");
        console.log(validationErrors);
      } else {
        // Proceed with valid scores
        event = {
          preventDefault: () => {},
          target: {
            elements: {
              rank: { value: rank },
              name: { value: '' },
              [score]: { value: formatScoreLines() },
              [score === 'score1' ? 'score2' : 'score1']: { value: '' }
            }
          }
        };
        editPlayer(event);
        setScores({
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
      }
    };
    
    const formatScoreLines = () => {
      const formattedScores = [];
      scores.sets.forEach((set, index) => {
        const playerOneScore = set.playerOne.trim();
        const playerTwoScore = set.playerTwo.trim();
        const setScore = `${playerOneScore}-${playerTwoScore}`;
    
        const tiebreakersPlayerOne = scores.tiebreakers[index].playerOne.trim();
        const tiebreakersPlayerTwo = scores.tiebreakers[index].playerTwo.trim();
        const tiebreakersScore = `${tiebreakersPlayerOne}-${tiebreakersPlayerTwo}`;
    
        if (playerOneScore !== '') {
          if (tiebreakersScore !== '-') {
            formattedScores.push(setScore + `(${tiebreakersScore})`);
          } else {
            formattedScores.push(setScore);
          }
        }
      });
      
      return formattedScores.join(' ');
    };
    
  
    return (<>
      {rank !== selectRank && <button onClick = {()=>setSelectRank(rank)}>EDIT SCORES</button>}
      {rank === selectRank &&
        <div className = "report-score">
          <button onClick = {()=>setSelectRank(-1)}>CANCEL</button>
          <form className="match-form" onSubmit={handleSubmit}>
            <div className="sets-container">
            {scores.sets.map((set, index) => {
              if(index <= 1 || !((Number(scores.sets[0].playerOne) > Number(scores.sets[0].playerTwo) && Number(scores.sets[1].playerOne) > Number(scores.sets[1].playerTwo)) || (Number(scores.sets[0].playerOne) < Number(scores.sets[0].playerTwo) && Number(scores.sets[1].playerOne) < Number(scores.sets[1].playerTwo))))
              return(
              <div className ="set-all">
              <label>
                  {`SET ${index+1}`}{((index===2 && (String(set.playerOne) === '1' && String(set.playerTwo) === '0') || (String(set.playerOne) === '0' && String(set.playerTwo) === '1')) 
                  || ((String(set.playerOne) === '6' && String(set.playerTwo) === '7') || (String(set.playerOne) === '7' && String(set.playerTwo) === '6'))) && <span>: TIEBREAK</span>}
              </label>
              <div key={index} className="set-container">
                <div className="set-score">
                  <div>
                    <input style = {{border: set.playerOne > set.playerTwo && "solid 3px darkgray"}}
                      type="number"
                      value={set.playerOne}
                      onChange={(e) => handleChange(e, index, 'playerOne')}
                    />
                  </div>
                  <div>
                    <input style = {{border: set.playerOne < set.playerTwo && "solid 3px darkgray"}}
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
                      <input style = {{border: set.playerOne > set.playerTwo && "solid 3px darkgray"}}
                        type="number"
                        value={scores.tiebreakers[index].playerOne}
                        onChange={(e) => handleChange(e, 3 + index, 'playerOne')}
                      />
                    </div>
                    <div>
                      <input style = {{border: set.playerOne < set.playerTwo && "solid 3px darkgray"}}
                        type="number"
                        value={scores.tiebreakers[index].playerTwo}
                        onChange={(e) => handleChange(e, 3 + index, 'playerTwo')}
                      />
                    </div>
                  </div>
                )}
              </div>
              </div>
              );
             })}
          </div>
          <div className = "match-result">
            <label>
               Match Outcome   
            </label>
            <select id="combo-box" name="result-select">
              <optgroup label = "Complete">
                <option value="complete">Complete</option>
              </optgroup>
              <optgroup label="Match Issue">
                <option value="weather">Weather</option>
                <option value="schedule">Schedule</option>
              </optgroup>
              <optgroup label="Retired">
                <option value="retired-player">{player.name} retired</option>
                <option value="retired-opponent">{opponent.name} retired</option>
              </optgroup>
              <optgroup label="Injury">
                <option value="injury-player">{player.name} injured</option>
                <option value="injury-opponent">{opponent.name} injured</option>
              </optgroup>
              <optgroup label="Forfeit">
                <option value="forfeit-player">{player.name} forfeit</option>
                <option value="forfeit-opponent">{opponent.name} forfeit</option>
              </optgroup>
              <optgroup label="Did not play">
                <option value="dnp-player">{player.name} DNP</option>
                <option value="dnp-opponent">{opponent.name} DNP</option>
              </optgroup>
            </select>
          </div>
          <button type="submit">Submit Scores</button>
        </form>
        </div>}
        </>
    );
  }

  //Report a winner for the score
  

  return (
    <div className="Container">

      <div className = "Sets">

        <h1>Sets</h1>
        <button onClick={() => toggleFinish()}>
          {finish ? 'Back' : 'End'}
        </button>
        {finish &&
          <button onClick={() => shiftLadder()}>
           Update
          </button>
          }
        <div className ="Ladder">
          <div className ="CRUD">
            <h1>Edit Ladder</h1>
            {!finish && <div className="AddRung">
        <h1>ADD RUNG</h1>
        <form onSubmit={addRung}>
            <div>
              <input
                type="text"
                ref={inputNameRef1}
                name="inputName-1"
                placeholder="Player 1"
              />
              <input
                type="text"
                ref={input1Ref1}
                name="input1-1"
                onChange={handleInputChange1}
                placeholder="p1 v p2"
              />
              <input
                type="text"
                ref={input1Ref2}
                name="input1-2"
                onChange={handleInputChange2}
                placeholder="p1 v p3"
              />
            </div>
            <div>
              <input
                type="text"
                ref={inputNameRef2}
                name="inputName-2"
                placeholder="Player 2"
              />
              <input
                type="text"
                ref={input2Ref1}
                name="input2-1"
                onChange={handleInputChange1}
                placeholder="p2 v p1"
              />
              <input
                type="text"
                ref={input1Ref3}
                name="input1-3"
                onChange={handleInputChange3}
                placeholder="p2 v p3"
              />
            </div>
            <div>
              <input
                type="text"
                ref={inputNameRef3}
                name="inputName-3"
                placeholder="Player 3"
              />
              <input
                type="text"
                ref={input2Ref2}
                name="input2-2"
                onChange={handleInputChange2}
                placeholder="p3 v p1"
              />
              <input
                type="text"
                ref={input2Ref3}
                name="input2-3"
                onChange={handleInputChange3}
                placeholder="p3 v p2"
              />
            </div>
          <button type="submit">Add Rung</button>
        </form>
        <button type="submit" onClick={addRandomRung}>Add Random Rung</button>
        <button type="submit" onClick={fillEmptyMatches}>Fill Empty Matches</button>
            </div>}
            {!finish && <div className="EditPlayer">
              <h1>EDIT PLAYER</h1>
              <form onSubmit={editPlayer}>

                <div>
                <label>Ranking:</label>
                <input
                  type="text"
                  name="rank"
                />
                </div>
                <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                />
                </div>
                <div style = {{display: 'none'}}>
                  <label>Ranking:</label>
                  <input
                    type="text"
                    name="score1"
                  />
                </div>
                <div style = {{display: 'none'}}>
                <label>Ranking:</label>
                <input
                  type="text"
                  name="score2"
                />
                </div>
                <button type="submit">Submit</button>
              </form>
              

            </div>}
            {!finish && <div className="AddPlayer">
              <h1>ADD PLAYER</h1>
              <form onSubmit={addPlayer}>
                <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                />
                </div>
                <button type="submit">Submit</button>
              </form>
              

            </div>}
            {!finish && <div className="InsertPlayer">
              <h1>INSERT PLAYER</h1>
              <form onSubmit={insertPlayer}>
                <div>
                  <label>Ranking:</label>
                  <input
                    type="text"
                    name="rank"
                  />
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>}
            {!finish && <div className="RemovePlayer">
              <h1>REMOVE PLAYER</h1>
              <form onSubmit={removePlayer}>
                <div>
                  <label>Ranking:</label>
                  <input
                    type="text"
                    name="rank"
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>}

          </div>
          <div className = "TopTen">
            {true && <h1>TOP 10</h1>}
            {ladder.map((set, index) => {
                if(getNumPeople() >=10 && index <=2) return (<div className="Set" key={index}>
                  <p>Rung {index + 1}
                    {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                    {(getNumPeople() >=20 && ladder.length-index <= 3)&& <span> - Bottom 10 Bracket</span>}
                  </p>
                  {set.map((player, indx) => {
                    const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                    let played = false;
                    if(indx !==1){
                      played = player.score1 === '' ? false: true;
                      switch(player.score1){
                          case "WEATHER ISSUE":
                            played = false;
                            break;
                          case "SCHEDULE ISSUE":
                            played = false;
                            break;
                          case "PLAYER DID NOT PLAY":
                            played = false;
                            break;
                          case "OPPONENT DID NOT PLAY":
                            played = false;
                            break;
                      }
                    }
                    else{
                      played = player.score2 === '' ? false: true;
                      switch(player.score2){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                    }
                    const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                    
                    const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                    const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                    
                    const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                    const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                    return (
                      <div className="Match" key={indx}>
                        <div className="Players">
                          <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'}}>
                            {`${player.ranking} ${player.name} `}
                          </span>
                          {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                          </span>}
                          {finish && (
                            <span style={{ color: movementColor }}>
                              {arrowIcon}{' '} 
                            </span>
                          )}
                          <span>
                             | 
                          </span>
                          <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal', color: !played? 'black' : !matchResult ? 'black' : 'darkgray' }}>
                            {` ${opponent.ranking} ${opponent.name} `}
                          </span>
                          {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                          </span>}
                          {finish && (
                            <span style={{color: movementColorOpponent}}>
                              {arrowIconOpponent}
                            </span>
                          )}
                        </div>
                        <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                          {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                          {(!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '' && (
                            <>{MatchScoreForm(player.ranking, indx !== 1 ? 'score1' : 'score2', player, opponent)}</>
                          )}
                          {!finish && !((!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '') && (
                            <button onClick={() => {
                              const e = {
                                preventDefault: () => {}, // Define preventDefault function
                                target: {
                                  elements: {
                                    rank: {value: player.ranking},
                                    name: {value: ''},
                                    score1: {value: 'clear'},
                                    score2: {value: ''}
                                  }
                                }
                              };
                              editPlayer(e); // Call removePlayer with the synthetic event object
                            }}>CLEAR SCORES</button>
                          )}
                        </div>
                        {(!finish && player.name!=='BYE') && <div className = "REMOVE">
                        <button onClick={() => {
                            const e = {
                              preventDefault: () => {}, // Define preventDefault function
                              target: {
                                elements: {
                                  rank: {value: player.ranking}
                                }
                              }
                            };
                            removePlayer(e); // Call removePlayer with the synthetic event object
                          }}>REMOVE {player.name}</button>
                        </div>}
                      </div>
                    );
                  })}
                </div>)
            })}
          </div>
          <div className = "MainDraw">
            <h1>MAIN DRAW</h1>
            {ladder.map((set, index) => {
                if(!(getNumPeople() >=10 && index <=2)&&!(getNumPeople() >=20 && ladder.length-index<= 3)) return (<div className="Set" key={index}>
                  <p>Rung {index + 1}
                    {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                    {(getNumPeople() >=20 && ladder.length-index <= 3) && <span> - Bottom 10 Bracket</span>}
                  </p>
                  {set.map((player, indx) => {
                    const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                    let played = false;
                    if(indx !==1){
                      played = player.score1 === '' ? false: true;
                      switch(player.score1){
                          case "WEATHER ISSUE":
                            played = false;
                            break;
                          case "SCHEDULE ISSUE":
                            played = false;
                            break;
                          case "PLAYER DID NOT PLAY":
                            played = false;
                            break;
                          case "OPPONENT DID NOT PLAY":
                            played = false;
                            break;
                      }
                    }
                    else{
                      played = player.score2 === '' ? false: true;
                      switch(player.score2){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                    }
                    const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                    
                    const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                    const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                    
                    const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                    const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                    return (
                      <div className="Match" key={indx}>
                        <div className="Players">
                          <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'  }}>
                            {`${player.ranking} ${player.name} `}
                          </span>
                          {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                          </span>}
                          {finish && (
                            <span style={{ color: movementColor }}>
                              {arrowIcon}{' '}
                            </span>
                          )}
                          <span>
                             | 
                          </span>
                          <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal', color: !played? 'black' : !matchResult ? 'black' : 'darkgray'  }}>
                            {` ${opponent.ranking} ${opponent.name} `}
                          </span>
                          {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                          </span>}
                          {finish && (
                            <span style={{color: movementColorOpponent}}>
                              {arrowIconOpponent}
                            </span>
                          )}
                        </div>
                        <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                          {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                          {(!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '' && (
                            <>{MatchScoreForm(player.ranking, indx !== 1 ? 'score1' : 'score2', player, opponent)}</>
                          )}
                          {!finish && !((!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '') && (
                            <button onClick={() => {
                              const e = {
                                preventDefault: () => {}, // Define preventDefault function
                                target: {
                                  elements: {
                                    rank: {value: player.ranking},
                                    name: {value: ''},
                                    score1: {value: ''},
                                    score2: {value: 'clear'}
                                  }
                                }
                              };
                              editPlayer(e); // Call removePlayer with the synthetic event object
                            }}>CLEAR SCORES</button>
                          )}
                        </div>
                        {(!finish && player.name!=='BYE') && <div className = "REMOVE">
                        <button onClick={() => {
                            const e = {
                              preventDefault: () => {}, // Define preventDefault function
                              target: {
                                elements: {
                                  rank: {value: player.ranking}
                                }
                              }
                            };
                            removePlayer(e); // Call removePlayer with the synthetic event object
                          }}>REMOVE {player.name}</button>
                        </div>}
                      </div>
                    );
                  })}
                </div>)
            })}
          </div>
          <div className = "BottomTen">
          {true && <h1>BOTTOM 10</h1>}
          {ladder.map((set, index) => {
              if(getNumPeople() >=20 && ladder.length-index <= 3) return (<div className="Set" key={index}>
                <p>Rung {index + 1}
                  {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                  {(getNumPeople() >=20 && ladder.length-index <= 3) && <span> - Bottom 10 Bracket</span>}
                </p>
                {set.map((player, indx) => {
                  const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                  let played = false;
                  if(indx !==1){
                    played = player.score1 === '' ? false: true;
                    switch(player.score1){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                  }
                  else{
                    played = player.score2 === '' ? false: true;
                    switch(player.score2){
                      case "WEATHER ISSUE":
                        played = false;
                        break;
                      case "SCHEDULE ISSUE":
                        played = false;
                        break;
                      case "PLAYER DID NOT PLAY":
                        played = false;
                        break;
                      case "OPPONENT DID NOT PLAY":
                        played = false;
                        break;
                  }
                  }
                  const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                  
                  const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                  const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                  
                  const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                  const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                  return (
                    <div className="Match" key={indx}>
                      <div className="Players">
                        <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'  }}>
                          {`${player.ranking} ${player.name} `}
                        </span>
                        {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                          {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                        </span>}
                        {finish && (
                          <span style={{ color: movementColor }}>
                            {arrowIcon}{' '}
                          </span>
                        )}
                        <span>
                             | 
                          </span>
                        <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal', color: !played? 'black' : !matchResult ? 'black' : 'darkgray'  }}>
                          {` ${opponent.ranking} ${opponent.name} `}
                        </span>
                        {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                          {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                        </span>}
                        {finish && (
                          <span style={{color: movementColorOpponent}}>
                            {arrowIconOpponent}
                          </span>
                        )}
                      </div>
                      <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                        {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                        {(!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '' && (
                          <>{MatchScoreForm(player.ranking, indx !== 1 ? 'score1' : 'score2', player, opponent)}</>
                        )}
                        {!finish && !((!finish && player.name !== 'BYE' && opponent.name !== 'BYE') && player[indx !== 1 ? 'score1' : 'score2'] === '') && (
                            <button onClick={() => {
                              const e = {
                                preventDefault: () => {}, // Define preventDefault function
                                target: {
                                  elements: {
                                    rank: {value: player.ranking},
                                    name: {value: ''},
                                    score1: {value: 'clear'},
                                    score2: {value: ''}
                                  }
                                }
                              };
                              editPlayer(e); // Call removePlayer with the synthetic event object
                            }}>CLEAR SCORES</button>
                          )}
                      </div>
                      {(!finish && player.name!=='BYE') && <div className = "REMOVE">
                      <button onClick={() => {
                          const e = {
                            preventDefault: () => {}, // Define preventDefault function
                            target: {
                              elements: {
                                rank: {value: player.ranking}
                              }
                            }
                          };
                          removePlayer(e); // Call removePlayer with the synthetic event object
                        }}>REMOVE {player.name}</button>
                      </div>}
                    </div>
                  );
                })}
              </div>)
          })}
          </div>
        </div>
      </div>

    
      {history.length > 0 && <div className = "History">

        <h1>History</h1>
        <button onClick = {restoreHistory}>
          Restore
        </button>
        <div>
          <button onClick={() => {
            if(historyPage > 0) setHistoryPage(historyPage-1);
          }}>
            Back
          </button>
          <button onClick={() => {
            if(historyPage < history.length-1) setHistoryPage(historyPage+1);
          }}>
            Next
          </button>
        </div>
        <div>
          {`Page ${historyPage+1}`}
        </div>
        <div className ="Ladder">
          <div className = "TopTen">
            {true && <h1>TOP 10</h1>}
            {history[historyPage].map((set, index) => {
                if(getNumPeople() >=10 && index <=2) return (<div className="Set" key={index}>
                  <p>Rung {index + 1}
                    {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                    {(getNumPeople() >=20 && history[historyPage].length-index<= 3) && <span> - Bottom 10 Bracket</span>}
                  </p>
                  {set.map((player, indx) => {
                    const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                    let played = false;
                    if(indx !==1){
                      played = player.score1 === '' ? false: true;
                      switch(player.score1){
                          case "WEATHER ISSUE":
                            played = false;
                            break;
                          case "SCHEDULE ISSUE":
                            played = false;
                            break;
                          case "PLAYER DID NOT PLAY":
                            played = false;
                            break;
                          case "OPPONENT DID NOT PLAY":
                            played = false;
                            break;
                      }
                    }
                    else{
                      played = player.score2 === '' ? false: true;
                      switch(player.score2){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                    }
                    const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                    
                    const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                    const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                    
                    const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                    const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                    return (
                      <div className="Match" key={indx}>
                        <div className="Players">
                          <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'  }}>
                            {`${player.ranking} ${player.name} `}
                          </span>
                          {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                          </span>}

                            <span style={{ color: movementColor }}>
                              {arrowIcon}{' '}
                            </span>
                            <span>
                             | 
                          </span>
                          <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal', color: !played? 'black' : !matchResult ? 'black' : 'darkgray'  }}>
                            {` ${opponent.ranking} ${opponent.name} `}
                          </span>
                          {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                          </span>}

                            <span style={{color: movementColorOpponent}}>
                              {arrowIconOpponent}
                            </span>
                          
                        </div>
                        <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                          {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                        </div>
                      </div>
                    );
                  })}
                </div>)
            })}
          </div>
          <div className = "MainDraw">
            <h1>MAIN DRAW</h1>
            {history[historyPage].map((set, index) => {
                if(!(getNumPeople() >=10 && index <=2)&&!(getNumPeople() >=20 && history[historyPage].length-index <= 3)) return (<div className="Set" key={index}>
                  <p>Rung {index + 1}
                    {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                    {(getNumPeople() >=20 && history[historyPage].length-index<= 3) && <span> - Bottom 10 Bracket</span>}
                  </p>
                  {set.map((player, indx) => {
                    const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                    let played = false;
                    if(indx !==1){
                      played = player.score1 === '' ? false: true;
                      switch(player.score1){
                          case "WEATHER ISSUE":
                            played = false;
                            break;
                          case "SCHEDULE ISSUE":
                            played = false;
                            break;
                          case "PLAYER DID NOT PLAY":
                            played = false;
                            break;
                          case "OPPONENT DID NOT PLAY":
                            played = false;
                            break;
                      }
                    }
                    else{
                      played = player.score2 === '' ? false: true;
                      switch(player.score2){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                    }
                    const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                    
                    const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                    const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                    
                    const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                    const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                    return (
                      <div className="Match" key={indx}>
                        <div className="Players">
                          <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'  }}>
                            {`${player.ranking} ${player.name} `}
                          </span>
                          {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                          </span>}
                  
                            <span style={{ color: movementColor }}>
                              {arrowIcon}{' '}
                            </span>
                            <span>
                             | 
                          </span>
                          <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal', color: !played? 'black' : !matchResult ? 'black' : 'darkgray'  }}>
                            {` ${opponent.ranking} ${opponent.name} `}
                          </span>
                          {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                            {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                          </span>}
                   
                            <span style={{color: movementColorOpponent}}>
                              {arrowIconOpponent}
                            </span>
                          
                        </div>
                        <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                          {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                  
                        </div>
                       
                      </div>
                    );
                  })}
                </div>)
            })}
          </div>
          <div className = "BottomTen">
          {true && <h1>BOTTOM 10</h1>}
          {history[historyPage].map((set, index) => {
              if(getNumPeople() >=20 && history[historyPage].length-index <= 3) return (<div className="Set" key={index}>
                <p>Rung {index + 1}
                  {(getNumPeople() >=10 && index <=2)&& <span> - Top 10 Bracket</span>}
                  {(getNumPeople() >=20 && history[historyPage].length-index <= 3)&& <span> - Bottom 10 Bracket</span>}
                </p>
                {set.map((player, indx) => {
                  const matchResult = getMatchResult(indx !== 1 ? player.score1 : player.score2);
                  let played = false;
                  if(indx !==1){
                    played = player.score1 === '' ? false: true;
                    switch(player.score1){
                        case "WEATHER ISSUE":
                          played = false;
                          break;
                        case "SCHEDULE ISSUE":
                          played = false;
                          break;
                        case "PLAYER DID NOT PLAY":
                          played = false;
                          break;
                        case "OPPONENT DID NOT PLAY":
                          played = false;
                          break;
                    }
                  }
                  else{
                    played = player.score2 === '' ? false: true;
                    switch(player.score2){
                      case "WEATHER ISSUE":
                        played = false;
                        break;
                      case "SCHEDULE ISSUE":
                        played = false;
                        break;
                      case "PLAYER DID NOT PLAY":
                        played = false;
                        break;
                      case "OPPONENT DID NOT PLAY":
                        played = false;
                        break;
                  }
                  }
                  const opponent = indx === 0 ? set[1] : indx === 1 ? set[2] : set[0];
                  
                  const movementColor = player.movement === 'UP' ? 'green' : player.movement === 'STAY' ? 'gray' : 'red';
                  const movementColorOpponent = opponent.movement === 'UP' ? 'green' : opponent.movement === 'STAY' ? 'gray' : 'red';
                  
                  const arrowIcon = player.movement === 'UP' ? '↑' : player.movement === 'STAY' ? '—' : '↓';
                  const arrowIconOpponent = opponent.movement === 'UP' ? '↑' : opponent.movement === 'STAY' ? '—' : '↓';

                  return (
                    <div className="Match" key={indx}>
                      <div className="Players">
                        <span style={{ fontWeight: !played? 'normal' : matchResult ? 'bold' : 'normal', color: !played? 'black' : matchResult ? 'black' : 'darkgray'  }}>
                          {`${player.ranking} ${player.name} `}
                        </span>
                        {player.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                          {`(DROP WARNINGS: ${player.cyclesSkipped})`}
                        </span>}

                          <span style={{ color: movementColor }}>
                            {arrowIcon}{' '}
                          </span>
                          <span>
                             | 
                          </span>
                        <span style={{ fontWeight: !played? 'normal' : !matchResult ? 'bold' : 'normal' , color: !played? 'black' : !matchResult ? 'black' : 'darkgray' }}>
                          {` ${opponent.ranking} ${opponent.name} `}
                        </span>
                        {opponent.cyclesSkipped > 0 && <span style = {{color: 'red'}}>
                          {`(DROP WARNINGS: ${opponent.cyclesSkipped})`}
                        </span>}
                  
                          <span style={{color: movementColorOpponent}}>
                            {arrowIconOpponent}
                          </span>
                        
                      </div>
                      <div className="Score" style = {{color: (player[indx !== 1 ? 'score1' : 'score2'] === '') ? 'gray' : (isNaN(parseInt(player[indx !== 1 ? 'score1' : 'score2'][0]))) ? 'darkgray' : 'gray' }}>
                        {player[indx !== 1 ? 'score1' : 'score2'] === '' ? 'N/A' : BoldScore(player[indx !== 1 ? 'score1' : 'score2'])}
                        
                      </div>
                    
                    </div>
                  );
                })}
              </div>)
          })}
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
