// 敵：作る・入れる・動かす・描く（足すものの形）

// ① 作る：敵を1体作って返す関数（呼ぶたびに、新しい敵が1体できる）
function createEnemy(x, vx) {
  return { x: x, y: floor.y - 32, w: 32, h: 32, vx: vx, alive: true };
}

// ② 入れる：敵をまとめて入れる配列（７-６で入れ直すので let）
let enemies = [];
enemies.push(createEnemy(200, 80));
enemies.push(createEnemy(380, -120));
enemies.push(createEnemy(540, 60));

// ７-Ａ：止まって動く敵を1体足す（1秒動いて、1秒止まる、をくり返す）
const stopper = createEnemy(300, 100);
stopper.type = "stopper";
stopper.timer = 0;
stopper.moving = true;
enemies.push(stopper);

// ③ 動かす：配列の敵を1体ずつ取り出して、同じ処理をする
function updateEnemies(dt) {
  for (const enemy of enemies) {
    // 止まって動く敵のタイマーと状態切り替え
    if (enemy.type === "stopper") {
      enemy.timer = enemy.timer + dt;
      if (enemy.timer >= 1) {
        enemy.timer = 0;
        enemy.moving = !enemy.moving;
      }
      // 止まっている状態なら、移動処理を飛ばして次の敵へ
      if (!enemy.moving) {
        continue;
      }
    }

    enemy.x = enemy.x + enemy.vx * dt;
    // 端を越えたら、位置を戻して、向きを反対に（５-４の跳ね返り）
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

// プレイヤーとぶつかったとき：上から落ちてきたときだけ、敵を倒す
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;            // 倒した（状態を書き換える）
      player.vy = -JUMP_SPEED / 2;    // 踏んだら、少し跳ねる
    }
  }
  enemies = enemies.filter((enemy) => enemy.alive);   // 生きている敵だけを残す
}

// ④ 描く：配列の敵を1体ずつ取り出して描く
function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.type === "stopper") {
      ctx.fillStyle = enemy.moving ? "#ff9f1c" : "#ffd166";
    } else {
      ctx.fillStyle = "#ff6b6b";
    }
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}