var numeral =
["1","2","3","4","5","6","7","8","9","10"];

var chinese = 
["一","二","三","四","五","六","七","八","九","十"];

var sinoKorean = 
["일","이","삼","사","오","육","칠","팔","구","십"];

var sinoKoreanRomaja = 
["il","i","sam","sa","o","yuk","chil","pal","gu","sip"];

var korean = 
["하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉","열"];

var koreanRomaja = 
["hana","dul","set","net","daseot","yeoseot","ilgop","yeodeol","ahop","yeol"];

var minDice = 0;
var maxDice = 9	;
var rollDice = 0;

var gameTiles =
["numeral","chinese","sinoKorean","sinoKoreanRomaja","korean","koreanRomaja"];

var contentTypes =
["Numeral","Chinese","Sino-Korean","Sino-Korean (romaja)","Korean","Korean (romaja)"];

var tilesContents =
[numeral,chinese,sinoKorean,sinoKoreanRomaja,korean,koreanRomaja];

var numberOfContentTypes = 6;
var numberOfGameTiles = numberOfContentTypes;
var numberOfAnswerTiles = 4;

var answerType = 0;

var score = 0;

function getRandomInt(min,max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRollDice()
{
	return getRandomInt(minDice,maxDice);
}

function roll() 
{
	var newRollDice = getRollDice();
	//make sure the new roll dice is always different from the old one
	while(newRollDice == rollDice) { newRollDice = getRollDice(); }
	rollDice = newRollDice;
	setContents(rollDice);
	var correctAnswer = getRandomInt(1,numberOfAnswerTiles);
	var alreadyRolled = [rollDice];
	for (var i = 1; i <= numberOfAnswerTiles; i++) 
	{
		if(i === correctAnswer) { setAnswer(i,rollDice); }
		else
		{
			var newRoll = getRollDice();
			//make sure all answers differ from one another
			while(alreadyRolled.indexOf(newRoll) != -1) { newRoll = getRollDice(); }
			setAnswer(i,newRoll);
			alreadyRolled.push(newRoll);
		}
	}
}

function setContents(i)
{
	for(var tile = 0; tile < numberOfGameTiles; tile+=1)
	{
		setContent(tile,i);
	}
}

function contentTileId(contentTile)
{
	return "the-" + gameTiles[contentTile];
}

function setContent(tile,i)
{
	var theTile = document.getElementById(contentTileId(tile));
	theTile.innerHTML = tilesContents[tile][i];
}

function answerTileId(answerTile)
{
	return "the-answer-" + answerTile.toString();
}

function setAnswer(answerTile,i)
{
	var theAnswerTile = document.getElementById(answerTileId(answerTile));
	theAnswerTile.innerHTML = tilesContents[answerType][i];
}

function hover()
{
	this.className+=' hover-style';
}

function exitHoverAndToggle()
{
	exitHover(this);
	doToggle(this);
}

function toggle()
{
	doToggle(this);
}

function exitHover(object)
{
	var classes = object.className.split(' ');
	classes = classes.slice(0,classes.length-1);
	object.className=classes.join(' ');
}

function doToggle(object)
{
	if(object.getElementsByTagName("p")[0].style.color == 'beige') {
		object.getElementsByTagName("p")[0].style.color = 'black';
		object.style.borderColor = 'black';
	}
	else {
		object.getElementsByTagName("p")[0].style.color = 'beige';
		object.style.borderColor = 'beige';
	}	
}
function validate()
{
	if(this.getElementsByTagName("p")[0].innerHTML == tilesContents[answerType][rollDice]) {
		score=score+1;
		this.style.backgroundColor='green';
	}
	else {
		// oh noes :(
		score=0;
		this.style.backgroundColor='red';
	}
	updateScore();
}

function updateScore()
{
	document.getElementById("the-score").innerHTML = "Score: " + score.toString();
}

function reroll()
{
	this.style.backgroundColor='';
	roll();
}

function exitHoverAndControl()
{
	exitHover(this);
	doControl(this);
}

function control()
{
	doControl(this);
}



function doControl(object)
{
	var controlType = object.id;
	if (controlType == "answer-control") 
	{
		//reset the score
		score = 0;
		//toggle answer control
		answerType += 1;
		if(answerType >= numberOfContentTypes) { answerType = 0; }
		updateAnswerTilesStyle();
		//reroll
		roll();
	}
}

function updateAnswerTilesStyle()
{
	document.getElementById("current-answer-control").innerHTML = contentTypes[answerType] + ": " + tilesContents[answerType][0];
}

function init()
{
	//test for touch events support
	var touchScreen = ("ontouchstart" in document.documentElement);
	var gameTilesElements = document.getElementsByClassName("game-div");
	var answerTilesElements = document.getElementsByClassName("answer-div");
	var controlElements = document.getElementsByClassName("control-div");
	if (touchScreen) 
	{
		//add all the "touch" events
		for (var i = 0; i < gameTilesElements.length; i++) 
		{

			gameTilesElements[i].ontouchstart = hover;
			gameTilesElements[i].ontouchenter = hover;
			gameTilesElements[i].ontouchend = exitHoverAndToggle;
			gameTilesElements[i].ontouchleave = exitHoverAndToggle;
			gameTilesElements[i].ontouchcancel = exitHoverAndToggle;
		}
		for (var i = 0; i < answerTilesElements.length; i++) 
		{
			answerTilesElements[i].ontouchstart = validate;
			answerTilesElements[i].ontouchenter = validate;
			answerTilesElements[i].ontouchend = reroll;
			answerTilesElements[i].ontouchleave = reroll;
			answerTilesElements[i].ontouchcancel = reroll;
		}
		for (var i = 0; i < controlElements.length; i++) 
		{
			controlElements[i].ontouchstart = hover;
			controlElements[i].ontouchenter = hover;
			controlElements[i].ontouchend = exitHoverAndControl;
			controlElements[i].ontouchleave = exitHoverAndControl;
			controlElements[i].ontouchcancel = exitHoverAndControl;
		}
	}
	else
	{
		//css class for no-touch screens
		document.documentElement.className += " notouch";
		//add all the "onClick" events
		for (var i = 0; i < gameTilesElements.length; i++) 
		{
			gameTilesElements[i].onclick = toggle;
		}
		for (var i = 0; i < answerTilesElements.length; i++) 
		{
			answerTilesElements[i].onmousedown = validate;
			answerTilesElements[i].onmouseup = reroll;
		}
		for (var i = 0; i < controlElements.length; i++) 
		{
			controlElements[i].onclick = control;
		}
	}

	updateScore();
	updateAnswerTilesStyle();
	//first roll
	roll();
}

