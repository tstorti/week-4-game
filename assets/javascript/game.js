//array of charaters.  note that additional characters can be added flexibly to code
var characterArray = [
{
	name: "Luke",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 100,
	attackPower:10,
	counterAttack: 10,
},
{
	name: "ObiWan",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 50,
	attackPower: 5,
	counterAttack: 20,
},
{
	name: "Vader",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 200,
	attackPower: 12,
	counterAttack: 10,
},
{
	name: "Chewbacca",
	imageLink: "https://avatars3.githubusercontent.com/u/4028472?v=3&s=400",
	healthPoints: 175,
	attackPower: 5,
	counterAttack: 5,
}
];

//gameStage 0 means player character needs selected
//gameStage 1 for selecting opponent character
//gameStage 2 for battle
//gameStage 3 for victory/loss
var gameStage=0;
var playerCharacter=null;
var opponentCharacter=null;
var gameHealthPlayer=null;
var gameHealthOpponent=null;
var defeatedCharCount=0;
var gameAttackPower=0;

//initialize game with all of the available characters
initializeGame();


$(".charButton").on("click",function(){

	//if player Character has not been selected yet
	if (gameStage===0){
		//set playerCharacter to user selection
		playerCharacter = characterArray[($(this).attr("data-character"))];
		//set adjustable game stats for playerCharacter
		gameAttackPower=playerCharacter.attackPower;
		gameHealthPlayer=playerCharacter.healthPoints;
		//display playerCharacter and health
		playerTile(playerCharacter,$("#playerChar"));
		$("#playerChar").addClass("center-text");
		$("#playerChar").append($("<div id='playerHealth'>"));
		showHealth();
		//move gameStage forward to select an opponent
		$("#gameMessage").text("Select an Opponent");
		gameStage++;
		//disable player character to prevent further selections
		$(this).attr("style","opacity:0.1");
		$(this).attr('disabled','disabled');

		
	}
	//if new opponent character needs to be selected
	else if(gameStage===1){
		//set new opponent
		opponentCharacter= characterArray[($(this).attr("data-character"))];
		//clear any previous opponent data from display
		$("#opponentChar").html("");
		//set adjustable game stats for opponentCharacter
		gameHealthOpponent=opponentCharacter.healthPoints;
		//display opponent tile and health
		playerTile(opponentCharacter,$("#opponentChar"));
		$("#opponentChar").addClass("center-text");
		$("#opponentChar").append($("<div id='opponentHealth'>"));
		showHealth();
		//initialize attack details message
		$("#attackDetails").html("");
		//move gameStage forward to battle stage
		gameStage++;
		//disable opponent character to prevent further selections
		$(this).attr("style","opacity:0.1");
		$(this).attr('disabled','disabled');
		//change styling on remainging character selections
		//$(".charButton").addClass("btn-danger");
		$("#gameMessage").text("Remaining Opponents");
	}


});

//when in battle stage, update adjustable game stats and check results
$("#attackBtn").on("click",function(){
	
	if(gameStage===2){
		//initialize attack details message
		$("#attackDetails").html("");
		//take off health of player based on counter attack
		gameHealthPlayer -= opponentCharacter.counterAttack;
		$("#attackDetails").append("<div>"+ playerCharacter.name + " did "+ gameAttackPower + " damage </div>");
		//take off opponent health based on current attack power
		gameHealthOpponent -= gameAttackPower;
		$("#attackDetails").append("<div>"+ opponentCharacter.name + " did "+ opponentCharacter.counterAttack + " damage</div>");
		//display new health counts
		showHealth();
		//see if opponent or player has been defeated
		checkResult();
		//increase player attack power
		gameAttackPower+=playerCharacter.attackPower;
	}

});

function checkResult(){
	//if player health 0 or below, player loses
	if(gameHealthPlayer<=0){
		gameStage=3;
		$("#gameMessage").text("You Lose!");
	}
	//if opponent health 0 or below, check to see if winner or new opponent needed
	//else if because if both player and opponent below 0 this is a double-kill and player still loses
	else if(gameHealthOpponent<=0){
		defeatedCharCount++;
		//if player has defeated all characters, they win
		if(defeatedCharCount===(characterArray.length-1)){
			$("#gameMessage").text("You Win");
			gameStage=3;
		}
		//if player has not defeated all characters, they need new opponent
		else{
			$("#attackDetails").html("Opponent Defeated, choose a new opponent");
			gameStage=1;
		}
	}
}

//generates a tile to be displayed in various sections
function playerTile(character,target){
	var tile=$("<div>");
	var charImage =$("<img>");
	var charName =$("<div>");
    charImage.addClass("charImage center-block");
    charImage.attr("src",character.imageLink);
	charName.addClass("center-text");
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

//displays all characters as selection options in the character array along with key stats
function initializeGame(){
	for (var i=0;i<characterArray.length;i++){
		var charButton = $("<button>");
		charButton.addClass("charButton btn-primary");
		playerTile(characterArray[i],charButton);
	    var charDiv =$("<div class='col-md-3'>");
	    charButton.attr("data-character", i);
	    charDiv.append("<div>Health: " + characterArray[i].healthPoints+"</div");
	    charDiv.append("<div>Attack: " + characterArray[i].attackPower+"</div");
	    charDiv.append("<div>Counter: " + characterArray[i].counterAttack+"</div");
		charButton.append(charDiv);
		$("#characterSelection").append(charButton);
	}
}