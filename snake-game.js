import { createInitialState, tick, togglePause, updateDirection, GRID_SIZE } from './snake-logic.js';

const TICK_MS = 140;
const KEY_TO_DIR = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreNode = document.getElementById('score');
const gameOverNode = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const restartInlineBtn = document.getElementById('restart-inline');
const touchControls = document.querySelectorAll('[data-dir]');

const cellSize = canvas.width / GRID_SIZE;
let state = createInitialState();
let intervalId;

function restartGame() {
  state = createInitialState();
  render();
}

function setDirectionFromName(name) {
  const map = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  if (map[name]) {
    state = updateDirection(state, map[name]);
  }
}

function drawGrid() {
  ctx.strokeStyle = '#efefef';
  ctx.lineWidth = 1;

  for (let i = 0; i <= GRID_SIZE; i += 1) {
    const p = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function drawRect(pos, color) {
  ctx.fillStyle = color;
  ctx.fillRect(pos.x * cellSize, pos.y * cellSize, cellSize, cellSize);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  drawRect(state.food, '#d94f4f');
  state.snake.forEach((segment, index) => drawRect(segment, index === 0 ? '#267326' : '#2f8f2f'));

  scoreNode.textContent = String(state.score);
  gameOverNode.classList.toggle('hidden', !state.isOver);
}

function startLoop() {
  intervalId = window.setInterval(() => {
    state = tick(state);
    render();
  }, TICK_MS);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    state = togglePause(state);
    return;
  }

  const dir = KEY_TO_DIR[event.key];
  if (dir) {
    event.preventDefault();
    state = updateDirection(state, dir);
  }
});

touchControls.forEach((button) => {
  button.addEventListener('click', () => {
    setDirectionFromName(button.dataset.dir);
  });
});

restartBtn.addEventListener('click', restartGame);
restartInlineBtn.addEventListener('click', restartGame);

render();
startLoop();

window.addEventListener('beforeunload', () => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
