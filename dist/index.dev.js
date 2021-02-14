"use strict";

var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var ROCKET_MOVEMENT = 8;
var lastLoopRun = 0;
var score = 0;
var level = 1;
var banner = "LEVEL UP!";
var iterations = 0;
var enemyDecision = true;
var gameOverVar = false;
var controller = new Object();
var enemies = new Array();

function newItems(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

function toggleKey(keyCode, isPressed) {
  if (keyCode == LEFT_KEY) {
    controller.left = isPressed;
  }

  if (keyCode == RIGHT_KEY) {
    controller.right = isPressed;
  }

  if (keyCode == UP_KEY) {
    controller.up = isPressed;
  }

  if (keyCode == DOWN_KEY) {
    controller.down = isPressed;
  }

  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  }
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function ensureBounds(items, ignoreY) {
  if (items.x < 20) {
    items.x = 20;
  }

  if (!ignoreY && items.y < 20) {
    items.y = 20;
  }

  if (items.x + items.w > 480) {
    items.x = 480 - items.w;
  }

  if (!ignoreY && items.y + items.h > 480) {
    items.y = 480 - items.h;
  }
}

function setPosition(items) {
  var e = document.getElementById(items.element);
  e.style.left = items.x + 'px';
  e.style.top = items.y + 'px';
}

function handleControls() {
  if (controller.up) {
    rocket.y -= ROCKET_MOVEMENT;
  }

  if (controller.down) {
    rocket.y += ROCKET_MOVEMENT;
  }

  if (controller.left) {
    rocket.x -= ROCKET_MOVEMENT;
  }

  if (controller.right) {
    rocket.x += ROCKET_MOVEMENT;
  }

  if (controller.space && shoot.y <= -120) {
    shoot.x = rocket.x + 20;
    shoot.y = rocket.y - shoot.h;
  }

  ensureBounds(rocket);
}

function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    if (intersects(shoot, enemies[i])) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
      shoot.y = -shoot.h;
      score += 100;
    } else if (intersects(rocket, enemies[i])) {
      gameOver();
    } else if (enemies[i].y + enemies[i].h >= 500) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
    }
  }
}

function gameOver() {
  var element = document.getElementById(rocket.element);
  element.style.visibility = 'hidden';
  element = document.getElementById('gameover');
  element.style.visibility = 'visible';
  gameOverVar = true;
}

function showSprites() {
  setPosition(rocket);
  setPosition(shoot);

  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }

  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'SCORE: ' + score;
}

function updatePositions() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 4;
    enemies[i].x += getRandom(7) - 3;
    ensureBounds(enemies[i], true);
  }

  shoot.y -= 12;
}

function levelUp() {
  var bannerElement = document.getElementById('banner');
  bannerElement.style.visibility = 'visible';
  setTimeout(function () {
    bannerElement.style.visibility = 'hidden';
  }, 2000);
}

function addEnemy() {
  var levelElement = document.getElementById('level');
  var interval = 50;

  if (!gameOverVar) {
    if (iterations > 1500) {
      interval = 5;
      levelElement.innerHTML = 'LEVEL: 4';

      if (iterations > 1501 && iterations < 1510) {
        levelUp();
      }
    } else if (iterations > 1000) {
      interval = 20;
      levelElement.innerHTML = 'LEVEL: 3';

      if (iterations > 1001 && iterations < 1010) {
        levelUp();
      }
    } else if (iterations > 500) {
      interval = 35;
      levelElement.innerHTML = 'LEVEL: 2';

      if (iterations > 500 && iterations < 510) {
        levelUp();
      }
    }
  }

  if (getRandom(interval) == 0) {
    var elementName = 'enemy' + getRandom(10000000);
    var enemy = newItems(elementName, getRandom(450), -40, 35, 35);
    var element = document.createElement('div');
    element.id = enemy.element;
    element.className = enemyDecision ? 'enemy' : 'enemy2';
    document.children[0].appendChild(element);
    enemies[enemies.length] = enemy;
    enemyDecision = !enemyDecision;
  }
}

function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}

function loop() {
  if (new Date().getTime() - lastLoopRun > 40) {
    updatePositions();
    handleControls();
    checkCollisions();
    addEnemy();
    showSprites();
    lastLoopRun = new Date().getTime();
    iterations++;
  }

  setTimeout('loop();', 2);
}

document.onkeydown = function (evt) {
  toggleKey(evt.keyCode, true);
};

document.onkeyup = function (evt) {
  toggleKey(evt.keyCode, false);
};

var rocket = newItems('rocket', 230, 440, 40, 40);
var shoot = newItems('shoot', 0, -120, 2, 50);
loop();