/*
 * shuffle() function provided by Udacity's starter code
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

 /** defin an array to hold the img on the game bored  **/

var img_array = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

/** defin variables and give it initlizing values  which explain game STATES**/
var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

/** define number of steps to determine how many stars rating for each number of steps or moves **/
var difficult= 15;
var medium = 20;

var modal = $("#win-modal");

/** when the timer in second reach 59 second we increase the timer till it's reach 1 minute and so on,
 *  till the game finsh 
 */
// function to start count the time when the player strat the game  
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};

// Resets timer state and restarts timer when the player finish the game 
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};

// take the img from array define abouf and use the randomize function proviede by udacity "shuffle"
function updateCards() {
    img_array = shuffle(img_array);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + img_array[index]);
      index++;
    });
    resetTimer();
};

/**show the win message  */
function showModal() {
    modal.css("display", "block");
};

// reduce number of starts
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

// when the player restart the game return the number of starts to 3 again
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

/*increse number of moves in the HTML, removes star is necessary based on steps of move variables defining above*/
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === difficult || moveCounter === medium) {
        removeStar();
    }
};

// Checks if card is a valid move mean thats the card is not open or already match with other card on the bored
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

// this function is to test or checks if there is 2-cards match together or not 
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

/*show win message by exmine if all 16 img are already open or not then if it's open pop up the win MSG*/
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

// test each open cards if there is any match and add it to open list to be as solved in the bored
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// when user restart the game make the open list empty again from the cards
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// selected card use the predefined function to push the cars to the open list and show state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

// Return game variables and resets HTML to default state by using the functions alredy define above
//to help restate the game to the begginer
var resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

//  game logic structuer to start the game correctly 
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

// if the user choose to play again clear the win message from the screen of the user
var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};


//Listeners for game event
$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);

// Provides a randomized game board on page load
$(updateCards);
