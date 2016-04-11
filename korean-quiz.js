var numeral =
["0","1","2","3","4","5","6","7","8","9","10"];

var chinese = 
["","一","二","三","四","五","六","七","八","九","十"];

var sinoKorean = 
["","일","이","삼","사","오","육","칠","팔","구","십"];

var sinoKoreanRomaja = 
["","il","i","sam","sa","o","yuk","chil","pal","gu","sip"];

var korean = 
["","하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉","열"];

var koreanRomaja = 
["","hana","dul","set","net","daseot","yeoseot","ilgop","yeodeol","ahop","yeol"];

var koreanDecimals = 
["","열","스물","서른","마흔","쉰","예순","일흔","여든","아흔","온"];

var koreanDecimalsRomaja = 
["","yol","seumul","soreun","maheun","swin","yesun","ilheun","yeodeun","aheun","on"];

var koreanHours = 
["","한","두","셋","넷","다섯","여섯","일곱","여덟","아홉","열","열한","열두"];

var tilesContents =
[numeral,sinoKorean,korean,sinoKoreanRomaja,koreanRomaja,chinese,koreanHours];

var gameTiles =
["numeral","sinoKorean","korean","sinoKoreanRomaja","koreanRomaja","chinese"];

var contentTypes =
["Numeral","Sino-Korean","Korean","Sino-Korean (romaja)","Korean (romaja)","Chinese"];

ct = 
{ numeral : 0, sinoKorean : 1, korean : 2, sinoKoreanRomaja : 3, koreanRomaja : 4, chinese : 5, koreanHours : 6 }

var playModes =
["Beginner","Casual","Advanced","Bonus (say the time)"];

pm = 
{ beginner : 0, casual : 1, advanced : 2, sayTheTime : 3 }

var minDice = 1;
var maxDice = 10;
var rollDice = 0;

var hoursDice = 0;
var minutesDice = 0;

var numberOfContentTypes = 6;
var numberOfAnswerTiles = 4;
var numberOfPlayModes = 4;
var numberOfHours = 12;
var numberOfMinutes = 60;

var answerType = 0;
var playMode = 0;

var useRomaja = true;

var originalGameBoard = "";
var reducedGameBoard = "<div class=\"game-div\" id=\"numeral-div\"><p id=\"the-numeral\"></p></div><div class=\"game-div\" id=\"sinoKorean-div\"><p id=\"the-sinoKorean\"></p></div><div class=\"game-div\" id=\"korean-div\"><p id=\"the-korean\"></p></div>";
var sayTheTimeGameBoard = "<div class=\"game-div enlarged\" id=\"numeral-div\"><p id=\"the-numeral\"></p></div><div class=\"game-div enlarged\" id=\"korean-div\"><p id=\"the-korean\"></p></div>";

var gameBoards = 
[originalGameBoard, reducedGameBoard, reducedGameBoard, sayTheTimeGameBoard];

var score = 0;

