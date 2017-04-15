/* global $ */
var Simon = {
    count: 0,
    activeSimon: [],
    player: [],
    strict: false,
    start: false,
    possibilities: ['#green', '#red', '#blue', '#yellow'],
    sound: {
        blue: new Audio(
            'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
        ),
        red: new Audio(
            'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
        ),
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
        setTimeout(
            function() {
                $('.steps-number').html(Simon.count);
            },
            200
        );
    },
    resetGame: function() {
        this.stopGame();
        setTimeout(
            function() {
                Simon.addCount();
            },
            500
        );
        // this.addCount();
    },
    startNewGame: function() {
        this.resetGame();
    },
    nextLevel: function() {
        this.addCount();
    },
    generateMove: function() {
        setTimeout(function() {
                Simon.activeSimon.push(Simon.possibilities[Math.floor(Math.random() * 4)]);
                Simon.showCount();
            },
            600
        );
    },
    addCount: function() {
        this.count++;
        setTimeout(
            function() {
                $('.steps-number').html(Simon.count);
            },
            300
        );
        this.generateMove();
    },
    showCount: function() {
        var i = 0;
        var count = setInterval(
            function() {
                Simon.playGame(Simon.activeSimon[i]);
                i++;
                if (i >= Simon.activeSimon.length) {
                    clearInterval(count);
                }
            },
            800
        );
        this.resetPlayer();
    },
    playSound: function(color) {
        switch (color) {
            case '#green':
                this.sound.green.play();
                break;
            case '#red':
                this.sound.red.play();
                break;
            case '#blue':
                this.sound.blue.play();
                break;
            case '#yellow':
                this.sound.yellow.play();
                break;
            default:
                console.log(
                    'If default is reached, something is really wrong...'
                );
        }
    },
    addMove: function(id) {
        var panel = '#' + id;
        console.log(panel);
        this.player.push(panel);
        this.playerMove(panel);
        this.playGame(panel);
    },
    playGame: function(panel) {
        $(panel).fadeTo(300, 1, function() {
            Simon.playSound(panel);
            setTimeout(
                function() {
                    $(panel).fadeTo(250, 0.6);
                },
                300
            );
        });
    },
    playerMove: function(x) {
        var playerMoveIncomplete = this.player[this.player.length - 1] !== this.activeSimon[this.player.length - 1];
        var check = this.player.length === this.activeSimon.length;
        if (this.start === false) {
            return;
        }
        if (playerMoveIncomplete) {
            if (this.strict) {
                alert('Sorry, you made a mistake. Please start over.');
                setTimeout(
                    function() {
                        Simon.startNewGame();
                    },
                    600
                );
            } else {
                alert(
                    'Wrong move! Please look and listen carefully and correct your mistake.'
                );
                this.showCount();
            }
        } else {
            console.log('Good Move!');
            this.playSound(x);

            if (check) {
                if (this.count === 20) {
                    alert(
                        'You won! Congratulations. Do you want to play another round?'
                    );
                } else {
                    setTimeout(function() {
                            Simon.nextLevel();
                        },
                        500
                    );
                }
            }
        }
    }
};

$('.panel.green, .panel.red, .panel.blue, .panel.yellow').click(function() {
    $(this).fadeTo(350, 1, function() {
        $(this).fadeTo(250, 0.6);
    });
});

$('.button-restart').click(function() {
    if (Simon.start === false) {
        Simon.start = true;
        $(this).toggleClass('faded').css('background', 'green');
        Simon.startNewGame();
    } else {
        Simon.start = false;
        $(this).toggleClass('faded').css('background', 'red');
        Simon.stopGame();
    }
});

$('.button-strict').click(function() {
    if (Simon.strict === false) {
        Simon.strict = true;
        $(this).toggleClass('faded');
        Simon.startNewGame();
    } else {
        Simon.strict = false;
        $(this).toggleClass('faded');
        Simon.startNewGame();
    }
});

$('.button-reset').click(function() {
    $(this).fadeTo(350, 1, function() {
        $(this).fadeTo(250, 0.6);
    });

    if (Simon.start === false) {
        return;
    }
    Simon.startNewGame();
});
