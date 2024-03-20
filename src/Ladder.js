import { Player } from './Player'; // Import the Player class

export class Ladder {
    constructor() {
      this.ladder = []; // Initialize an empty array to store players
    }

    //Returns the reverse of a score
    reverseScore = (scoreString) => {
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

    //Get amount of pepole on ladder
    getNumPeople(){
      let num = 0;
      for(const rung of this.ladder){
        num+=rung.length;
      }
      return num;
    }

    //Gets rung and position in rung given a ranking
    getRung(rank){
      let rung = 0;
      let pos = 0;
      for(const set of this.ladder){
        rung++;
        pos = 0;
        for(const player of set){
          pos++;
          if(Number(player.getRanking()) === Number(rank)) return {rung, pos};
        }
      }    
      return {rung, pos};
    }

    //Gets the ladder
    getLadder(){
      return this.ladder;
    }

    //Gets number of rungs
    getNumRungs(){
      return this.ladder.length;
    }

    //Adds a rung
    addRung(p1, p2, p3){
      let numPeople = this.getNumPeople();
      p1.setRanking(numPeople+1);
      p2.setRanking(numPeople+2);
      p3.setRanking(numPeople+3);

      let rung = [p1, p2, p3];
      this.ladder.push(rung);
    }

    //Edits a player
    editPlayer(rank, name, score1, score2){
      //Gets the rung and position fo a player
      const{rung, pos} = this.getRung(rank);

      //Makes the new rung based off the pos
      const newRung = this.ladder[rung-1];
      const updatedPlayer = new Player(
        name === '' ? newRung[pos-1].getName() : name,
        rank, 
        score1 === '' ? newRung[pos-1].getScoreOne() : score1,
        score2 === '' ? newRung[pos-1].getScoreTwo() : score2,
      );
      
      if(pos === 1){
        newRung[0] = updatedPlayer;
        
        //Updates the scores for other 2 players
        newRung[1].setScoreOne(this.reverseScore(updatedPlayer.getScoreOne()));
        newRung[2].setScoreOne(this.reverseScore(updatedPlayer.getScoreTwo()));
      }
      else if (pos ===2){
        newRung[1] = updatedPlayer;
        
        //Updates the scores for other 2 players
        newRung[0].setScoreOne(this.reverseScore(updatedPlayer.getScoreOne()));
        newRung[2].setScoreTwo(this.reverseScore(updatedPlayer.getScoreTwo()));
      }
      else{
        newRung[2] = updatedPlayer;
        
        //Updates the scores for other 2 players
        newRung[0].setScoreTwo(this.reverseScore(updatedPlayer.getScoreOne()));
        newRung[1].setScoreTwo(this.reverseScore(updatedPlayer.getScoreTwo()));
      }
    }

    //Sets the movement of 3 players in a set
    updateMovement(rung){
      //Gets initial points for each player
      let pointsOne = this.ladder[rung][0].getMatchPoints();
      let pointsTwo = this.ladder[rung][1].getMatchPoints();
      let pointsThree = this.ladder[rung][2].getMatchPoints();
      
      //Assigns ranking relative to set
      pointsOne.set = 1;
      pointsTwo.set = 2;
      pointsThree.set = 3;

      const players = [pointsOne, pointsTwo, pointsThree];

      //Sorts
      players.sort((a, b) => {
        //First compares points won

        console.log('points');
        if (a.points !== b.points) {
          return b.points - a.points;
        }
        
        //Compares head to head
        console.log('h2h');
        let h2hComparison = compareHeadToHead(a, b);
        if (h2hComparison !== 0) {
          return h2hComparison;
        }

        //Compares sets  won
        console.log('sets');
        if (a.setsWon !== b.setsWon) {
          return b.setsWon - a.setsWon;
        }

        //Compares games won
        console.log('games');
        if (a.gamesWon !== b.gamesWon) {
          return b.gamesWon - a.gamesWon;
        }

        // Original ranking as the last resort
        console.log('ranking');
        return a.ranking - b.ranking;
      });

      //updates players in rung movement
      let index = 0;
      for(const p of players){
        let movement = index === 0? "UP": index === 1? "STAY" : index===2? "DOWN" : "";
        switch(p.set){
          case 1:
            this.ladder[rung][0].setMovement(movement);
            break;
          case 2:
            this.ladder[rung][1].setMovement(movement);
            break;
          case 3:
            this.ladder[rung][2].setMovement(movement);
            break;
          default:
            throw new Error();
        }
        index++;
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
        
    }

    //Shifts ladder
    shiftLadder(){
      const newLadder = this.ladder.map(innerArray => innerArray.map(player => ({ ...player })));

      let index = 0;
      let rung = 0;
      for (const set of this.ladder){
        index = 0;

        for(const player of set){
          const newPlayer = { ...this.ladder[rung][index] };
          newPlayer.setScoreOne('');
          newPlayer.setScoreTwo('');

          let numPeople = this.getNumPeople();
          let moveRank = (rung*3);
          moveRank += player.getMovement() === 'UP'? 1 : player.getMovement() ==='STAY'? 2: player.getMovement() ==='DOWN'? 3 : 0; 

          //Conditional for top 10
          if(numPeople>=10 && moveRank <= 8){
            switch (moveRank) {
              case 1:
                newPlayer.setRanking(moveRank);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 2:
                newPlayer.setRanking(moveRank+2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 3:
                newPlayer.setRanking(moveRank+4);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 4:
                newPlayer.setRanking(moveRank-2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 5:
                newPlayer.setRanking(moveRank);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 6:
                newPlayer.setRanking(moveRank+2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 7:
                newPlayer.setRanking(moveRank-4);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 8:
                newPlayer.setRanking(moveRank-2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              default:
                throw new Error();
            }
            
          }
          //Condition for bottom 10
          else if(numPeople>=20 && numPeople-moveRank+1 <= 8){
            let dif = numPeople - moveRank +1;
            switch (dif) {
              case 1:
                newPlayer.setRanking(moveRank);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 2:
                newPlayer.setRanking(moveRank-2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 3:
                newPlayer.setRanking(moveRank-4);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 4:
                newPlayer.setRanking(moveRank+2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 5:
                newPlayer.setRanking(moveRank);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 6:
                newPlayer.setRanking(moveRank-2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 7:
                newPlayer.setRanking(moveRank+4);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              case 8:
                newPlayer.setRanking(moveRank +2);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
                break;
              default:
                throw new Error();
            }
          }
          else{
            if(player.movement === "UP"){
              if(rung === 0){
                newPlayer.setRanking(1+rung*3);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
              }
              else{
                newPlayer.setRanking(3+(rung-1)*3);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
              }
            }
            else if(player.movement === "STAY"){
              newPlayer.setRanking(2+rung*3);
              newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
            }
            else if(player.movement === "DOWN"){
              if(rung === this.ladder.length-1){
                newPlayer.setRanking(3+rung*3);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
              }
              else{
                newPlayer.setRanking(1+(rung+1)*3);
                newLadder[Math.floor((newPlayer.getRanking()-1)/3)][((newPlayer.getRanking()-1) % 3)] = newPlayer;
              }
            }
          }
          index++;
        }
        rung++;
      }

      //Updates ladder
      let oldLadder = this.ladder;
      this.ladder = newLadder;

      //Returns the old ladder
      return oldLadder;
    }

    //Random generators
    //Makes a random match
    generateRandomMatch(){
      // Generate random tennis scores

      let setScores = '';
      
    
      let p1sets = 0;
      let p2sets = 0;

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
                } else if (random2points === 11 && random1points === 10) {
                  setScores += `${0}-${1}(${random1points}-${random2points}) `;
                  p1points = random1points;
                  p2points = random2points;
                } else if (random1points === 11 && random2points === 10) {
                  setScores += `${1}-${0}(${random1points+1}-${random2points}) `;
                  p1points = random1points;
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
              } else if (random2points === 7 && random1points === 6) {
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

    //Adds a random rung
    addRandomRung(){
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

      //Random names
      let r = Math.floor(Math.random() * namesBank.length);
      const nameOne = namesBank[r];
      r = Math.floor(Math.random() * namesBank.length);
      const nameTwo = namesBank[r];
      r = Math.floor(Math.random() * namesBank.length);
      const nameThree = namesBank[r];

      //Random matches
      const match1 = this.generateRandomMatch();
      const match2 = this.generateRandomMatch();
      const match3 = this.generateRandomMatch();

      //Creates 3 random players
      let numPeople = this.getNumPeople();
      const p1 = new Player(nameOne, numPeople+1, match1, match2);
      const p2 = new Player(nameTwo, numPeople+2, this.reverseScore(match1), match3);
      const p3 = new Player(nameThree, numPeople+3, this.reverseScore(match2), this.reverseScore(match3));
      
      //Adds rung
      this.addRung(p1, p2, p3);
    }

    //Fills empty matches with a random matches
    fillEmptyMatches(){
      for(const set of this.ladder){

        if(set[0].getScoreOne() === ''){
          const rand = this.generateRandomMatch();
          set[0].setScoreOne(rand);
          set[1].setScoreOne(this.reverseScore(rand));  
        }
        if(set[0].getScoreTwo()  === ''){
          const rand = this.generateRandomMatch();
          set[0].setScoreTwo(rand);
          set[2].setScoreOne(this.reverseScore(rand));  
        }
        if(set[1].getScoreOne() === ''){
          const rand = this.generateRandomMatch();
          set[1].setScoreOne(rand);
          set[0].setScoreOne(this.reverseScore(rand));  
        }
        if(set[1].getScoreTwo()  === ''){
          const rand = this.generateRandomMatch();
          set[1].setScoreTwo(rand);
          set[2].setScoreTwo(this.reverseScore(rand));
        }
        if(set[2].getScoreOne() === ''){
          const rand = this.generateRandomMatch();
          set[2].setScoreOne(rand);
          set[0].setScoreTwo(this.reverseScore(rand));
        }
        if(set[2].getScoreTwo() === ''){
          const rand = this.generateRandomMatch();
          set[2].setScoreTwo(rand);
          set[1].setScoreTwo(this.reverseScore(rand));
        }
      }
    }
  
    //Restores history to a different ladder()
    restoreHistory(ladder){
      this.ladder = ladder;
    }
  }
  