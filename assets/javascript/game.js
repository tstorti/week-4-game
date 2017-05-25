$(document).ready(function() {
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
				attackPower: 25,
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
				attackPower: 100,
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
		
		defeatedCharCount:0,			
		gameAttackPower:0,
		gameHealthPlayer:null,
		gameHealthOpponent:null,
		//gameStage 0 means player character needs selected
		//gameStage 1 for selecting opponent character
		//gameStage 2 for battle
		//gameStage 3 for victory/loss
		gameStage:0,
		opponentCharacter:null,
		playerCharacter:null,

		//this function updates all of the battle details when clicking the attack button
		attack: function(){
			if(this.gameStage===2){
				//initialize attack details message
				$("#attackDetails").html("");
				//take off health of player based on counter attack
				this.gameHealthPlayer -= this.opponentCharacter.counterAttack;
				$("#attackDetails").append("<div>"+ this.playerCharacter.name + " did "+ this.gameAttackPower + " damage </div>");
				//take off opponent health based on current attack power
				this.gameHealthOpponent -= this.gameAttackPower;
				$("#attackDetails").append("<div>"+ this.opponentCharacter.name + " did "+ this.opponentCharacter.counterAttack + " damage</div>");
				//display new health counts
				this.showHealth();
				//see if opponent or player has been defeated
				this.checkResult();
				//increase player attack power
				this.gameAttackPower+=this.playerCharacter.attackPower;
			}
			//warning message if user has not selected opponent
			else if(game.gameStage===1){
				$("#attackDetails").html("You must select an opponent");
			}
			//warning message if user has not selected player character
			else if(game.gameStage===0){
				$("#attackDetails").html("You must select a player character");
			}
			else{
				$("#attackDetails").html("The game is over, click Reset to play again.");
			}
		},

		//this function checks the result of the game after each attack.
		checkResult:function(){
			//if player health 0 or below, player loses
			if(this.gameHealthPlayer<=0){
				//if double-kill and no more opponent remain
				if((this.gameHealthOpponent<=0 )&& (this.defeatedCharCount+1)===(this.characterArray.length-1)){
					this.gameStage=3;
					$("#gameMessage").text("You Lose!");
					$("#attackDetails").html("Everyone is dead");
					//show reset button to allow for the game to be restarted.
					$("#reset").addClass("visible");
				}
				//if player dies and there are remaining opponents
				else{
					this.gameStage=3;
					$("#gameMessage").text("You Lose!");
					$("#attackDetails").html("You lost the battle");
					//show reset button to allow for the game to be restarted.
					$("#reset").addClass("visible");
				}
			}
			//if opponent health 0 or below, check to see if winner or new opponent needed
			else if(this.gameHealthOpponent<=0){
				this.defeatedCharCount++;
				//if player has defeated all characters, they win
				if(this.defeatedCharCount===(this.characterArray.length-1)){
					this.gameStage=3;
					$("#gameMessage").text("You Win");
					$("#attackDetails").html("You won the game");
					//show reset button to allow for the game to be restarted.
					$("#reset").addClass("visible");
				}
				//if player has not defeated all characters, they need new opponent
				else{
					$("#attackDetails").html("Opponent defeated, choose a new opponent");
					this.gameStage=1;
				}
			}
		},

		//this function disables and hides the characters who have already been chosen
		disableCharacter:function(selection){
			$(selection).attr("style","opacity:0.1");
			$(selection).attr('disabled','disabled');
		},

		//displays all characters as selection options in the character array along with key stats
		initializeGame:function(){
			for (var i=0;i<this.characterArray.length;i++){
				var charButton = $("<button>");
				charButton.addClass("charButton");
				//playerTile function grabs all of the essential character and image link details 
				this.playerTile(this.characterArray[i],charButton);
			    var charDiv =$("<div>");
			    charButton.attr("data-character", i);
			    charDiv.append("<div>Health: " + this.characterArray[i].healthPoints+"</div");
			    charDiv.append("<div>Attack: " + this.characterArray[i].attackPower+"</div");
			    charDiv.append("<div>Counter Attack: " + this.characterArray[i].counterAttack+"</div");
				charButton.append(charDiv);
				$("#characterSelection").append(charButton);
			}
		},
		
		//this function sets game variables and battle panel display with selected opponent character
		initializeOpponent:function(selection){
			//set new opponent
			game.opponentCharacter= game.characterArray[$(selection).attr("data-character")];
			//clear any previous opponent data from display
			$("#opponentChar").html("");
			//set adjustable game stats for opponentCharacter
			this.gameHealthOpponent=this.opponentCharacter.healthPoints;
			//initialize attack details message
			$("#attackDetails").html("");
			//display opponent tile and health
			this.playerTile(this.opponentCharacter,$("#opponentChar"));
			$("#opponentChar").addClass("center-text");
			$("#opponentChar").append($("<div class='openFont' id='opponentHealth'>"));
			this.showHealth();
			//move gameStage forward to battle stage
			$("#gameMessage").text("Remaining Opponents:");
			this.gameStage++;
			//disable opponent character to prevent further selections
			this.disableCharacter(selection);	
		},
		
		//this function sets game variables and battle panel display with selected player character
		initializePlayer: function(selection){
			//set playerCharacter to user selection
			game.playerCharacter = game.characterArray[$(selection).attr("data-character")];
			//set adjustable game stats for playerCharacter
			this.gameAttackPower=this.playerCharacter.attackPower;
			this.gameHealthPlayer=this.playerCharacter.healthPoints;
			//initialize details in case of previous warning messages
			$("#attackDetails").html("");
			//display playerCharacter and health
			this.playerTile(this.playerCharacter,$("#playerChar"));
			$("#playerChar").addClass("center-text");
			$("#playerChar").append($("<div class='openFont' id='playerHealth'>"));
			this.showHealth();
			//move gameStage forward to select an opponent
			$("#gameMessage").text("Select an Opponent:");
			this.gameStage++;
			//disable player character to prevent further selections
			this.disableCharacter(selection);
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
		
	};

	//initialize game with all of the available characters
	game.initializeGame();

	$(".charButton").on("click",function(){
		//if player Character has not been selected yet
		if (game.gameStage===0){	
			game.initializePlayer(this);	
		}
		//if new opponent character needs to be selected
		else if(game.gameStage===1){
			game.initializeOpponent(this);
		}
		//if in game stage 2 or 3 buttons will have no effect.
	});

	//when in battle stage, update adjustable game stats and check results
	$("#attackBtn").on("click",function(){
		game.attack();
	});
	
	//when reset button is clicked, reload page to restart the game
	$("#reset").on("click",function(){
		location.reload();
	});

});