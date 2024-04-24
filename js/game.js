/*jslint browser this */
/*global _, player, computer, utils */

(function (global) {
    "use strict";
  
    var game = {
      PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
      PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
      PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
      PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
      PHASE_GAME_OVER: "PHASE_GAME_OVER",
      PHASE_WAITING: "waiting",
      currentPhase: "",
      phaseOrder: [],
      // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
      playerTurnPhaseIndex: 2,
      // l'interface utilisateur doit-elle être bloquée ?
      waiting: false,
      // garde une référence vers les noeuds correspondant du dom
      grid: null,
      miniGrid: null,
      // liste des joueurs
      players: [],
      // lancement du jeu
      init: function () {
        // initialisation
        this.grid = document.querySelector('.board .main-grid');
        this.miniGrid = document.querySelector('.board .mini-grid');
  
        // défini l'ordre des phase de jeu
        this.phaseOrder = [this.PHASE_INIT_PLAYER, this.PHASE_INIT_OPPONENT, this.PHASE_PLAY_PLAYER, this.PHASE_PLAY_OPPONENT, this.PHASE_GAME_OVER];
        this.playerTurnPhaseIndex = 0;
  
        // initialise les joueurs
        this.setupPlayers();
  
        // ajoute les écouteur d'événement sur la grille
        this.addListeners();
  
        // c'est parti !
        this.goNextPhase();
      },
      setupPlayers: function () {
        // donne aux objets player et computer une réference vers l'objet game
        player.setGame(this);
        computer.setGame(this);
  
        // todo : implémenter le jeu en réseaux
        this.players = [player, computer];
        this.players[0].init();
        this.players[1].init();
      },
      goNextPhase: function () {
        // récupération du numéro d'index de la phase courante
        var ci = this.phaseOrder.indexOf(this.currentPhase);
        var self = this;
        if (ci !== this.phaseOrder.length - 1) {
          this.currentPhase = this.phaseOrder[ci + 1];
        } else {
          this.currentPhase = this.phaseOrder[0];
        }
        switch (this.currentPhase) {
          case this.PHASE_GAME_OVER:
            // detection de la fin de partie
            if (!this.gameIsOver()) {
              // le jeu n'est pas terminé on recommence un tour de jeu
              this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex];
            }
          case this.PHASE_INIT_PLAYER:
            utils.info("Placez vos bateaux");
            break;
          case this.PHASE_INIT_OPPONENT:
            this.wait();
            utils.info("En attente de votre adversaire");
            this.players[1].isShipOk(function () {
              self.stopWaiting();
              self.goNextPhase();
            });
            break;
          case this.PHASE_PLAY_PLAYER:
            utils.info("A vous de jouer, choisissez une case !");
            break;
          case this.PHASE_PLAY_OPPONENT:
            utils.info("A votre adversaire de jouer...");
            this.players[1].play();
            break;
        }
      },
      gameIsOver: function () {
        return false;
      },
      getPhase: function () {
        if (this.waiting) {
          return this.PHASE_WAITING;
        }
        return this.currentPhase;
      },
      // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
      wait: function () {
        this.waiting = true;
      },
      // met fin au mode mode "attente"
      stopWaiting: function () {
        this.waiting = false;
      },
      addListeners: function () {
        // on ajoute des écouteurs uniquement sur la grid (délégation d'événement)
        this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
        this.grid.addEventListener('click', _.bind(this.handleClick, this));
        this.grid.addEventListener('contextmenu', _.bind(this.cliqueDroit, this));
      },
      cliqueDroit: function (e) {
        if (this.getPhase() === this.PHASE_INIT_PLAYER) {
          e.preventDefault();
          if (this.players[0].vertical === false) {
            this.players[0].vertical = true;
          } else {
            this.players[0].vertical = false;
          }
        }
      },
      handleMouseMove: function (e) {
        // on est dans la phase de placement des bateau
        if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
          var ship = this.players[0].fleet[this.players[0].activeShip];
  
          // si on a pas encore affiché (ajouté aux DOM) ce bateau
          if (!ship.dom.parentNode) {
            this.grid.appendChild(ship.dom);
            // this.miniGrid.appendChild(ship.dom);
            // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
            ship.dom.style.zIndex = -1;
          }
  
          // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
          if (this.players[0].vertical === false) {
            if (ship.id === 4) {
              ship.dom.style.top = utils.eq(e.target.parentNode) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
              //console.log(600 + this.players[0].activeShip * 60);
              ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + 60 + "px";
              ship.dom.style.transform = 'none';
            } else {
              ship.dom.style.top = utils.eq(e.target.parentNode) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
              //console.log(600 + this.players[0].activeShip * 60);
              //console.log("SHIP TOP AFTER : " + ship.dom.style.top);
              ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + 120 + "px";
              //console.log("SHIP LEFT AFTER : " + ship.dom.style.left);
              ship.dom.style.transform = 'none';
              //ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE + "px";
            }
          } else if (this.players[0].vertical) {
            if (ship.id === 1 || ship.id === 2) {
              ship.dom.style.transform = 'rotate(90deg)';
              ship.dom.style.top = utils.eq(e.target.parentNode) * utils.CELL_SIZE - (480 + this.players[0].activeShip * 60) + "px";
              ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
            } else if (ship.id === 3) {
              ship.dom.style.transform = 'rotate(90deg)';
              ship.dom.style.top = utils.eq(e.target.parentNode) * utils.CELL_SIZE - (540 + this.players[0].activeShip * 60) + 30 + "px";
              ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife()) * utils.CELL_SIZE + 150 + "px";
            } else if (ship.id === 4) {
              ship.dom.style.transform = 'rotate(90deg)';
              ship.dom.style.top = utils.eq(e.target.parentNode) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + 60 + "px";
              ship.dom.style.left = utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife()) * utils.CELL_SIZE + 120 + "px";
            }
          }
        }
      },
      handleClick: function (e) {
        // self garde une référence vers "this" en cas de changement de scope
        var self = this;
  
        // si on a cliqué sur une cellule (délégation d'événement)
        if (e.target.classList.contains('cell')) {
          // si on est dans la phase de placement des bateau
          if (this.getPhase() === this.PHASE_INIT_PLAYER) {
            // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
            if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
              // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
              if (!this.players[0].activateNextShip()) {
                this.wait();
                utils.confirm("Confirmez le placement ?", function () {
                  // si le placement est confirmé
                  self.stopWaiting();
                  self.renderMiniMap();
                  self.players[0].clearPreview();
                  self.goNextPhase();
                  self.setupPlayers;
                  //console.log("GLOBAL SET SHIPS");
                  global.computer.setShips();
                  //console.log("FIIIIIIIINN GLOBAL SET SHIPS");
                }, function () {
                  self.stopWaiting();
                  // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                  self.players[0].resetShipPlacement();
                });
              }
            }
            // si on est dans la phase de jeu (du joueur humain)
          } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
            this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
            // this.renderMiniMap();
          }
        }
      },
      // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
      // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
      fire: function (from, col, line, callback) {
        this.wait();
        var self = this;
        var msg = "";
  
        // determine qui est l'attaquant et qui est attaqué
        var target = this.players.indexOf(from) === 0 ? this.players[1] : this.players[0];
        if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
          msg += "Votre adversaire vous a... ";
        }
  
        // on demande à l'attaqué si il a un bateaux à la position visée
        // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
        target.receiveAttack(col, line, function (hasSucceed) {
          if (hasSucceed) {
            msg += "Touché !";
          } else {
            msg += "Manqué...";
          }
          utils.info(msg);
  
          // on invoque la fonction callback (4e paramètre passé à la méthode fire)
          // pour transmettre à l'attaquant le résultat de l'attaque
          callback(hasSucceed);
  
          // on fait une petite pause avant de continuer...
          // histoire de laisser le temps au joueur de lire les message affiché
          setTimeout(function () {
            self.stopWaiting();
            self.goNextPhase();
          }, 1000);
        });
      },
      renderMap: function () {
        this.players[0].renderTries(this.grid);
      },
      renderMiniMap: function () {
        document.getElementsByClassName("mini-grid")[0].innerHTML = document.getElementsByClassName('main-grid')[0].innerHTML;
      }
    };
  
    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
      game.init();
    });
  })(this);