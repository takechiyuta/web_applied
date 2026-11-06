// HTMLのIDに合わせて "stage" を取得するように修正しました
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 100;
let y = 80;
let vx = 180;
let vy = 140;
let r = 14;
let color = "#ffd166";
let last = performance.now();

// 手順2：キーを押した瞬間に値を変える処理
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") {
        vx = vx * 1.2;
        vy = vy * 1.2;
    }
    if (e.code === "ArrowDown") {
        vx = vx * 0.8;
        vy = vy * 0.8;
    }
    if (e.code === "KeyC") {
        color = "#06d6a0";
    }
});

function update(dt) {
    // 手順3（自分ルール）：重力を足す（下向きに加速度を加える）
    vy = vy + 300 * dt;
    x = x + vx * dt;
    y = y + vy * dt;

    // 左右の壁
    if (x + r > canvas.width) {
        x = canvas.width - r;
        vx = -vx;
    }
    if (x - r < 0) {
        x = r;
        vx = -vx;
    }

    // 上下の壁
    if (y + r > canvas.height) {
        y = canvas.height - r;
        vy = -vy;
    }
    if (y - r < 0) {
        y = r;
        vy = -vy;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function loop(now) {
    const dt = Math.min((now - last) / 1000, 0.033);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
