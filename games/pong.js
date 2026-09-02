// Pong Game
let pongGame = {
    canvas: null,
    ctx: null,
    gameRunning: false,
    player: {x: 10, y: 175, width: 10, height: 50, speed: 6, dy: 0},
    ai: {x: 580, y: 175, width: 10, height: 50, speed: 5},
    ball: {x: 300, y: 200, radius: 5, dx: 4, dy: 4, speed: 4},
    playerScore: 0,
    aiScore: 0,
    maxScore: 5
};

function initPongGame() {
    pongGame.canvas = document.getElementById('pong-canvas');
    pongGame.ctx = pongGame.canvas.getContext('2d');
    pongGame.player = {x: 10, y: 175, width: 10, height: 50, speed: 6, dy: 0};
    pongGame.ai = {x: 580, y: 175, width: 10, height: 50, speed: 5};
    pongGame.ball = {x: 300, y: 200, radius: 5, dx: 4, dy: 4, speed: 4};
    pongGame.playerScore = 0;
    pongGame.aiScore = 0;
    pongGame.gameRunning = true;

    document.removeEventListener('keydown', handlePongInput);
    document.removeEventListener('keyup', handlePongInputUp);
    document.addEventListener('keydown', handlePongInput);
    document.addEventListener('keyup', handlePongInputUp);

    updatePongGame();
}

function handlePongInput(e) {
    if (e.key === 'ArrowUp') {
        pongGame.player.dy = -pongGame.player.speed;
    } else if (e.key === 'ArrowDown') {
        pongGame.player.dy = pongGame.player.speed;
    }
}

function handlePongInputUp(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        pongGame.player.dy = 0;
    }
}

function updatePongGame() {
    if (!pongGame.gameRunning) return;

    // Update player position
    pongGame.player.y += pongGame.player.dy;
    if (pongGame.player.y < 0) pongGame.player.y = 0;
    if (pongGame.player.y + pongGame.player.height > pongGame.canvas.height) {
        pongGame.player.y = pongGame.canvas.height - pongGame.player.height;
    }

    // AI logic
    const aiCenter = pongGame.ai.y + pongGame.ai.height / 2;
    if (aiCenter < pongGame.ball.y - 35) {
        pongGame.ai.y += pongGame.ai.speed;
    } else if (aiCenter > pongGame.ball.y + 35) {
        pongGame.ai.y -= pongGame.ai.speed;
    }

    if (pongGame.ai.y < 0) pongGame.ai.y = 0;
    if (pongGame.ai.y + pongGame.ai.height > pongGame.canvas.height) {
        pongGame.ai.y = pongGame.canvas.height - pongGame.ai.height;
    }

    // Update ball position
    pongGame.ball.x += pongGame.ball.dx;
    pongGame.ball.y += pongGame.ball.dy;

    // Ball collision with top/bottom
    if (pongGame.ball.y - pongGame.ball.radius < 0 || pongGame.ball.y + pongGame.ball.radius > pongGame.canvas.height) {
        pongGame.ball.dy = -pongGame.ball.dy;
    }

    // Ball collision with paddles
    if (pongGame.ball.x - pongGame.ball.radius < pongGame.player.x + pongGame.player.width &&
        pongGame.ball.y > pongGame.player.y &&
        pongGame.ball.y < pongGame.player.y + pongGame.player.height) {
        pongGame.ball.dx = -pongGame.ball.dx;
        pongGame.ball.x = pongGame.player.x + pongGame.player.width + pongGame.ball.radius;
    }

    if (pongGame.ball.x + pongGame.ball.radius > pongGame.ai.x &&
        pongGame.ball.y > pongGame.ai.y &&
        pongGame.ball.y < pongGame.ai.y + pongGame.ai.height) {
        pongGame.ball.dx = -pongGame.ball.dx;
        pongGame.ball.x = pongGame.ai.x - pongGame.ball.radius;
    }

    // Score
    if (pongGame.ball.x - pongGame.ball.radius < 0) {
        pongGame.aiScore++;
        document.getElementById('pong-ai-score').textContent = pongGame.aiScore;
        resetPongBall();
    }
    if (pongGame.ball.x + pongGame.ball.radius > pongGame.canvas.width) {
        pongGame.playerScore++;
        document.getElementById('pong-player-score').textContent = pongGame.playerScore;
        resetPongBall();
    }

    // Check for winner
    if (pongGame.playerScore >= pongGame.maxScore || pongGame.aiScore >= pongGame.maxScore) {
        endPongGame();
        return;
    }

    drawPongGame();
    requestAnimationFrame(updatePongGame);
}

function resetPongBall() {
    pongGame.ball.x = pongGame.canvas.width / 2;
    pongGame.ball.y = pongGame.canvas.height / 2;
    pongGame.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    pongGame.ball.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function drawPongGame() {
    // Clear canvas
    pongGame.ctx.fillStyle = '#000';
    pongGame.ctx.fillRect(0, 0, pongGame.canvas.width, pongGame.canvas.height);

    // Draw center line
    pongGame.ctx.strokeStyle = '#fff';
    pongGame.ctx.setLineDash([10, 10]);
    pongGame.ctx.beginPath();
    pongGame.ctx.moveTo(pongGame.canvas.width / 2, 0);
    pongGame.ctx.lineTo(pongGame.canvas.width / 2, pongGame.canvas.height);
    pongGame.ctx.stroke();
    pongGame.ctx.setLineDash([]);

    // Draw paddles
    pongGame.ctx.fillStyle = '#fff';
    pongGame.ctx.fillRect(pongGame.player.x, pongGame.player.y, pongGame.player.width, pongGame.player.height);
    pongGame.ctx.fillRect(pongGame.ai.x, pongGame.ai.y, pongGame.ai.width, pongGame.ai.height);

    // Draw ball
    pongGame.ctx.beginPath();
    pongGame.ctx.arc(pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius, 0, Math.PI * 2);
    pongGame.ctx.fill();
}

function endPongGame() {
    pongGame.gameRunning = false;
    const winner = pongGame.playerScore > pongGame.aiScore ? '🎉 You Won!' : 'AI Won!';
    document.getElementById('pong-instructions').textContent = `Game Over! ${winner} Play again?`;
}
