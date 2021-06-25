const width = 10
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
let nextRandom = 0
let timerId
let counter = 0
let score = 0
let isGameOver = false
//Forming tetriminoes and thier rotation
const lTetrimino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const reverseLTetrimino = [
    [0, width+1, width*2+1, 1],
    [width, width+1, width+2, 2],
    [1, width+1, width*2+1, width*2+2],
    [0, 1, 2, width*1]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
]

const reverseZTetromino = [
    [1,width,width+1,width*2],
    [1, 0,width*1+2,width*1+1],
    [1,width,width+1,width*2],
    [1, 0,width*1+2,width*1+1]
]

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

//stock all tetrimino in one array
const theTetriminoes = [lTetrimino, reverseLTetrimino, zTetromino, reverseZTetromino, tTetromino, oTetromino, iTetromino]


let currentPosition = 4
let currentRotation = 0
//randomly select tetrimino and its random rotation
let random = Math.floor(Math.random()*theTetriminoes.length)
let currentTetrimino = theTetriminoes[random][currentRotation]
// let current = theTetriminoes[3][3]

function makeTetrimino(){
    currentTetrimino.forEach(index =>{
        squares[currentPosition+index].classList.add('tetromino')
    })
}

function removeTetrimino(){
    currentTetrimino.forEach(index =>{
        squares[currentPosition+index].classList.remove('tetromino')
    })
}

//assign function to keycode/keypress
function control(e){
    if(!isGameOver){
        if(e.keyCode === 37){
            moveTetriminoToTheLeft()
        }else if(e.keyCode === 38){
            rotateTetrimino()
        }else if(e.keyCode === 39){
            moveTetriminoToTheRight()
        }else if(e.keyCode === 40){
            moveTetriminoDown()
        }
    }
}
document.addEventListener('keyup', control)


function moveTetriminoDown(){
    removeTetrimino()
    currentPosition+=width
    makeTetrimino()
    freezeTetriminoes()
}

//freeze tetriminoes
function freezeTetriminoes(){
    if(currentTetrimino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        currentTetrimino.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetriminoes.length)
        currentTetrimino = theTetriminoes[random][currentRotation]
        currentPosition = 4
        makeTetrimino()
        displayShape()
        addScore()
        gameOver()
      }
}


function moveTetriminoToTheLeft(){
    removeTetrimino()
    const isAtTheEdge = currentTetrimino.some(index => (currentPosition+index) % width === 0)
    if(!isAtTheEdge) currentPosition -=1

    if(currentTetrimino.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition+=1
    }
    makeTetrimino()
}

function moveTetriminoToTheRight(){
    removeTetrimino()
    const isAtTheEdge = currentTetrimino.some(index => (currentPosition+index) % width === width-1)
    if(!isAtTheEdge) currentPosition +=1

    if(currentTetrimino.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition-=1
    }
    makeTetrimino()
}

function rotateTetrimino(){
    removeTetrimino()
    currentRotation ++
    if(currentRotation === currentTetrimino.length){
        currentRotation = 0 
    }
    currentTetrimino = theTetriminoes[random][currentRotation]
    makeTetrimino()
}



//show up-next tetrimino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


//the Tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth+1, displayWidth*2+1, 1], //reverselTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1,displayWidth,displayWidth+1,displayWidth*2], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

// console.log(upNextTetrominoes)
function displayShape(){
    // console.log(nextRandom)
 //remove any trace of a tetromino form the entire grid
 displaySquares.forEach(square => {
    square.classList.remove('tetromino')
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
  })
}

//add functionality to the button
startBtn.addEventListener('click',()=>{
    if(timerId){
        clearInterval(timerId)
        timerId = null
    }else{
        if(counter==0){
            makeTetrimino()
            timerId = setInterval(moveTetriminoDown,1000)
            nextRandom = Math.floor(Math.random()*theTetriminoes.length)
            displayShape()
            counter++
        }
    }
})

//add score
function addScore(){
    for(let i=0;i<199;i++){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score+=10
            scoreDisplay.innerHTML = score
            row.forEach(index =>{
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const sqaureRemoved = squares.splice(i, width)
            squares = sqaureRemoved.concat(squares)
            squares.forEach(cell =>grid.appendChild(cell))
        }
    }
}
//game over
function gameOver() {
    if(currentTetrimino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
      isGameOver = true
      console.log(isGameOver)
    }
  }