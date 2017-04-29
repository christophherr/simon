/* global $, swal*/
var Simon = {
    count: 0,
    activeSimon: [],
    player: [],
    strict: false,
    start: false,
    possibilities: ['green', 'red', 'blue', 'yellow'],
    countDisplay: document.getElementById('steps-number'),
    restartButton: document.getElementById('button-restart'),
    strictButton: document.getElementById('button-strict'),
    resetButton: document.getElementById('button-reset'),
    inputPanels: document.querySelectorAll('.panel'),
    sound: {
        blue: new Audio(
            'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
        ),
        red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
        yellow: new Audio(
            'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'
        ),
        green: new Audio(
            'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
        )
    },
    resetPlayer: function() {
        this.player = [];
    },
    stopGame: function() {
        this.activeSimon = [];
        this.count = 0;
        setTimeout(function() {
            Simon.countDisplay.innerHTML = Simon.count;
        }, 200);
    },
    resetGame: function() {
        this.stopGame();
        setTimeout(function() {
            Simon.addCount();
        }, 500);
    },
    nextLevel: function() {
        this.addCount();
    },
    addCount: function() {
        this.count++;
        setTimeout(function() {
            Simon.countDisplay.innerHTML = Simon.count;
        }, 300);
        this.generateMove();
    },
    generateMove: function() {
        setTimeout(function() {
            Simon.activeSimon.push(
                Simon.possibilities[Math.floor(Math.random() * 4)]
            );
            Simon.showCount();
        }, 600);
    },
    showCount: function() {
        var i = 0;
        var count = setInterval(function() {
            Simon.showPlayerMove(Simon.activeSimon[i]);
            i++;
            if (i >= Simon.activeSimon.length) {
                clearInterval(count);
            }
        }, 800);
        this.resetPlayer();
    },
    playSound: function(color) {
        switch (color) {
            case 'green':
                this.sound.green.play();
                break;

            case 'red':
                this.sound.red.play();
                break;

            case 'blue':
                this.sound.blue.play();
                break;

            case 'yellow':
                this.sound.yellow.play();
                break;

            default:
                console.log(
                    'If default is reached, something is really wrong...'
                );
        }
    },
    showPlayerMove: function(panel) {
        setTimeout(function() {
            document.getElementById(panel).style.opacity = 1;
            Simon.playSound(panel);
            setTimeout(function() {
                document.getElementById(panel).style.opacity = 0.6;
            }, 450);
        }, 350);
    },
    playerMove: function(panel) {
        var playerMoveIncomplete, check;
        playerMoveIncomplete =
            this.player[this.player.length - 1] !==
            this.activeSimon[this.player.length - 1];
        check = this.player.length === this.activeSimon.length;
        if (this.start === false) {
            return;
        }
        if (playerMoveIncomplete) {
            if (this.strict) {
                swal({
                    title: 'Oops... You made a mistake',
                    text: 'You have to start over.',
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonText: 'Start over.',
                    cancelButtonText: 'Stop playing.'
                }).then(
                    function() {
                        setTimeout(function() {
                            Simon.resetGame();
                        }, 600);
                    },
                    function(dismiss) {
                        if (dismiss === 'cancel') {
                            Simon.start = false;
                            Simon.strict = false;
                            Simon.strictButton.classList.toggle('faded');
                            Simon.restartButton.classList.toggle('faded');
                            Simon.restartButton.style.background = 'red';
                            Simon.stopGame();
                        }
                    }
                );
            } else {
                swal({
                    title: 'Wrong move!',
                    text: 'Please look and listen carefully and correct your mistake.',
                    type: 'error'
                }).then(function() {
                    Simon.showCount();
                });
            }
        } else {
            this.playSound(panel);

            if (check) {
                if (this.count === 20) {
                    setTimeout(function() {
                        swal({
                            title: 'You won! Congratulations.',
                            text: 'Do you want to play another round?',
                            type: 'success',
                            showCancelButton: true,
                            confirmButtonText: 'Start a new game.',
                            cancelButtonText: 'Stop playing.'
                        }).then(
                            function() {
                                setTimeout(function() {
                                    Simon.resetGame();
                                }, 600);
                            },
                            function(dismiss) {
                                if (dismiss === 'cancel') {
                                    Simon.start = false;
                                    if (Simon.strict === true) {
                                        Simon.strict = false;
                                        Simon.strictButton.classList.toggle(
                                            'faded'
                                        );
                                        Simon.restartButton.classList.toggle(
                                            'faded'
                                        );
                                        Simon.restartButton.style.background =
                                            'red';
                                        Simon.stopGame();
                                    }
                                }
                            }
                        );
                    }, 500);
                } else {
                    setTimeout(function() {
                        Simon.nextLevel();
                    }, 500);
                }
            }
        }
    }
};

Simon.restartButton.addEventListener('click', function() {
    if (Simon.start === false) {
        Simon.start = true;
        this.classList.toggle('faded');
        this.style.background = 'green';
        Simon.resetGame();
    } else {
        Simon.start = false;
        this.classList.toggle('faded');
        this.style.background = 'red';
        Simon.stopGame();
    }
});

Simon.strictButton.addEventListener('click', function() {
    if (Simon.strict === false) {
        Simon.strict = true;
        this.classList.toggle('faded');
        if (Simon.start === false) {
            // Alternatively, start the game
            // Simon.start = true;
            // restartButton.classList.toggle('faded');
            // restartButton.style.background = 'green';
            return;
        }
        Simon.resetGame();
    } else {
        Simon.strict = false;
        this.classList.toggle('faded');
        if (Simon.start === false) {
            return;
        }
        Simon.resetGame();
    }
});

Simon.resetButton.addEventListener('click', function() {
    setTimeout(function() {
        Simon.resetButton.style.opacity = 1;
        setTimeout(function() {
            Simon.resetButton.style.opacity = 0.6;
        }, 450);
    }, 350);

    if (Simon.start === false) {
        return;
    }
    Simon.resetGame();
});

for (var i = 0; i < Simon.inputPanels.length; i++) {
    Simon.inputPanels[i].addEventListener('click', function(event) {
        var click = event.target.id;
        // console.log('Player move: ' + click);
        Simon.player.push(click);
        Simon.playerMove(click);
        Simon.showPlayerMove(click);
    });
}