function getRandomInt(min,max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRollDice()
{
	if (playMode == pm.sayTheTime) 
	{
		return getRandomInt(1,12) * 100 + getRandomInt(1,59);
	}
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
	var tileDivs = document.getElementsByClassName("game-div");
	for (var tile = 0; tile < tileDivs.length; tile++) 
	{
		var theTile = tileDivs[tile].getElementsByTagName("p")[0];
		setContent(theTile,i);
	}
}

function getTileContentType(tileId)
{
	var tileTypeStr = tileId.split('-')[1];
	return gameTiles.indexOf(tileTypeStr);
}

function setContent(theTile,i)
{
	var tileType = getTileContentType(theTile.id);
	theTile.innerHTML = getContent(tileType,i);
}

function getContent(contentType,value)
{
	var retString = "";
	if(!useRomaja && (contentType == ct.sinoKoreanRomaja || contentType == ct.koreanRomaja))
	{
		//just return nothing if romaja disabled
		return "&nbsp;";
	}
	if(playMode == pm.sayTheTime && value >= 100)
	{
		if (contentType == ct.sinoKorean || contentType == ct.chinese) { return "&nbsp;"; }
		var hours = Math.floor(value/100);
		var minutes = value % 100;
		if (contentType == ct.korean) 
		{
			return getContent(ct.koreanHours,hours) + "시" + getContent(ct.sinoKorean,minutes) + "분";
		}
		else
		{
			return hours + "h" + getContent(ct.numeral,minutes);
		}
	}
	if(contentType == ct.koreanHours) //korean hours
	{
		return tilesContents[contentType][value];
	}
	var value10 = Math.floor(value/10);
	if(contentType == ct.numeral && (value10 >=1 || playMode == pm.sayTheTime)) //numeral
	{
		retString += tilesContents[contentType][value10];
	}
	else if((contentType == ct.sinoKorean || contentType == ct.sinoKoreanRomaja || contentType == ct.chinese) && value10 >=1)
	{
		retString += (value10 > 1 ? tilesContents[contentType][value10] : "") + tilesContents[contentType][10];
	}
	else if(contentType == ct.korean)
	{
		retString += koreanDecimals[value10];
	}
	else if(contentType == ct.koreanRomaja)
	{
		retString += koreanDecimalsRomaja[value10];
	}
	retString += tilesContents[contentType][value % 10];
	return retString;
}

function answerTileId(answerTile)
{
	return "the-answer-" + answerTile.toString();
}

function setAnswer(answerTile,i)
{
	var theAnswerTile = document.getElementById(answerTileId(answerTile));
	theAnswerTile.innerHTML = getContent(answerType,i);
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
	if(object.getElementsByTagName("p")[0].style.color == 'beige') 
	{
		object.getElementsByTagName("p")[0].style.color = 'black';
		object.style.borderColor = 'black';
	}
	else 
	{
		object.getElementsByTagName("p")[0].style.color = 'beige';
		object.style.borderColor = 'beige';
	}	
}
function validate()
{
	if(this.getElementsByTagName("p")[0].innerHTML == getContent(answerType,rollDice)) {
		score=score+1;
		this.style.backgroundColor='LimeGreen';
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
	//reset the score
	score = 0;
	var controlType = object.id;
	if (controlType == "answer-control") 
	{
		//toggle answer control
		answerType += 1;
		if(answerType >= numberOfContentTypes) { answerType = 0; }
	}
	else if (controlType == "level-control") 
	{
		//toggle level control
		playMode += 1;
		if(playMode >= numberOfPlayModes) { playMode = 0; }
		updatePlayMode();
	}
	if(!useRomaja && answerType == 3 || answerType == 4) { answerType = 5; }
	if(playMode == pm.sayTheTime && answerType == 1) { answerType = 2; }
	if(playMode == pm.sayTheTime && answerType > 2) { answerType = 0; }
	updateScore();
	updateAnswerTilesStyle();
	//reroll
	roll();
}

function updateAnswerTilesStyle()
{
	document.getElementById("current-answer-control").innerHTML = contentTypes[answerType] + ": " + getContent(answerType,1);
}

function updatePlayMode()
{
	if(document.getElementById("the-game").innerHTML != gameBoards[playMode])
	{
		document.getElementById("the-game").innerHTML = gameBoards[playMode];
		init();
	}
	if(playMode == pm.beginner)
	{
		minDice = 1;
		maxDice = 10;
	}
	else if(playMode == pm.casual)
	{
		minDice = 1;
		maxDice = 30;
	}
	else if(playMode == pm.advanced)
	{
		minDice = 1;
		maxDice = 99;
	}
	else if(playMode == pm.sayTheTime)
	{
		//bonus mode (say the time)
	}
	//enable the romaja tiles
	useRomaja = (playMode == pm.beginner);


	document.getElementById("current-level-control").innerHTML = playModes[playMode];
	if(playMode != pm.sayTheTime)
	{ 
		document.getElementById("current-level-control").innerHTML += " (" + minDice + "-" + maxDice + ")";
	}
}

function init()
{
	if (originalGameBoard == "")  { originalGameBoard = document.getElementById("the-game").innerHTML; }
	if (gameBoards[0] == "")  { gameBoards[0] = originalGameBoard; }

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
	updatePlayMode();
	//first roll
	roll();
}

