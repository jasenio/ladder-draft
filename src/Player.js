export class Player {
    constructor(name, ranking, score1, score2) {
      this.name = name;
      this.ranking = ranking;
      this.score1 = score1;
      this.score2 = score2;
      this.movement = "";
    }
    
    //Simple getter methods
    getName(){
      return this.name;
    }
    getRanking(){
      return this.ranking;
    }
    getScoreOne(){
      return this.score1;
    }
    getScoreTwo(){
      return this.score2;
    }
    getMovement(){
      return this.movement;
    }

    //Simple setter methods
    setName(name) {
      this.name = name;
    }
    setRanking(ranking) {
      this.ranking = ranking;
    }
    setScoreOne(score1) {
      this.score1 = score1;
    }
    setScoreTwo(score2) {
      this.score2 = score2;
    }
    setMovement(movement) {
      this.movement = movement;
    }

    //Gets the matches won, sets won, games won, and h2h
    getMatchPoints (){
      let scores = this.score1.replace(/\([^)]*\)/g, '').split(' ');

      let matchesWon = 0;
      let matchesLost = 0;
      let setsWon = 0;
      let setsLost = 0;
      let gamesWon = 0;
      let endTiebreak = 0;
      const h2h =[0, 0];

      //If match 1 was played, determines games, sets, and match won
      if(this.score1 !== ''){
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
      }
      if(setsWon > setsLost){
        matchesWon++;
        h2h[0] = 1;
      }
      else{
        matchesLost++;
        h2h[0] = -1;
      }

      //Accounts for sets won when ending tiebreak played
      if(endTiebreak===1) setsWon--;
      endTiebreak = 0;

      //Sets setsLost to setsWon to redetermine who won
      setsLost = setsWon;

      //Uses scores from match 2
      scores = this.score2.replace(/\([^)]*\)/g, '').split(' ');

      //If match 2 was played, determines games, sets, and match won
      if(this.score2 !== ''){
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
      }
      if(setsWon > setsLost){
        matchesWon++;
        h2h[1] = 1;
      }
      else{
          matchesLost++;
          h2h[1] = -1;
      }

      if(endTiebreak) setsWon--;
      endTiebreak = 0;

      let points = 0;
      if (matchesWon === 2 && matchesLost === 0) {
        points = 4;
      } else if (matchesWon === 1 && matchesLost === 0) {
        points = 3;
      } else if (matchesWon === 1 && matchesLost === 1) {
        points = 2;
      } else if (matchesWon === 0 && matchesLost === 1) {
        points = 1;
      } else if (matchesWon === 0 && matchesLost === 2) {
        points = 1;
      } else if (matchesWon === 0 && matchesLost === 0) {
        points = 0;
      }

      return { points, matchesWon, matchesLost, setsWon, gamesWon, h2h };
    }

    //Gets an individual match result
    getMatchResult(score){
      let scores = score? this.score1.replace(/\([^)]*\)/g, '').split(' ') : this.score2.replace(/\([^)]*\)/g, '').split(' ');
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


  }