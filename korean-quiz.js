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

var tilesContents =
[numeral,chinese,sinoKorean,sinoKoreanRomaja,korean,koreanRomaja];

var numberOfGameTiles = 6;
var numberOfAnswerTiles = 4;

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
	rollDice = getRollDice();
	setContents(rollDice);
	var correctAnswer = getRandomInt(1,numberOfAnswerTiles);
	var alreadyRolled = [rollDice];
	for (var i = 1; i <= numberOfAnswerTiles; i++) 
	{
		if(i === correctAnswer) { setAnswer(i,0,rollDice); }
		else
		{
			var newRoll = getRollDice();
			while(alreadyRolled.indexOf(newRoll) != -1) { newRoll = getRollDice(); }
			setAnswer(i,0,newRoll);
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

function setAnswer(answerTile,tileType,i)
{
	var theAnswerTile = document.getElementById(answerTileId(answerTile));
	theAnswerTile.innerHTML = tilesContents[tileType][i];
}

function hover()
{
	this.className='game-div hover-style';
}

function exitAndToggle()
{
	this.className='game-div';
	//todo if i just call toggle() function i lose the 'this' qualifier and this becomes the gloabl object. why?
	if(this.getElementsByTagName("p")[0].style.color == 'beige') {
		this.getElementsByTagName("p")[0].style.color = 'black';
		this.style.borderColor = 'black';
	}
	else {
		this.getElementsByTagName("p")[0].style.color = 'beige';
		this.style.borderColor = 'beige';
	}
}

function toggle()
{
	if(this.getElementsByTagName("p")[0].style.color == 'beige') {
		this.getElementsByTagName("p")[0].style.color = 'black';
		this.style.borderColor = 'black';
	}
	else {
		this.getElementsByTagName("p")[0].style.color = 'beige';
		this.style.borderColor = 'beige';
	}
}

function validate()
{
	if(this.getElementsByTagName("p")[0].innerHTML == numeral[rollDice]) {
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

function init()
{
	//test for touch events support
	var touchScreen = ("ontouchstart" in document.documentElement);
	var gameTilesElements = document.getElementsByClassName("game-div");
	var answerTilesElements = document.getElementsByClassName("answer-div");
	if (touchScreen) 
	{
		//add all the "touch" events
		for (var i = 0; i < gameTilesElements.length; i++) 
		{

			gameTilesElements[i].ontouchstart = hover;
			gameTilesElements[i].ontouchenter = hover;
			gameTilesElements[i].ontouchend = exitAndToggle;
			gameTilesElements[i].ontouchleave = exitAndToggle;
			gameTilesElements[i].ontouchcancel = exitAndToggle;
		}
		for (var i = 0; i < answerTilesElements.length; i++) 
		{
			answerTilesElements[i].ontouchstart = validate;
			answerTilesElements[i].ontouchenter = validate;
			answerTilesElements[i].ontouchend = reroll;
			answerTilesElements[i].ontouchleave = reroll;
			answerTilesElements[i].ontouchcancel = reroll;
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
	}

	//first roll
	roll();
}

