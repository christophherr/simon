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
        }
    },
    resetPlayer,
    stopGame,
    resetGame,
    startNewGame,
    nextLevel,
    addCount,
    generateMove,
    showCount,
    sound,
    addMove,
    playGame,
    playerMove,
    playerMoveIncomplete,
    check;

resetPlayer = function() {
    Simon.player = [];
};

stopGame = function() {
    Simon.activeSimon = [];
    Simon.count = 0;
    setTimeout(
        function() {
            $('.steps-number').html(Simon.count);
        },
        200
    );
};

resetGame = function() {
    stopGame();
    addCount();
};

startNewGame = function() {
    resetGame();
};

$('.button-restart').click(function() {
    if (Simon.start === false) {
        Simon.start = true;
        $(this).toggleClass('faded').css('background', 'green');
        startNewGame();
    } else {
        Simon.start = false;
        $(this).toggleClass('faded').css('background', 'red');
        stopGame();
    }
});

$('.button-strict').click(function() {
    if (Simon.strict === false) {
        Simon.strict = true;
        $(this).toggleClass('faded');
        startNewGame();
    } else {
        Simon.strict = false;
        $(this).toggleClass('faded');
        startNewGame();
    }
});

$('.button-reset').click(function() {
    $(this).fadeTo(350, 1, function() {
        $(this).fadeTo(250, 0.6);
    });

    if (Simon.start === false) {
        return;
    }
    startNewGame();
});

nextLevel = function() {
    addCount();
};

addCount = function() {
    Simon.count++;
    setTimeout(
        function() {
            $('.steps-number').html(Simon.count);
        },
        200
    );

    generateMove();
};

generateMove = function() {
    Simon.activeSimon.push(Simon.possibilities[Math.floor(Math.random() * 4)]);

    showCount();
};

showCount = function() {
    var i = 0;
    var count = setInterval(
        function() {
            playGame(Simon.activeSimon[i]);
            i++;
            if (i >= Simon.activeSimon.length) {
                clearInterval(count);
            }
        },
        800
    );

    resetPlayer();
};

sound = function(color) {
    switch (color) {
        case '#green':
            Simon.sound.green.play();
            break;
        case '#red':
            Simon.sound.red.play();
            break;
        case '#blue':
            Simon.sound.blue.play();
            break;
        case '#yellow':
            Simon.sound.yellow.play();
            break;
        default:
            console.log(
                'If default is reached, something is really wrong...'
            );
    }
};

addMove = function(id) {
    var panel = '#' + id;
    console.log(panel);
    Simon.player.push(panel);
    playerMove(panel);
};

playGame = function(panel) {
    $(panel).fadeTo(300, 1, function() {
        sound(panel);
        setTimeout(
            function() {
                $(panel).fadeTo(250, 0.6);
            },
            300
        );
    });
};

$('.panel.green, .panel.red, .panel.blue, .panel.yellow').click(function() {
    $(this).fadeTo(350, 1, function() {
        $(this).fadeTo(250, 0.6);
    });
});

playerMove = function(x) {
    if (Simon.start === false) {
        return;
    }

    playerMoveIncomplete = Simon.player[Simon.player.length - 1] !==
        Simon.activeSimon[Simon.player.length - 1];

    if (playerMoveIncomplete) {
        if (Simon.strict) {
            alert('Sorry, you made a mistake. Please start over.');
            startNewGame();
        } else {
            alert(
                'Wrong move! Please look and listen carefully and correct your mistake.'
            );
            showCount();
        }
    } else {
        console.log('Good Move!');
        sound(x);
        check = Simon.player.length === Simon.activeSimon.length;
        if (check) {
            if (Simon.count === 20) {
                alert(
                    'You won! Congratulations. Do you want to play another round?'
                );
            } else {
                nextLevel();
            }
        }
    }
};
