export const GRID_SIZE = 20;
export const INITIAL_DIRECTION = { x: 1, y: 0 };

export function createInitialState(randomFn = Math.random) {
  const snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ];

  return {
    snake,
    direction: { ...INITIAL_DIRECTION },
    nextDirection: { ...INITIAL_DIRECTION },
    food: createFood(snake, GRID_SIZE, randomFn),
    score: 0,
    isOver: false,
    isPaused: false,
  };
}

export function isOppositeDirection(current, next) {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

export function updateDirection(state, nextDirection) {
  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return {
    ...state,
    nextDirection,
  };
}

export function tick(state, randomFn = Math.random) {
  if (state.isOver || state.isPaused) {
    return state;
  }

  const direction = state.nextDirection;
  const head = state.snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };
  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);

  if (isWallCollision(nextHead, GRID_SIZE) || isSelfCollision(nextHead, collisionBody)) {
    return {
      ...state,
      direction,
      isOver: true,
    };
  }
  const newSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    newSnake.pop();
  }

  return {
    ...state,
    snake: newSnake,
    direction,
    food: ateFood ? createFood(newSnake, GRID_SIZE, randomFn) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function togglePause(state) {
  if (state.isOver) {
    return state;
  }
  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function isWallCollision(pos, gridSize) {
  return pos.x < 0 || pos.y < 0 || pos.x >= gridSize || pos.y >= gridSize;
}

export function isSelfCollision(head, snake) {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function createFood(snake, gridSize, randomFn = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const available = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return { x: 0, y: 0 };
  }

  const index = Math.floor(randomFn() * available.length);
  return available[index];
}
