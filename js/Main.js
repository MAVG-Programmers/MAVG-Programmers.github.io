// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

canvas.width = w.innerWidth;
canvas.height = w.innerHeight-5;
document.body.appendChild(canvas);

// powerUps:

var shotGun = true

// store

// LocalStorage --

if (localStorage.getItem("record") == null)
{
	var localHighScore = []
}
else
{
	var localHighScore = localStorage.getItem("record").split(",");

	console.trace("Local High Scores: ")
	for (var i = 0; i < localHighScore.length; i++)
	{
		console.trace(String(i+1) + ". " + String(localHighScore[i]) + " seconds")
	}
}

function compareNumbers(a, b) {
  return a-b;
}

function loseGame() 
{
 	survivedSeconds = String(Math.floor((Date.now()-startTime)/1000))
	//meOverFunction(Math.floor((Date.now()-startTime)/1000));
	gameOver = true
	ballArray = []
    aoeArray = []
    turnedArray = []
	shotArray = []
	fighterArray = []
	center.x = 4000
	center.y = 4000
	center.x = 4000
	center.y = 4000
	center.radius = 200
	pad.x = 4000
	pad.y = 4000

	localHighScore.push(survivedSeconds)
	localHighScore.sort(compareNumbers)
	localStorage.setItem("record", localHighScore);
	document.getElementById("overlay").style.display = "block";
	document.getElementById("score").value = survivedSeconds       	
}

// Game objects

center = new Center()

var pad = 
{
	rotation: 0
};

var spawnCount = 0;
var ballArray = []
var wasteArray = []
var ballRadius = 7
var turnedArray = []
var fighterArray = []
var shotArray = []

var laserArray = []

var rect = canvas.getBoundingClientRect();
var mouseX = 0
var mouseY = 0
var deltaMouseX = 0
var deltaMouseY = 0
var deltaMouse = 0
var deltaRotation = 0

// THIS CODE DISABLES RIGHT CLICKING - SHOULD BE ACTIVATED IN THE RELEASED GAME - DEACTIVATED FOR DEBUGGING PURPOSES
document.oncontextmenu = function(e){
 var evt = new Object({keyCode:93});
 stopEvent(e);
 //keyboardUp(evt);
}
function stopEvent(event){
 if(event.preventDefault != undefined)
  event.preventDefault();
 if(event.stopPropagation != undefined)
  event.stopPropagation();
}
var submittedScore = false
document.getElementById("playagainbtn").addEventListener("click", function (e) 
{
	location.reload();
	document.getElementById("overlay").style.display = "none";
}, false);

document.getElementById("save").addEventListener("click", function (e) 
{
	if (submittedScore == false)
	{
		submitscore(document.getElementById("namefield").value, survivedSeconds);
		submittedScore = true
	}
}, false);

navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/)
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var soundType = ""
if (navigator.sayswho.indexOf("Opera") == -1)
{
	soundType = ".mp3"
}
else
{
	soundType = ".wav"
}

function doMouseDown(event)
{
	// SHOTGUN
	/*if (center.redCounter < 200)
	{
		var numLasers = 5
		var angleError = -0.1
		if (muted == false)
		{
			var snd = new Audio("sound/Menu1"+soundType);
			snd.play()
		}
		
		for (l = 0; l < numLasers; l++)
		{
			var laser = new Laser();
			laser.spawn(angleError);
			angleError += 0.05
		}
	}*/
	
	// AUTOMATIC GUN
	center.firing = true
	

	var sx = center.x
	var sy = center.y
}

function doMouseUp(event)
{
	center.firing = false
}


function getX(event, canvas){
     if(event.offsetX){
       return event.offsetX;
     }
     if(event.clientX){
     return event.clientX - canvas.offsetLeft;
     }
    return null;
 }

function getY(event, canvas){
    if(event.offsetY){//chrome and IE
        return event.offsetY;
    }
    if(event.clientY){// FF
        return event.clientY- canvas.offsetTop;
    }
    return null;    
}

addEventListener("mousemove", function (e) 
{
	deltaMouseX = getX(e, canvas)-mouseX
	deltaMouseY = getY(e, canvas)-mouseY
	deltaMouse = Math.sqrt(deltaMouseX*deltaMouseX+deltaMouseY*deltaMouseY)
	mouseX = getX(e, canvas);
	mouseY = getY(e, canvas);

	var dx = mouseX - center.x
	var dy = center.y - mouseY
	var distance = Math.sqrt(dx * dx + dy * dy)
	
	try
	{
		int(deltaRotation)
		deltaRotation = (deltaRotation+Math.atan2(-dy, dx)-pad.rotation)/2
	}
	catch(g)
	{
		deltaRotation = Math.atan2(-dy, dx)-pad.rotation
	}

	
	//console.trace(deltaRotation)
	var angle = 0

	angle = Math.atan2(-dy, dx)
	
	pad.x = center.x
	pad.y = center.y

	pad.rotation = angle
	pad.visualRotation = angle
	pad.testRotation = 180 + 180 * -angle / Math.PI 

}, false);

