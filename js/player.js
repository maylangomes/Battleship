/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";
  
    var sheep = {
      dom: {
        parentNode: {
          removeChild: function () {}
        }
      }
    };
    var player = {
      grid: [],
      tries: [],
      fleet: [],
      game: null,
      activeShip: 0,
      init: function () {
        // créé la flotte
        this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
        this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
        this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
        this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));
  
        // créé les grilles
        this.grid = utils.createGrid(10, 10);
        this.tries = utils.createGrid(10, 10);
        this.vertical = false;
      },
      play: function (col, line) {
        // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
        this.game.fire(this, col, line, _.bind(function (hasSucced) {
          this.tries[line][col] = hasSucced;
        }, this));
      },
      // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
      receiveAttack: function (col, line, callback) {
        var succeed = false;
        if (this.grid[line][col] !== 0) {
          succeed = true;
          this.grid[line][col] = 0;
        }
        callback.call(undefined, succeed);
      },
      setActiveShipPosition: function (x, y) {
        var ship = this.fleet[this.activeShip];
        //console.log("player active sheep : " + this.activeShip);
        //console.log("SHIP : " + ship);
        //console.log("this player fleet : ");
        //console.log(this.fleet);
        //global.computer.setShips();
        //console.log(ship);
        // console.log("GET LIFE : " + ship.getLife());
        // console.log("GET ID : " + ship.getId());
        //console.log(this.vertical);
        //console.log("ship.getlife() : " + ship.getLife());
        if (this.vertical) {
          let i = 0;
          let j = 0;
          while (i < ship.getLife()) {
            while (j < ship.getLife()) {
              if (this.grid[y + j][x] !== 0) {
                return false;
              }
              j += 1;
            }
            this.grid[y + i][x] = ship.getId();
            //console.log("INSIDE + : " + this.grid[y][x]);
            //console.log("INSIDE - : " + this.grid[y][i]); 
            i += 1;
          }
        } else {
          let i = 0;
          let j = 0;
          while (i < ship.getLife()) {
            while (j < ship.getLife()) {
              if (this.grid[y][x + j] !== 0) {
                return false;
              }
              j += 1;
            }
            this.grid[y][x + i] = ship.getId();
            i += 1;
          }
        }
        console.log("THIS GRID");
        console.log(this.grid);
        return true;
      },
      getSetShips() {
        global.computer.setShips();
      },
      clearPreview: function () {
        this.fleet.forEach(function (ship) {
          if (ship.dom.parentNode) {
            ship.dom.parentNode.removeChild(ship.dom);
          }
        });
      },
      resetShipPlacement: function () {
        this.clearPreview();
        this.activeShip = 0;
        this.grid = utils.createGrid(10, 10);
      },
      activateNextShip: function () {
        if (this.activeShip < this.fleet.length - 1) {
          this.activeShip += 1;
          //console.log("enter activatenext");
          return true;
        } else {
          return false;
        }
      },
      renderTries: function (grid) {
        this.tries.forEach(function (row, rid) {
          row.forEach(function (val, col) {
            var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');
            if (val === true) {
              node.style.backgroundColor = '#e60019';
            } else if (val === false) {
              node.style.backgroundColor = '#aeaeae';
            }
          });
        });
      },
      renderShips: function (grid) {
        // console.log(this.grid);
      },
      setGame: function (jeux) {
        this.game = jeux;
      },
      isShipOk: function (callback) {
        callback();
      }
    };
    global.player = player;
  })(this);