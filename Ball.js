/*************************************************************************************************************************************
 **                                              !!Haphazard!!                                                                     **
 **  CODE WRITTEN BY :Dilmanpreet Nandu   **
 **FUNCTIONS USED IN THIS CODE:                                                                                                      **
 **       **  Coordinte : it is a constructor function. We have used it to store coordinates                                         **
 **       **  randomEvenNo: returns a random even number between 2 and 8                                                             **
 **       **  randomDirection: it returns a random value b/w -1 and 1                                                                **
 **       **  Enemy : this function contains almost everything to do with enemies like thier randomwalk.                             **
 **       **  returnBallCoordinates : this function returns the coordinates of the ball.                                             **
 **       **  afterCollision : this function runs after collision and specifies what to be done with the ball and the collided enemy **
 **       **  repeatOften : this function contains the animation code                                                                **
 **       **  newGame : holds the code for the new-game button                                                                       **
 **       **  updateScore : it updates the score                                                                                     **
 **       **  gameOver : this function runs once we are eaten by a bigger cell and displays the image 'game over'                    **
 **       **  keepItDifficult: it keeps some of the enemies bigger than ball for some difficulty in the game                         **
 **                                                                                                                                  **
 *************************************************************************************************************************************/
var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;

}

//returns a random even number between 2 and 8
function randomEvenNo() {
    return (Math.floor(Math.random() * ((4 - 1) + 1) + 1)) * 2; //formula for getting a random no. b/w two NO.s * 2
    //formula for getting a random no. b/w two NO.s  /refernce: https://www.codecademy.com/forum_questions/5198adbdbbeddf9726000700
    //Math.floor(Math.random() * ((y-x)+1) + x);
}

//returs a random value between -1 and 1 
function randomDirection() {
    return Math.floor((Math.random() * 3) - 1);
}
//*****************************************ENEMIES SECTION****************************************************************************
//************************************************************************************************************************************


// --------------------------------have almost everything regarding the enemies-----------------------------------
var Enemy = function(domElement) {

    //the co-ordinates of enemis
    this.x = Math.floor((Math.random() * (585 - 50)) + 1);
    this.y = Math.floor((Math.random() * (585 - 50)) + 1);

    //********limits the enemies below the line
    if (this.y <= 120)
        this.y = 120;

    // **********for the direction of enemies
    this.xChange = randomDirection();
    this.yChange = randomDirection();

    //have the dom element thus modifying the view so as to show enemies are moving
    this.domElement = domElement;

    this.walk = function(currentFrame, j) {
        // ---------------------------------------RANDOM WALK ALGORITHM HERE -------------------------------------------------------------------- 

        // ************************RETAINS THE REFRESHING OF FRAME TO 5 PER SEC****************************************
        if (currentFrame % 5 === 0) {
            this.xChange += randomDirection();
            this.yChange += randomDirection();

            if (this.xChange > 5)
                this.xChange = 5;

            else if (this.xChange < -5)
                this.xChange = -5;

            if (this.yChange > 5)
                this.yChange = 5;

            else if (this.yChange < -5)
                this.yChange = -5;
        }

        this.x += this.xChange;
        this.y += this.yChange;

        // ***************************BOUNCE BACK*********************************

        if ((this.x <= 0 && this.xChange < 0) || (this.x >= window.innerWidth - 30 && this.xChange > 0))
            this.xChange = -this.xChange;

        if ((this.y <= 122 && this.yChange < 0) || (this.y >= (590 - (enemySize[j])) && this.yChange > 0))
            this.yChange = -this.yChange;


        // **********************updates the dom element*********************************

        this.updateDom = function() {
            this.domElement.style.left = String(this.x) + 'px';
            this.domElement.style.top = String(this.y) + 'px';
        }
    }
}


// stores the dom elements i.e. enemies in an array using 'Enemy' as a constructor function
var enemies = [];
for (i = 1; i <= 8; i++) {
    var x = document.getElementById("enemy" + i);
    enemies[i] = new Enemy(x);
}

// stores the size of enemies
var enemySize = [];
for (i = 1; i <= 8; i++) {
	 
    if (i % 2 === 0)
        enemySize[i] = 60;
    else
        enemySize[i] = 20;
}

//*******************************************************BALL SECTION****************************************************************************
//***********************************************************************************************************************************************


// stores the dom element i.e. the red ball into variable named 'ball'
var ball = document.getElementById("ball");

// ----------------------------MOVE THE BALL ALONG WITH CURSOR-------------------------------------------------------------
document.onmousemove = returnBallCoordinates;

function returnBallCoordinates(e) {
    console.log(e);



    ball.style.left = (e.clientX) + 'px';
    ball.style.top = (e.clientY) + 'px';

    //limits the ball under the line
    if (e.clientY <= 120)
        ball.style.top = 120 + 'px';

    //limits the ball above the line
    if (e.clientY >= (585 - ballSize))
        ball.style.top = (585 - ballSize) + 'px';

    ballCoordinate = new Coordinate(e.clientX, e.clientY);

    console.log("ball location:", ballCoordinate);

    // stores the mouse cordinates into variables ex and ey of the object 'mousecord' which is used ahead for collision detection
    mousecord.ex = e.clientX;
    mousecord.ey = e.clientY;

}


//***************** ---------------------------CODE FOR WHAT HAPPENS AFTER COLLISION-----------------------------**********************
//-------------------------------------------------------------------------------------------------------------------------------------

