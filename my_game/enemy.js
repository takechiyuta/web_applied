// 敵：作る・入れる・動かす・描く（足すものの形）

const MAX_ENEMIES = 12;   // 敵は、同時にこの数まで（6 → 12 に増やす）

// ① 作る：敵を1体作って返す関数（呼ぶたびに、新しい敵が1体できる）
function createEnemy(x, vx) {
  return { x: x, y: floor.y - 32, w: 32, h: 32, vx: vx, alive: true };
}

// ② 入れる：敵をまとめて入れる配列（７-６で入れ直すので let）
let enemies = [];
let spawnTimer = 0;   // 敵を出すタイマー
let nextSpawn = 0.6;  // 次の敵を出すまでの時間（秒・最初は 0.6 秒で出す）

// 最初の敵を入れ直す（★ main.js の resetGame から呼ばれる）
function resetEnemies() {
  enemies = [];
  enemies.push(createEnemy(120, 90));
  enemies.push(createEnemy(240, -130));
  enemies.push(createEnemy(420, 110));
  enemies.push(createEnemy(540, -90));

  // ７-Ａ：止まって動く敵を2体に増やす（1秒動いて、1秒止まる、をくり返す）
  const stopper1 = createEnemy(180, 100);
  stopper1.type = "stopper";
  stopper1.timer = 0;
  stopper1.moving = true;
  enemies.push(stopper1);

  const stopper2 = createEnemy(460, -100);
  stopper2.type = "stopper";
  stopper2.timer = 0;
  stopper2.moving = true;
  enemies.push(stopper2);

  spawnTimer = 0;
  nextSpawn = 0.6;
}

// 敵を時間で出す（タイマーの形・くり返す）
function spawnEnemies(dt) {
  spawnTimer = spawnTimer + dt;
  if (spawnTimer >= nextSpawn) {
    if (enemies.length < MAX_ENEMIES) {
      // 左の端か右の端か、くじで決める
      if (Math.random() < 0.5) {
        enemies.push(createEnemy(0, 100));                    // 左の端から、右へ
      } else {
        enemies.push(createEnemy(canvas.width - 32, -100));   // 右の端から、左へ
      }
    }
    spawnTimer = 0;
    nextSpawn = 0.4 + Math.random() * 0.6;   // 次は 0.4〜1.0 秒のどれか
  }
}

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

// プレイヤーとぶつかったとき：上から落ちてきたときだけ敵を倒し、横から当たったら HP を減らす
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;            // 倒した（状態を書き換える）
      player.vy = -JUMP_SPEED / 2;    // 踏んだら、少し跳ねる
      score = score + 1;              // 点数を足す（★ main.js の score を書き換える）
      combo = combo + 1;              // コンボを足す（★ main.js の combo を書き換える）
    } else if (aabb(player, enemy) && player.hitTimer <= 0) {
      player.hp = player.hp - 1;      // 横から当たった：HP を減らす（★ player.js の値を書き換える）
      player.hitTimer = HIT_TIME;     // しばらく当たらない
      combo = 0;                      // ダメージを受けたらコンボリセット（★ main.js の combo を書き換える）
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