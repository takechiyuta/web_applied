// プレイヤー：決まった数・今の値・キー・動き・描き方

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;          // 地面を離れてから跳べる回数（2段ジャンプ）
const FALL_GRAVITY_RATE = 2;  // 落ちるときは、重力を何倍にするか

const player = { x: 80, y: 20, w: 32, h: 32, vx: 0, vy: 0, isGrounded: false, jumpsLeft: MAX_JUMPS, state: "idle", frameIndex: 0, frameTimer: 0, facing: 1 };

// コマを並べた画像（1コマ 32×32）
const playerImg = new Image();
playerImg.src = "7-3_bird.png";
const FRAME_SIZE = 32;    // 1コマの大きさ
const FRAME_TIME = 0.12;  // 1コマを見せる時間（秒）

// 状態ごとに、画像の何段目を使うか（row）と、コマの数（count）
const ANIMS = {
  idle: { row: 0, count: 2 },
  run:  { row: 1, count: 4 },
  jump: { row: 2, count: 2 },
  fall: { row: 3, count: 2 },
};

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -JUMP_SPEED;
    player.jumpsLeft = player.jumpsLeft - 1;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床とぶつかったら、位置を戻して、速さを決める
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

// 状態を決める関数（状態を決めるのは、この関数だけ）
function decideState() {
  if (!player.isGrounded) {   // 空中にいて
    if (player.vy < 0) {      // 速さが上向き（vy がマイナス）なら
      return "jump";
    }
    return "fall";
  }
  if (player.vx !== 0) {      // 横の速さが 0 でなければ
    return "run";
  }
  return "idle";
}

// プレイヤーを動かす（★ main.js の update から呼ばれる）
function updatePlayer(dt) {
  // 横の速さをキーで決める → 速さが位置を変える
  player.vx = 0;
  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  }
  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  }
  player.x = player.x + player.vx * dt;

  // 向き：動いているときだけ変える（止まったら、最後の向きのまま）
  if (player.vx > 0) {
    player.facing = 1;    // 右
  }
  if (player.vx < 0) {
    player.facing = -1;   // 左
  }

  const g = player.vy > 0 ? GRAVITY * FALL_GRAVITY_RATE : GRAVITY;
  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();

  // 動かし終わったら、今の状態を決める。状態が変わったら、コマを最初に戻す
  const newState = decideState();
  if (newState !== player.state) {
    player.state = newState;
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  // コマ送り（タイマーの形）：コマの数は、今の状態のもの
  player.frameTimer = player.frameTimer + dt;
  if (player.frameTimer >= FRAME_TIME) {
    player.frameIndex = (player.frameIndex + 1) % ANIMS[player.state].count;
    player.frameTimer = 0;
  }
}

// プレイヤーを描く（★ main.js の draw から呼ばれる）
function drawPlayer() {
  const sx = player.frameIndex * FRAME_SIZE;
  const sy = ANIMS[player.state].row * FRAME_SIZE;

  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
  ctx.scale(player.facing, 1);
  ctx.drawImage(playerImg, sx, sy, FRAME_SIZE, FRAME_SIZE, -player.w / 2, -player.h / 2, player.w, player.h);
  ctx.restore();

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "   state = " + player.state + "   frameIndex = " + player.frameIndex, 10, 20);
}