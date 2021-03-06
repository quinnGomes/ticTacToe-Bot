
const discord = require("discord.js")
const bot = new discord.Client()
const config = require("./config.json")
let user1name = ""
let user2name = ""

//make sure this is set properly 
let mode = "p2";



let board = ['0', '1', '2', '3', '4', '5', '6', '7', '8']
let defaultBoard = board;
let boardMsg = null


bot.on("ready", () => { console.log("bot is online") })

bot.on("message", (msg) => {
    console.log(msg.content);
    let msgArray = msg.content.split(" ");
    console.log(msgArray)

    //bot sends a message of "react to join" when the users enter the command [prefix]startGame
    if (msgArray[0] == (config.prefix + "startGame")) {

        if (msgArray[1] === "p1") {
            mode = "p1"
        }
        else if (msgArray[1] === "p2") {
            mode = "p2"
        }

        msg.channel.send("react with ✅ to join ").then((reactionMessage) => {

            const filter = (reaction, user) => {
                if (reaction.emoji.name == "✅") {
                    return true

                }
                else {
                    return false
                }
            }

            const collector = reactionMessage.createReactionCollector(filter, { time: 15000 })
            collector.on("collect", (reaction, user) => {
                console.log(`collected ${reaction.emoji.name} from ${user.tag}`)

                if (mode == "p2") {
                    if (user1name == "") {
                        user1name = user.tag;
                    }
                    else if (user2name == "") {
                        user2name = user.tag;
                        collector.stop()
                    }
                }
                else if (mode == "p1") {
                    //setu username1 jsut like we did in p2 mode but then close the collector
                    user1name = user.tag
                    collector.stop()
                }

            })

            collector.on("end", (collected) => {

                //in here you need to call a different fun

                console.log(`collected ${collected.size} items`)
                // this is where we would call a function to draw out the inital tic tac toe bored
                printBoard(msg.channel)

                //tell the board to start listening 
                playerTurn(msg.channel)

            })
        })

    }

})


//check winner should be given a specific player either "x" or "o", returns true or false if that player has winning row
//player is going to either be = "x" or = "o"

function checkWinner(player) {




    if (board[0] == board[1] && board[1] == board[2] && board[2] == player) {
        return true
    }
    if (board[3] == board[4] && board[4] == board[5] && board[5] == player) {
        return true
    }
    if (board[6] == board[7] && board[7] == board[8] && board[8] == player) {
        return true
    }

    //verticals
    if (board[0] == board[2] && board[2] == board[3] && board[3] == player) {
        return true
    }
    if (board[1] == board[4] && board[4] == board[7] && board[7] == player) {
        return true
    }

    if (board[2] == board[5] && board[5] == board[8] && board[8] == player) {
        return true
    }

    //diagonals
    if (board[0] == board[4] && board[4] == board[8] && board[8] == player) {
        return true
    }
    if (board[2] == board[4] && board[4] == board[6] && board[6] == player) {
        return true
    }

    return false


}



//TODO: make it so that this works for either player depending on who's turn we pass in 
//make it so calling playerturn is like playerTurn(channel,"x" or "o")

function playerTurn(channel) {

    const filter = (msg) => {
        //this makes it so player1 is the only user we accept messages from 
        //this is where you would need to change the filter depending on who's turn it is 
        //note : user2 and user1 are already set by code we wrote earlier
        
        return msg.author.tag == user1name;
 
    }

    const collector = channel.createMessageCollector(filter, { time: 30000 })

    collector.on("collect", (msg) => {
        let pInput = Number(msg.content);

        //editboard needs to edit either "x" or "o" depending on playerturn
        editBoard(pInput, "x");
        msg.delete(
        )
        collector.stop();
    })

    collector.on("end", (collected) => {
        console.log("collection ended")


        //checkwinner needs to check either "x" or "o" depending on the actual player
        if (checkWinner("x") == true) {
            endGame("x", channel)
        }
        else {
            playerTurn(channel)
        }

    })

}


function endGame(player, channel) {



    channel.send("player " + player + " won")

    user1name = ""
    user2name = ""
    boardMsg = null
    board = defaultBoard
}


function editBoard(index, player) {

    // console.log(board)
    board[index] = player[0]
    boardMsg.edit(makeBoardString())
}

function printBoard(channel) {

    let boardString = makeBoardString();


    //send the boardstring as one message 
    channel.send(boardString).then(
        (msg) => {
            boardMsg = msg
        }
    )

}

function makeBoardString() {
    let boardString = "";

    for (let i = 0; i < board.length; i += 1) {
        // channel.send(board[i]);
        //add the board[i] to boardstring 
        boardString += board[i] + ' '

        if (i == 2 || i == 5) {
            boardString += "\n"
        }

    }

    return boardString
}



bot.login(config.token)