var spawnLimit = 0.01
var test = false

var aoeArray = [] 
var gameOver = false
var survivedSeconds = 0
var bar = new jetBar();

var update = function (modifier) 
{
	if (gameOver == false)
	{
		if (Math.random() < spawnLimit && gameOver == false)
		{
			var ball = new Ball();
			ball.spawn(modifier*ballSpeed+10*spawnLimit);
			spawnLimit += modifier*0.01
		}

		if (center.firing && center.gunCounter < gunLimit)
		{
			if (center.redCounter  < 255-redLimit)
			{
				if (shotGun == false)
				{
					if (muted == false)
					{
						var snd = new Audio("sound/Menu1"+soundType);
						snd.play()
					}

					var laser = new Laser();
					laser.spawn((Math.random()-0.5)*accuracy + (Math.random()-0.5)*center.gunCounter*recoil, 1);
				}

				else
				{
					//var accoil = (Math.random()-0.5)*accuracy + (Math.random()-0.5)*center.gunCounter*recoil
					var numLasers = 5
					var angleError = -0.1
					if (muted == false)
					{
						var snd = new Audio("sound/Menu1.wav");
						snd.play()
					}
					
					for (l = 0; l < numLasers; l++)
					{
						var laser = new Laser();
						laser.spawn(0, 5);
						angleError += 0.05
					}	
				}
			}

			else if (muted == false)
			{
				var refuseSound = new Audio("sound/Reject1"+soundType);
				refuseSound.play()
			}
		}

		if(fighterBar <= fighterBarMax)
		{
			fighterBar += 1;
		}

		if (center.changing == true)
		{
			center.radiusChanger(modifier)
		}

		updateBlast(modifier)

		updateBall(modifier);

		updateLasers(modifier);

		updateShots(modifier);

		updateFighters(modifier);

		//center.redCounter-=1
	}	
};

var render = function (deltaTime) 
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#36A8E0';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	
	ctx.fillStyle = 'rgba('+String(a)+','+String(b)+','+String(c)+','+String(0.4)+')';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	if(gameOver == true)
	{
		ctx.fillStyle = "black"
		ctx.font="20px Tekton Pro";
		ctx.fillText("You survived "+survivedSeconds+" seconds of invading balls. ",canvas.width/2 - 150,canvas.height /2-25)
		ctx.fillText("Press SPACE to try again.",canvas.width/2 - 100,canvas.height /2)
	}

	else if(gameOver == false)
	{
		bar.drawLine(fighterBar, deltaTime);

		drawBlast();

		centerColor = "rgb(" +String(center.redCounter)+", 0, 0)";
		center.redCounter = Math.max(center.redCounter-1, 0)
		center.gunCounter = Math.max(center.gunCounter-1, 0)
	    
	    drawTurned();

		drawWaste();

		drawFighters();

		drawShots();

		drawLasers();
	    
		drawBall();

		pad.draw()

		center.draw()


		var Now = Date.now()
		survivedSeconds = Math.floor((Now-startTime)/1000)
		ctx.fillStyle = "black"
		ctx.font="60px Arial Black";
		ctx.fillText(String(Math.floor((Now-startTime)/1000)),canvas.width/2-20,100)
	}
	
	var wind = 0.05*Math.random()+0.5+0.05*Math.sin(0.01*d)-0.03*center.radius+0.2
	//console.trace(wind)
	ctx.fillStyle = 'rgba('+String(a)+','+String(b)+','+String(c)+','+String(wind)+')';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	screenColorChanger();
};

var startTime = Date.now();
var aCounter = 1
var increasing = "a"
var a = 0
var b = 255
var c = 255
var d = 1

var main = function () 
{
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render(delta / 1000);

	then = now;
	requestAnimationFrame(main);
};

var ballColor = '#CF0000';
var centerColor = "rgb(82, 92 ,209)"; //(R,G,B)

var pad = new Pad()
pad.draw()

var songLength = 15*60
if (soundType == ".wav")
{
	var music = new Audio("music/Mix3.ogg");
}
else
{
	var music = new Audio("music/Mix3"+soundType);
}

music.play()
var then = Date.now();
main();


var comboSounds = [new Audio("sound/Combo/2/1"+soundType), new Audio("sound/Combo/2/2"+soundType), new Audio("sound/Combo/2/3"+soundType)]
var comboThen = 0
var comboStage = 0
var comboHits = 0

addEventListener("mousedown", doMouseDown, false);
addEventListener("mouseup", doMouseUp, false);

addEventListener("keydown", keyboard, true);

var muted = false
var fighterBar = 0;
var fighterBarMax = canvas.width;

