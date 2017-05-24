var game = {
	//array of charaters.  note that additional characters can be added flexibly to code
	characterArray : [
		{
			name: "Luke",
			imageLink: "assets/images/luke.jpg",
			healthPoints: 150,
			attackPower:18,
			counterAttack: 6,
		},
		{
			name: "ObiWan",
			imageLink: "assets/images/obiwan.jpg",
			healthPoints: 120,
			attackPower: 25,
			counterAttack: 20,
		},
		{
			name: "Vader",
			imageLink: "assets/images/vader.jpg",
			healthPoints: 300,
			attackPower: 30,
			counterAttack: 25,
		},
		{
			name: "Han-Solo",
			imageLink: "assets/images/hansolo.jpg",
			healthPoints: 150,
			attackPower: 15,
			counterAttack: 5,
		},
		{
			name: "Yoda",
			imageLink: "assets/images/yoda.jpg",
			healthPoints: 75,
			attackPower: 150,
			counterAttack: 35,
		},
		{
			name: "Chewbacca",
			imageLink: "assets/images/chewbacca.jpg",
			healthPoints: 275,
			attackPower: 12,
			counterAttack: 5,
		}
	],

	//gameStage 0 means player character needs selected
	//gameStage 1 for selecting opponent character
	//gameStage 2 for battle
	//gameStage 3 for victory/loss
	gameStage:0,
	playerCharacter:null,
	opponentCharacter:null,
	gameHealthPlayer:null,
	gameHealthOpponent:null,
	defeatedCharCount:0,
	gameAttackPower:0,



	checkResult:function(){
		//if player health 0 or below, player loses
		if(this.gameHealthPlayer<=0){
			//if double-kill and no more opponent remain
			if((this.gameHealthOpponent<=0 )&& (this.defeatedCharCount+1)===(this.characterArray.length-1)){
				this.gameStage=3;
				$("#gameMessage").text("You Lose!");
				$("#attackDetails").html("Everyone is dead");
			}
			//if player dies and there are remaining opponents
			else{
				this.gameStage=3;
				$("#gameMessage").text("You Lose!");
				$("#attackDetails").html("You lost the battle");
			}
		}
		//if opponent health 0 or below, check to see if winner or new opponent needed
		else if(this.gameHealthOpponent<=0){
			this.defeatedCharCount++;
			//if player has defeated all characters, they win
			if(this.defeatedCharCount===(this.characterArray.length-1)){
				$("#gameMessage").text("You Win");
				$("#attackDetails").html("You won the game");
				this.gameStage=3;
			}
			//if player has not defeated all characters, they need new opponent
			else{
				$("#attackDetails").html("Opponent defeated, choose a new opponent");
				this.gameStage=1;
			}
		}
	},

	//generates a tile to be displayed in various sections
	playerTile:function(character,target){
		var tile=$("<div>");
		var charImage =$("<img>");
		var charName =$("<div>");
	    charImage.addClass("charImage center-block");
	    charImage.attr("src",character.imageLink);
		charName.addClass("charName russoFont center-text");
		charName.text(character.name);
		tile.append(charImage);
		tile.append(charName);
		target.append(tile);
	},

	//updates player and opponent character health based on attacks
	showHealth:function(){
			$("#playerHealth").text("Health Points: "+ this.gameHealthPlayer);
			$("#opponentHealth").text("Health Points: "+ this.gameHealthOpponent);		
	},

	//displays all characters as selection options in the character array along with key stats
	initializeGame:function(){
		for (var i=0;i<this.characterArray.length;i++){
			var charButton = $("<button>");
			charButton.addClass("charButton");
			this.playerTile(this.characterArray[i],charButton);
		    var charDiv =$("<div>");
		    charButton.attr("data-character", i);
		    charDiv.append("<div>Health: " + this.characterArray[i].healthPoints+"</div");
		    charDiv.append("<div>Attack: " + this.characterArray[i].attackPower+"</div");
		    charDiv.append("<div>Counter: " + this.characterArray[i].counterAttack+"</div");
			charButton.append(charDiv);
			$("#characterSelection").append(charButton);
		}
	},
};

//initialize game with all of the available characters
game.initializeGame();


$(".charButton").on("click",function(){

	//if player Character has not been selected yet
	if (game.gameStage===0){
		//set playerCharacter to user selection
		game.playerCharacter = game.characterArray[($(this).attr("data-character"))];
		//set adjustable game stats for playerCharacter
		game.gameAttackPower=game.playerCharacter.attackPower;
		game.gameHealthPlayer=game.playerCharacter.healthPoints;
		//initialize details in case of previous warning messages
		$("#attackDetails").html("");
		//display playerCharacter and health
		game.playerTile(game.playerCharacter,$("#playerChar"));
		$("#playerChar").addClass("center-text");
		$("#playerChar").append($("<div class='openFont' id='playerHealth'>"));
		game.showHealth();
		//move gameStage forward to select an opponent
		$("#gameMessage").text("Select an Opponent:");
		game.gameStage++;
		//disable player character to prevent further selections
		$(this).attr("style","opacity:0.1");
		$(this).attr('disabled','disabled');

		
	}
	//if new opponent character needs to be selected
	else if(game.gameStage===1){
		//set new opponent
		game.opponentCharacter= game.characterArray[($(this).attr("data-character"))];
		//clear any previous opponent data from display
		$("#opponentChar").html("");
		//set adjustable game stats for opponentCharacter
		game.gameHealthOpponent=game.opponentCharacter.healthPoints;
		//display opponent tile and health
		game.playerTile(game.opponentCharacter,$("#opponentChar"));
		$("#opponentChar").addClass("center-text");
		$("#opponentChar").append($("<div class='openFont' id='opponentHealth'>"));
		game.showHealth();
		//initialize attack details message
		$("#attackDetails").html("");
		//move gameStage forward to battle stage
		game.gameStage++;
		//disable opponent character to prevent further selections
		$(this).attr("style","opacity:0.1");
		$(this).attr('disabled','disabled');
		//change styling on remainging character selections
		//$(".charButton").addClass("btn-danger");
		$("#gameMessage").text("Remaining Opponents:");
	}


});

//when in battle stage, update adjustable game stats and check results
$("#attackBtn").on("click",function(){
	
	if(game.gameStage===2){
		//initialize attack details message
		$("#attackDetails").html("");
		//take off health of player based on counter attack
		game.gameHealthPlayer -= game.opponentCharacter.counterAttack;
		$("#attackDetails").append("<div>"+ game.playerCharacter.name + " did "+ game.gameAttackPower + " damage </div>");
		//take off opponent health based on current attack power
		game.gameHealthOpponent -= game.gameAttackPower;
		$("#attackDetails").append("<div>"+ game.opponentCharacter.name + " did "+ game.opponentCharacter.counterAttack + " damage</div>");
		//display new health counts
		game.showHealth();
		//see if opponent or player has been defeated
		game.checkResult();
		//increase player attack power
		game.gameAttackPower+=game.playerCharacter.attackPower;
	}
	//warning message if user has not selected opponent
	else if(game.gameStage===1){
		$("#attackDetails").html("You must select an opponent");
	}
	//warning message if user has not selected player character
	else if(game.gameStage===0){
		$("#attackDetails").html("You must select a player character");
	}

});