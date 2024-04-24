/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";
  
    var computer = _.assign({}, player, {
      grid: [],
      tries: [],
      fleet: [],
      game: null,
      play: function () {
        var self = this;
        setTimeout(function () {
          //console.log("SELF : " + self);
          console.log(global.computer);
          self.game.fire(this, 0, 0, function (hasSucced) {
            self.tries[0][0] = hasSucced;
          });
        }, 2000);
      },
      areShipsOk: function (callback) {
        var i = 0;
        var j;
        this.fleet[i].forEach(function (ship, i) {
          j = 0;
          while (j < ship.life) {
            this.grid[i][j] = ship.getId();
            j += 1;
          }
        }, this);
        setTimeout(function () {
          callback();
        }, 500);
      },
      setShips: function () {
        //this.computer.game.players
        //console.log("this computer fleet : ");
        //console.log(this.fleet);
  
        let yArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let xArray = [0, 1, 2, 3, 4, 5];
        let index;
        //console.log("ARRAY yArray : " + yArray);
  
        let ship;
        for (let i = 0; i < 4; i++) {
          //console.log("BOUCLE FLEET : ");
          //console.log(this.fleet[i]);
          ship = this.fleet[i];
          let j = 0;
          let yRdm = yArray[Math.floor(yArray.length * Math.random())];
          let xRdm = xArray[Math.floor(xArray.length * Math.random())];
          index = yArray.indexOf(yRdm);
          if (index > -1) {
            yArray.splice(index, 1);
          }
          while (j < ship.getLife()) {
            this.grid[yRdm][xRdm + j] = ship.getId();
            //this.grid[0][5 - i] = ship.getId();
            j += 1;
          }
        }
        console.log("SHIPS COMPUTER : ");
        console.log(this.grid);
      }
    });
    global.computer = computer;
  })(this);