function keyboard(e)
{
	if(e.keyCode === 87) //32 = space
	{
		// W
		if(center.redCounter === 0)
		{
			var blast = new AoEBlast();
			blast.spawn();
		}
		else if (muted == false)
		{
			// REFUSE BUY
			var refuseSound = new Audio("sound/Reject1"+soundType);
			refuseSound.play()
		}
		
	}
	else if (e.keyCode == 69)
	{
		// E
		if (fighterBar >= fighterBarMax)
		{
			var fighter = new Fighter();
			fighter.spawn();
			fighterBar = 0;
		}

		if (muted == false)
		{
			// REFUSE BUY
			var refuseSound = new Audio("sound/Reject1"+soundType);
			refuseSound.play()
		}
		
	}
	else if (e.keyCode == 77)
	{
		// E
		muted = !muted
	}
	else if (e.keyCode == 32)
	{
		// SPACE
		if(gameOver == true)
		{
			location.reload();
		}
		else //INSTADEATH
		{
			loseGame()
		}
	}
}

function submitscore(name, score){
	var xmlhttp;
	if (window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.open("POST","http://waveos.pf-control.de/scores/submitscore.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("username=" + name + "&score=" + score);
}



function drawTurned()
{
	turnedArray.forEach(function(turned)
    {
    	turned.moveIntoOrbit()
        turned.circleCounter += turned.circleSpeed

		turned.vector[0] = -Math.sin(turned.circleCounter + turned.crashAngle) + turned.errorSpeedX * turned.circleSpeed
		turned.vector[1] = Math.cos(turned.circleCounter + turned.crashAngle) + turned.errorSpeedY * turned.circleSpeed
		turned.x += turned.vector[0]
		turned.y += turned.vector[1]

		if (turned.circleCounter >= 2*Math.PI)
		{
			turned.circleCounter = 0
		}

		for (var e = 0; e < ballArray.length; e++)
		{
			var ball2 = ballArray[e]

			if (ball2 != turned && ball2.expectedToCrash == true)
			{
				if (turned.testCollision(ball2) == true)
				{
					turned.handleCollision(ball2, true)
				}
			}
		}

		/*for (var f = 0; f < turnedArray.length; f++)
		{
			var ballf = turnedArray[f]
			if (ballf != turned)
			{
				if (turned.testCollision(ballf) == true)
				{
					turned.handleCollision(ballf, false)
				}
			}	
		}*/

		turned.draw()
	});
}

function updateBlast()
{
	aoeArray.forEach(function(blast)
	{
		blast.updateBlast(blast);
	});
}

function drawBlast()
{
	aoeArray.forEach(function(blast)
	{
		blast.drawBlast();
	});
}

function updateBall(modifier)
{
	ballArray.forEach(function(ball)
    {  
        ball.updateBall(ball, modifier);
	});
}

function drawBall()
{
	ballArray.forEach(function(ball)
    {  
        ball.draw();
	});
}

function drawWaste()
{
	wasteArray.forEach(function(wasteBall)
	{
		//wasteBall.flightCounter += wasteBall.flightCounterSpeed*0.01;
		/*wasteBall.x = wasteBall.startX + wasteBall.vector[0] * wasteBall.flightCounter;
		wasteBall.y = wasteBall.startY - wasteBall.vector[1] * wasteBall.flightCounter;*/

		wasteBall.x += wasteBall.vector[0]
		wasteBall.y += wasteBall.vector[1]

		if (wasteBall.testCollision(center) == true)
		{
			wasteBall.handleCenterCollision()
		}

		wasteBall.draw()
			//BUUGED AS HELL.
			/*for (var po =0; po<ballArray.length;po++)
			{
				if (ball.testCollision(ballArray[po]) == true)
				{
					ball.handleCollision(ballArray[po])
				}
			}*/
		
		//console.trace(wasteBall.x,wasteBall.y)
	});
}

function updateLasers(modifier)
{
	laserArray.forEach(function(laser)
	{	
		laser.updateLaser(modifier);
	});
}

function drawLasers()
{
	laserArray.forEach(function(laser)
	{	
		laser.drawLaser();
	});
}

function updateShots(modifier)
{
	shotArray.forEach(function(shot)
	{

		shot.updateShot(modifier);
	});
}

function drawShots()
{
	shotArray.forEach(function(shot)
	{
		shot.drawShot();
	});
}

function updateFighters(modifier)
{
	fighterArray.forEach(function(fighter)
	{
		fighter.updateFighter(fighter, modifier);
	});
}

function drawFighters()
{
	fighterArray.forEach(function(fighter)
	{	
		fighter.drawFighter()
	});
}

function screenColorChanger()
{
	d+=1
	if (increasing == "a")
	{
		a+= 1
		b-=1
		if (a == 255)
		{
			increasing = "b"
		}
	}
	else if (increasing == "b")
	{
		b+= 1
		c-=1
		if (b == 255)
		{
			increasing = "c"
		}
	}
	else
	{
		c+= 1
		a-=1
		if (c == 255)
		{
			increasing = "a"
		}
	}
}