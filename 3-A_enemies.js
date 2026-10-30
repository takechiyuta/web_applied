// データ：敵のオブジェクトの配列
const enemies = [
  { name: "スライム", hp: 5 },
  { name: "ゴブリン", hp: 9 },
  { name: "ドラゴン", hp: 20 }
];

// データからリストを作る（３-５・３-６と同じ形）
function showEnemies() {
  const list = document.getElementById("enemyList");
  list.innerHTML = "";

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const li = document.createElement("li");
    li.innerText = `${enemy.name}（HP：${enemy.hp}）`;
    list.appendChild(li);
  }
}
// 攻撃：全員の HP を 3 減らして、リストを作り直す
function attack() {
  // ★ここを書く
//for文で全員を1体ずつ取り出し、hpを3減らす
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].hp = enemies[i].hp - 3;
    if(enemies.every(enemy => enemy.hp <= 0)){
      alert("クリア！");
    }
  }
  showEnemies();
}

showEnemies();