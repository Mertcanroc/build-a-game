const gamesBoardContainer = document.querySelector("#gameboard-container")
const flipBtn = document.querySelector("#flip-btn")
const optionContainer = document.querySelector(".option-container")
const startButton = document.querySelector("#start-btn")
const infoDisplay = document.querySelector("#info-js")
const turnDisplay = document.querySelector("#turn-js")
// Options
let angle = 0 //houdt rotatiehoek van de schepen
function flip () {
    const optionShips = Array.from(optionContainer.children)
    angle = angle === 0 ? 90 : 0

    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`) // multi-line strings en string interpolation 
}

flipBtn.addEventListener("click", flip)

// Creating Boards
const width = 10

function createBoard(color, user) { //2 parameters
    const gameBoardContainer = document.createElement("div")
    gameBoardContainer.classList.add("game-board")
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement("div")
        block.classList.add("block")
        block.id = i
        gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
}
createBoard("rgba(0, 110, 255, 1)", "player")
createBoard("rgba(0, 110, 255, 1)", "computer")

//ship making

class ship {
    constructor(name, length) {
        this.name = name 
        this.length = length
    }
}

const destroyer = new ship("destroyer", 2)
const submarine = new ship("submarine", 3)
const cruiser = new ship("cruiser", 4)
const corvette = new ship("corvette", 2)
const carrier = new ship("carrier", 5)

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {  //allboardblocks = Array ishorizontal = boolean should it be horizontally, startindex: index ship placement starts, 
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : 
    width * width - ship.length :
    // handle vertical 
    startIndex <= width * width - width * ship.length ? startIndex :
    startIndex - ship.length * width + width

    let shipBlocks = []

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i])
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
        }
    }



    if (isHorizontal) {
    shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id < 90 + (width * index + 1)
        )
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains("taken"))

    return{shipBlocks, valid, notTaken}
}

const ships = [destroyer, submarine, cruiser, corvette, carrier]

function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === "player" ? angle === 0 : randomBoolean
    let randomStartIndex = Math.floor(Math.random() * width * width)
    console.log(randomStartIndex)

    let startIndex = startId ? startId : randomStartIndex

    const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

   
    if (valid && notTaken) {          //If ship placement is valid and none of blocks are taken it adds ship to the gameboard by modifying the CSS classes of the relevant blocks
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add("taken")
        })
    } else {        // If ship placement is not valid or some blocks are already taken
        if (user === "computer") addShipPiece(user, ship, startId)
        if (user === "player") notDropped = true
    }
  
}

ships.forEach(ship => addShipPiece("computer", ship))

// Drag player ships
let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener("dragstart", dragStart))

const allPlayerBlocks = document.querySelectorAll("#player div")
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener("dragover", drag0ver)
    playerBlock.addEventListener("drop", dropShip)
})

function dragStart(e){    //voor het slepen
    notDropped = false
    draggedShip = e.target
}

function drag0ver(e) {   //not dragged on the board notdropped wordt true
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highlightArea(e.target.id, ship)
}

function dropShip(e) {  //wordt gedropped en notdropped blijft false
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece("player", ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}

//add highlight
function highlightArea( startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll("#player div") //all divs in allboardblocks 
    let isHorizontal = angle === 0

    const {shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship) 

    if (valid && notTaken) {  //if placement valid + blocks not taken  It adds a "hover" class to each block occupied by the ship
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add("hover")
            setTimeout(() => shipBlock.classList.remove("hover"), 500)
        })
    }
}

let game0ver = false
let playerTurn

//start game
function startGame() {
    if (playerTurn === undefined) {
        if (optionContainer.children.length !== 0) {
            infoDisplay.textContent = "U moet al uw schepen inzetten"
        } else {
            const allBoardBlocks = document.querySelectorAll("#computer div")
            allBoardBlocks.forEach(block => block.addEventListener("click", handleClick))
            playerTurn = true
            turnDisplay.textContent = "Jouw beurt"
            infoDisplay.textContent = "Game is begonnen"
        }
    }
}
startButton.addEventListener("click", startGame)



let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

function handleClick(e) {  // if the default behavior of the click event has not been prevented.
    if (!e.defaultPrevented) {
        if (e.target.classList.contains("taken")) { // checked of block "taken" bevat
            e.target.classList.add("boom");
            infoDisplay.textContent = "Strijder je hebt een schip geraakt";
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className !== "block");
            classes = classes.filter(className => className !== "boom");
            classes = classes.filter(className => className !== "taken");
            playerHits.push(...classes); // add het tot the playerhit class
            checkScore("player", playerHits, playerSunkShips);
        } else {
            infoDisplay.textContent = "Gemist! U bent fck slecht";
            e.target.classList.add("empty");
        }

        playerTurn = false;
        allPlayerBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000); //3 sec timeout befofre triggering computer turn
    }
}

//define the computers go
function computerGo() {
    if (!game0ver) {
        turnDisplay.textContent = "computers beurt!"
        infoDisplay.textContent = "Hij zit te denken..."

        setTimeout(() => { //for computer thinking
            let randomGo = Math.floor(Math.random() * width * width) //generates a random index on the players game board 
            const allBoardBlocks = document.querySelectorAll("#player div")

            if (allBoardBlocks[randomGo].classList.contains("taken") &&
            allBoardBlocks[randomGo].classList.contains("boom")
            ) {
                computerGo()
                return
            } else if (
                allBoardBlocks[randomGo].classList.contains("taken") &&
                !allBoardBlocks[randomGo].classList.contains("boom")
            ) {
                allBoardBlocks[randomGo].classList.add("boom")
                infoDisplay.textContent = "De computer heeft je schip geraakt je bent slecht!"
                let classes = Array.from(allBoardBlocks[randomGo].classList);
            classes = classes.filter(className => className !== "block");
            classes = classes.filter(className => className !== "boom");
            classes = classes.filter(className => className !== "taken");
            computerHits.push(...classes)
            checkScore("computer", computerHits, computerSunkShips)
            } else {
                infoDisplay.textContent = "Niks geraakt zemmer"
                allBoardBlocks[randomGo].classList.add("empty")
            }
        }, 3000)

        setTimeout(() => {
            playerTurn = true
            turnDisplay.textContent = "Jouw beurt"
            infoDisplay.textContent = "Maak je keuze"
            const allBoardBlocks = document.querySelectorAll("#computer div")
            allBoardBlocks.forEach(block => block.addEventListener("click", handleClick))
        }, 6000)

    }
}

function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === "player") {
                infoDisplay.textContent = `je hebt computer's ${shipName} vernietigd`
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
                infoDisplay.textContent = `je hebt ${user}'s ${shipName} vernietigd`
                if (user === "computer") {
                    infoDisplay.textContent = `de computer heeft je ${shipName} vernietigd`
                    computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
                }
                userSunkShips.push(shipName)
            }
        }
    }


    checkShip("destroyer", 2)
    checkShip("submarine", 3)
    checkShip("cruiser", 4)
    checkShip("corvette", 2)
    checkShip("carrier", 5)

    console.log("playerHits", playerHits)
    console.log("playerSunkShips", playerSunkShips)

    if (playerSunkShips.length === 5) {
    infoDisplay.textContent = "Je hebt gewone"
    game0ver = true
    }
    if (computerSunkShips.length === 5) {
    infoDisplay.textContent = "Computer heeft gewone je bent slech"
    game0ver = true
    }
}

