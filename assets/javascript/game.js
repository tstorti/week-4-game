
var character1 = {
	name: "Luke",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 100,
	attackPower: 25,
	counterAttack: 10,
}
var character2 = {
	name: "ObiWan",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 50,
	attackPower: 30,
	counterAttack: 20,
}
var character3 = {
	name: "Vader",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 200,
	attackPower: 50,
	counterAttack: 10,
}
var characterArray = [character1, character2, character3];
var gameStage=0;
var playerCharacter=null;
var opponentCharacter=null;
var gameHealthPlayer=null;
var gameHealthOpponent=null;

//initialize game with all of the available characters
initializeGame();


$(".charButton").on("click",function(){

	//if player Character has not been selected yet
	if (gameStage===0){
		playerCharacter = characterArray[($(this).attr("data-character"))];
		playerTile(playerCharacter,$("#playerChar"));
		gameHealthPlayer=playerCharacter.healthPoints;
		$("#playerChar").append($("<div id='playerHealth'>").text("Health Points: "+ gameHealthPlayer));
		showHealth();
		gameStage++;
	}
	else if(gameStage===1){
		//if opponent character has not been selected yet
		opponentCharacter= characterArray[($(this).attr("data-character"))];
		playerTile(opponentCharacter,$("#opponentChar"));
		gameHealthOpponent=opponentCharacter.healthPoints;
		$("#opponentChar").append($("<div id='opponentHealth'>").text("Health Points: "+ gameHealthOpponent));
		gameStage++;
	}

});
$("#attackBtn").on("click",function(){
	if(gameStage===2){
		gameHealthPlayer -= opponentCharacter.counterAttack;
		gameHealthOpponent -= playerCharacter.attackPower;
		showHealth();
	}

});

//generates a tile to be displayed in various sections
function playerTile(character,target){
	var tile=$("<div>");
	var charImage =$("<img>")
	var charName =$("<div>");
    charImage.addClass("charImage");
    charImage.attr("src",character.imageLink);
	charName.text(character.name);
	tile.append(charImage);
	tile.append(charName);
	target.append(tile);
}

//updates player and opponent character health based on attacks
function showHealth(){
		$("#playerHealth").text("Health Points: "+ gameHealthPlayer);
		$("#opponentHealth").text("Health Points: "+ gameHealthOpponent);		
}

//displays all characters in the character array along with key stats
function initializeGame(){
	for (var i=0;i<characterArray.length;i++){
		var charButton = $("<button>");
		charButton.attr("data-character", i);
		charButton.addClass("charButton");
		playerTile(characterArray[i],charButton);
	    var charDiv =$("<div class='col-md-2'>");
	    charDiv.append(charButton);
	    charDiv.append("<div>Health: " + characterArray[i].healthPoints+"</div");
	    charDiv.append("<div>Attack: " + characterArray[i].attackPower+"</div");
	    charDiv.append("<div>Counter: " + characterArray[i].counterAttack+"</div");
		$("#characterSelection").append(charDiv);
	}
}