function afterCollision(j,currentScore) {

    //*************code for what happens to the eaten enemy after collision*************************

    // every time an enemy apears it changes it's size by 8 or -1 but if their size is less than 25 it only adds 8
    enemySize[j] = enemySize[j] + ((Math.random() >0.5)||(enemySize[j]<25) ? 8 : (-1));

    //gives new random coordinates to the eaten enemy
    enemies[j].x = Math.floor((Math.random() * window.innerWidth) + 1);
    enemies[j].y = Math.floor(Math.random() * ((500 - 140) + 1) + 140); //formula for getting a random no. b/w two NO.s    

    // limits the size of enemy so that the screen dont gets all covered up
    if (enemySize[j] >= 150)
        enemySize[j] = 50;

    //updates the visual part regarding the size of enemy after collision
    document.getElementById("enemy" + j).style.height = enemySize[j] + 'px';
    document.getElementById("enemy" + j).style.width = enemySize[j] + 'px';

    //*******************code for what happens to ball after collision*****************************

    // limits the size of ball and matches it with the size of enemies so that the screen dont gets all covered up
    if (ballSize >= 150) {
        ballSize = 50;
        for (i = 1; i <= 8; i++) {
			 
            if (i % 2 === 0)
                enemySize[i] = 60;
            else
                enemySize[i] = 20;
            document.getElementById("enemy" + i).style.height = enemySize[i] + 'px';
            document.getElementById("enemy" + i).style.width = enemySize[i] + 'px';
        }
    }
	if(currentScore<10)
	{
    ballSize = ballSize + 2;
    } else if(currentScore<25)
	{
		ballSize = ballSize + 1;
	}else
	{
		ballSize = ballSize + 0.5;
	}
	
	document.getElementById("ball").style.height = ballSize + 'px';
    document.getElementById("ball").style.width = ballSize + 'px';

}


// ***********************************----------------------ANIMATION CODE-----------------------------***************************************
//--------------------------------------------------------------------------------------------------------------------------------------------

var mousecord = new Coordinate(1, 1); // an object which have the coordinates of the mouse
var frame = 0; // used to limit the speed of enemies
var ballSize = 50;
var score = 0;

function repeatOften() {

    frame++;

    // a loop in order to check collision with each enemy
    for (i = 1; i <= 8; i++) {

        // call the functions responsible for the random walk of enemies
        enemies[i].walk(frame, i); // frame limits the speed of enemies
        enemies[i].updateDom();

        if (ballSize < enemySize[i]) {
            document.getElementById("enemy" + i).style.backgroundColor = 'blue';
            document.getElementById("enemy" + i).style.border = 'blue';
        } else {
            document.getElementById("enemy" + i).style.backgroundColor = 'green';
            document.getElementById("enemy" + i).style.border = 'green';
        }
        // *******************************CODE FOR COLLISION DETECTION************************************

        var dx = (mousecord.ex + (ballSize * 0.50)) - (enemies[i].x + (enemySize[i] / 2)); //*0.5 and divide by 2 because in order to get the radius
        var dy = (mousecord.ey + (ballSize * 0.50)) - (enemies[i].y + (enemySize[i] / 2)); //*0.5 and divide by 2 because in order to get the radius
        var distance = Math.sqrt((dx * dx) + (dy * dy));



        if (distance <= ((enemySize[i] / 2) + (ballSize / 2))) {
            //------- collision detected! -----------------

            if (ballSize < enemySize[i]) {
                //-----you are out----!!
                gameOver();
            } else {
                score++; //increases the score by 1 after every collision
                updateScore(score);
                afterCollision(i,score); //what happens to the ball and enemy  after collision

                if (score % 2 === 0) //will keep some of the enemies bigger than ball for some difficulty
                    keepItDifficult();
            }
        }

    }
    requestAnimationFrame(repeatOften); //refrence : https://css-tricks.com/using-requestanimationframe/

}


//-----------------------------------THE FUNCTION CALL THAT RUNS ALMOST THE WHOLE GAME------------------------------------

repeatOften();

//*****************************************************    GUI    *******************************************************
//------------------------------------------------------------------------------------------------------------------------------------------------


//---------gets the new-game button from the dom-----------------------------
document.getElementById("new-game").onclick = newGame;

//--------------------reloads the page in order to start a new game-------------------------
function newGame() {

    location.reload(); // refernce : http://www.w3schools.com/jsref/met_loc_reload.asp

}


//-----------------------it updates the score------------------------------

var updateScore = function(currentScore, currentLives) {

    document.getElementById("score").innerHTML = "Score: " + currentScore + "<br/>";
}

// IF THE BALL COLLIDES WITH A LARGER ENEMY-------!!
function gameOver() {
    document.getElementById("gameArea").style.backgroundImage = "url('picture.jpg')";

    //****************code for what happens to enemies**************************
    for (j = 1; j <= 8; j++) {
        document.getElementById("enemy" + j).style.opacity = 0;
        enemies[j].x = 44444;
    }

    //*******************code for what happens to ball*****************************

    document.getElementById("ball").style.opacity = 0;
}

// it keeps some of the enemies bigger than ball for some difficulty in the game
function keepItDifficult() {
    var number = randomEvenNo();
    document.getElementById("enemy" + number).style.height = enemySize[number] + 8 + 'px';
    document.getElementById("enemy" + number).style.width = enemySize[number] + 8 + 'px';
    enemySize[number] = enemySize[number] + 8;
}
