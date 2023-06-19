let xAxys = 220;
let yAxys = 420;
let xCount = 0;
let yCount = 0;
let up = false;
let down = false;
let left = false;
let right = false;
let shoot = false;
let bulletArray = [];
let enemyArray = [];
let ctrlBG1 = -512;
let ctrlBG2 = 0;
let ctrlBG3 = 512;
let life = 3;
let score = 0;

document.addEventListener("DOMContentLoaded", (event) => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let count_load = 0;
  let bg = new Image();
  bg.src = "images/bg.png";
  let player1 = new Image();
  player1.src = "images/ship.png";
  let bullet = new Image();
  bullet.src = "images/bullet.png";
  let enemy = new Image();
  enemy.src = "images/enemy.png";

  bg.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  player1.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  bullet.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };

  enemy.onload = () => {
    count_load++;
    loaded(count_load, canvas, ctx, bg, player1, bullet, enemy);
  };
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
      up = false;
      yCount = 0;
      break;

    case "ArrowDown":
      down = false;
      yCount = 0;
      break;

    case "ArrowLeft":
      left = false;
      xCount = 0;
      break;

    case "ArrowRight":
      right = false;
      xCount = 0;
      break;

    case " ":
      shoot = false;
      break;
  }
});

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      up = true;
      break;

    case "ArrowDown":
      down = true;
      break;

    case "ArrowLeft":
      left = true;
      break;

    case "ArrowRight":
      right = true;
      break;

    case " ":
      shoot = true;
      break;
  }

  if (shoot) {
    bulletArray.push([xAxys + 20, yAxys]);
  }

  if (up && left) {
    xCount = -1;
    yCount = -2;
  } else if (up && right) {
    xCount = 1;
    yCount = -2;
  } else if (down && left) {
    xCount = -1;
    yCount = 2;
  } else if (down && right) {
    xCount = 1;
    yCount = 2;
  } else if (up) {
    yCount = -2;
  } else if (down) {
    yCount = 2;
  } else if (left) {
    xCount = -2;
  } else if (right) {
    xCount = 2;
  }
});

function loaded(count_load, canvas, ctx, bg, player1, bullet, enemy) {
  if (count_load == 4) {
    window.setInterval(() => {
      drawScene(canvas, ctx, bg, player1, bullet, enemy);
    }, 4);
  }
}

function ctrlDrawBg(ctx, bg) {
  /* Controla e mostra BG */
  ctx.drawImage(bg, 0, ctrlBG1);
  ctx.drawImage(bg, 0, ctrlBG2);
  ctx.drawImage(bg, 0, ctrlBG3);

  ctrlBG1 += 2;
  ctrlBG2 += 2;
  ctrlBG3 += 2;

  if (ctrlBG1 > 512) {
    ctrlBG1 = -512;
  }

  if (ctrlBG2 > 512) {
    ctrlBG2 = -512;
  }

  if (ctrlBG3 > 512) {
    ctrlBG3 = -512;
  }
}

function ctrlDrawPlayer(ctx, player1) {
  /* Controla e mostra player */
  if (xAxys < 0) {
    xAxys = 512;
  }

  if (xAxys > 512) {
    xAxys = 0;
  }

  if (yAxys > 512) {
    yAxys = 0;
  }

  if (yAxys < 0) {
    yAxys = 512;
  }

  xAxys += xCount;
  yAxys += yCount;

  ctx.drawImage(player1, xAxys, yAxys);
}

function ctrlDrawBulletPlayer(ctx, bullet) {
  /* Controla e mostra bullets player */
  bulletArray.forEach((element, index, object) => {
    element[1] = element[1] - 2;

    ctx.drawImage(bullet, element[0], element[1]);

    if (element[1] < 0) {
      object.splice(index, 1);
    }
  });
}

function ctrlDrawEnemy(ctx, enemy) {
  /* Controla e mostra inimigo */
  if (enemyArray.length < 4) {
    enemyArray.push([
      randomIntFromInterval(32, 480),
      randomIntFromInterval(-1024, 0),
    ]);
  }

  enemyArray.forEach((element, index, object) => {
    element[1] = element[1] + 1;

    ctx.drawImage(enemy, element[0], element[1]);

    if (element[1] > 512) {
      object.splice(index, 1);
    }
  });
}

function checkCollision(elementA, elementB) {
  xIsColliding = false;
  yIsColliding = false;

  if (elementA[0] > elementB[0]) {
    if (elementA[0] - elementB[0] < 57) {
      xIsColliding = true;
    }
  } else {
    if (elementB[0] - elementA[0] < 57) {
      xIsColliding = true;
    }
  }

  if (elementA[1] > elementB[1]) {
    if (elementA[1] - elementB[1] < 20) {
      yIsColliding = true;
    }
  } else {
    if (elementB[1] - elementA[1] < 20) {
      yIsColliding = true;
    }
  }

  if (xIsColliding && yIsColliding) {
    return true;
  } else {
    return false;
  }
}

function checkAllCollisions() {
  bulletArray.forEach((element, index, object) => {
    enemyArray.forEach((element2, index2, object2) => {
      if (checkCollision(element, element2)) {
        object.splice(index, 1);
        object2.splice(index2, 1);
        score++;
      }
    });
  });

  enemyArray.forEach((element, index, object) => {
    if (checkCollision([xAxys, yAxys], element)) {
      object.splice(index, 1);
      life--;
      xAxys = 220;
      yAxys = 420;
    }
  });
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawScene(canvas, ctx, bg, player1, bullet, enemy) {
  checkAllCollisions();
  ctx.clearRect(0, 0, 640, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctrlDrawBg(ctx, bg);
  ctrlDrawPlayer(ctx, player1);
  ctrlDrawEnemy(ctx, enemy);
  ctrlDrawBulletPlayer(ctx, bullet);

  ctx.font = "19px Arial";
  ctx.fillText("Life: " + life, 10, 30);
  ctx.fillText("Score: " + score, 10, 60);
}
