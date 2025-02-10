const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext('2d')

// Canvas settings
canvas.width = 800
canvas.height = 400

// Game settings

const paddleWidth = 10
const paddleHeight =60
const ballSize = 8

// Game state

let gameState = {
    ball:{
        x:canvas.width/2,
        y:canvas.height/2,
        dx:5,
        dy:5,
        speed:5
    },
    leftPaddle:{
        y:canvas.height/2 - paddleHeight/2,
        score:0
    },
    rightPaddle:{
        y:canvas.height/2-paddleHeight/2,
        score:0
    }
}

// Controls
let upPressed = false
let downPressed = false
let wPressed = false
let sPressed = false

// Event Listeners for controls

document.addEventListener('keydown',(e)=>{
    if(e.key === 'ArrowUp') upPressed = true
    if(e.key === 'ArrowDown') downPressed = true
    if(e.key === 'w') wPressed = true
    if(e.key === 's') sPressed = true
})

document.addEventListener('keyup',(e)=>{
    if(e.key === 'ArrowUp') upPressed = false
    if(e.key === 'ArrowDown') downPressed = false
    if(e.key === 'w') wPressed = false
    if(e.key === 's') sPressed = false
})

// Array of neon colors for the ball
const neonColors =[
    '#ff00ff', // Magenta
    '#00ff00', // Green
    '#00ffff', // Cyan
    '#ff0000', // Red
    '#ffff00', // Yellow
    '#ff4da6', // Pink
    '#4dff4d', // Light green
    '#4d4dff'  // Blue
]

let currentBallColor = neonColors[0]

// Drawing functions

function drawBall(){
    ctx.beginPath()
    ctx.arc(gameState.ball.x,gameState.ball.y,ballSize,0,Math.PI*2)

    const gradient = ctx.createRadialGradient(
        gameState.ball.x,gameState.ball.y,0,
        gameState.ball.x,gameState.ball.y,ballSize
    )

    gradient.addColorStop(0,currentBallColor)
    gradient.addColorStop(0.7,currentBallColor)
    gradient.addColorStop(1,'rgba(255,255,255,0)')

    ctx.fillStyle = gradient
    ctx.shadowBlur = 15
    ctx.shadowColor = currentBallColor
    ctx.fill()
    ctx.closePath()

    // Reset shadow to not affect oter elements
    ctx.shadowBlur = 0
}

function drawPaddle(x,y){
    ctx.fillStyle = '#fff'
    ctx.fillRect(x,y,paddleWidth,paddleHeight)
}

function drawScore(){
    ctx.font = '32px Arial'
    ctx.fillStyle = '#fff'
    ctx.fillText(gameState.leftPaddle.score, canvas.width/4,50)
    ctx.fillText(gameState.rightPaddle.score,3*canvas.width/4,50)
}

function drawCenterLine(){
    ctx.setLineDash([5,15])
    ctx.beginPath()
    ctx.moveTo(canvas.width/2,0)
    ctx.lineTo(canvas.width/2,canvas.height)
    ctx.strokeStyle ='#fff'
    ctx.stroke()
}

// Update logic

function update(){
    //paddle movement
    if(wPressed && gameState.leftPaddle.y >0){
        gameState.leftPaddle.y -= 7
    }
    if(sPressed && gameState.leftPaddle.y < canvas.height - paddleHeight){
        gameState.leftPaddle.y+= 7
    }
    if(upPressed && gameState.rightPaddle.y>0){
        gameState.rightPaddle.y -= 7
    }
    if(downPressed && gameState.rightPaddle.y < canvas.height - paddleHeight){
        gameState.rightPaddle.y += 7
    }

    // Ball movement

    gameState.ball.x += gameState.ball.dx
    gameState.ball.y+= gameState.ball.dy

    // Wall collision

    if(gameState.ball.y + ballSize > canvas.height || gameState.ball.y - ballSize <0){
        gameState.ball.dy *= -1
    }

    // Paddle collision
    if(gameState.ball.x - ballSize<paddleWidth &&
        gameState.ball.y > gameState.leftPaddle.y &&
        gameState.ball.y < gameState.leftPaddle.y + paddleHeight){
            gameState.ball.dx = Math.abs(gameState.ball.dx)
            increaseBallSpeed()
            handlePaddleCollision()
    }

    if (gameState.ball.x + ballSize >= canvas.width - paddleWidth &&
        gameState.ball.y > gameState.rightPaddle.y && 
        gameState.ball.y < gameState.rightPaddle.y + paddleHeight){
            gameState.ball.dx = -Math.abs(gameState.ball.dx)
            increaseBallSpeed()
            handlePaddleCollision()
    }
    
    // Scoring
    if(gameState.ball.x < 0){
        gameState.rightPaddle.score++
        resetBall()
    }
    if(gameState.ball.x>canvas.width){
        gameState.leftPaddle.score++
        resetBall()
    }
}

function increaseBallSpeed(){
    const maxSpeed = 15
    if(Math.abs(gameState.ball.dx)<maxSpeed){
        gameState.ball.dx *= 1.1
        gameState.ball.dy *= 1.1
    }
}

function resetBall(){
    gameState.ball.x = canvas.width/2
    gameState.ball.y = canvas.height/2
    gameState.ball.dx = 5 * (Math.random()> 0.5 ? 1 : -1 )
    gameState.ball.dy = 5 * (Math.random()> 0.5 ? 1 : -1 )
}

// Handle Paddle collision and change ball color

function handlePaddleCollision(){
    currentBallColor = neonColors[Math.floor(Math.random()*neonColors.length)]
}

// Main game loop

function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawCenterLine()
    drawBall()
    drawPaddle(0,gameState.leftPaddle.y)
    drawPaddle(canvas.width-paddleWidth,gameState.rightPaddle.y)
    drawScore()

    update()
    requestAnimationFrame(gameLoop)

}

gameLoop()
