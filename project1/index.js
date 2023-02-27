console.log('script is running');
var canvas = document.getElementById('c1');
var ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// canvas.width = 1920;
// canvas.height = 1080;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const backgound = new Background({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const middleground = new Background({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/middleground.png'
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/witch/B_witch_idle.png',
  framesMax: 6,
  scale: 3,
  offset: {
    x: 20,
    y: -15
  },
  sprites: {
    idle: {
      imageSrc: './img/witch/B_witch_idle.png',
      framesMax: 6
    },
    run: {
      imageSrc: './img/witch/B_witch_run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/witch/B_witch_charge.png',
      framesMax: 5
    },
    attack: {
      imageSrc: './img/witch/B_witch_attack.png',
      framesMax: 9
    },
    takeHit: {
      imageSrc: './img/witch/B_witch_take_damage.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/witch/B_witch_death.png',
      framesMax: 12
    },
  },
  attackBox: {
    offset: {
      x: 75,
      y: 40
    },
    width: 215,
    height: 110
  }
})

// player.draw();

const enemy = new Fighter2({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0
  },

  imageSrc: './img/hero/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/hero/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/hero/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/hero/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/hero/Fall.png',
      framesMax: 2
    },
    attack: {
      imageSrc: './img/hero/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/hero/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/hero/Death.png',
      framesMax: 6
    },
  },
  attackBox: {
    offset: {
      x: -240,
      y: 0
    },
    width: 260,
    height: 150
  }
})

// enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId);
  if(player.health == enemy.health){
    document.getElementById('displayText').innerHTML = "Tie";
    document.getElementById('displayText').style.display = 'flex';
  } else if(player.health > enemy.health ){
    document.getElementById('displayText').innerHTML = "Player 1 Wins";
    document.getElementById('displayText').style.display = 'flex';
  } else if(player.health > enemy.health){
    document.getElementById('displayText').innerHTML = "Player 2 Wins";
    document.getElementById('displayText').style.display = 'flex';
  }
}

let timer = 60;
let timerId;
function decreaseTimer(){
  if(timer > 0){
    timerId = setTimeout(decreaseTimer, 1000)
    timer--;
    document.getElementById('timer').innerHTML = timer;
  }
  if(timer == 0){
    determineWinner({player, enemy, timerId});
  }
}

decreaseTimer();

// function rectangularCollision({rectangle1, rectangle2}){
//   return{
//     rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
//     && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
//     && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
//     && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
//   };
// }

function rectangularCollision({rectangle1, rectangle2}) {
  const left1 = rectangle1.attackBox.position.x;
  const right1 = rectangle1.attackBox.position.x + rectangle1.attackBox.width;
  const top1 = rectangle1.attackBox.position.y;
  const bottom1 = rectangle1.attackBox.position.y + rectangle1.attackBox.height;

  const left2 = rectangle2.position.x;
  const right2 = rectangle2.position.x + rectangle2.width;
  const top2 = rectangle2.position.y;
  const bottom2 = rectangle2.position.y + rectangle2.height;

  return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
}

// let lastKey;

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillStyle = 'green';
  // ctx.fillRect(player.attackBox.position.x, player.attackBox.position.y, player.attackBox.width, player.attackBox.height);
  backgound.update();
  middleground.update();
  player.update();
  enemy.update()
  console.log('go');
  player.velocity.x = 0;
  if(keys.a.pressed && player.lastKey==='a'){
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if(keys.d.pressed && player.lastKey==='d'){
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  if(player.velocity.y < 0){
    player.switchSprite('jump');
  }
  if(player.isAttacking){
    player.switchSprite('attack');
    console.log(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }));
  }
  // enemy
  enemy.velocity.x = 0;
  if(keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump');
  }
  if(enemy.velocity.y > 0){
    enemy.switchSprite('fall');
  }

  if(enemy.isAttacking){
    enemy.switchSprite('attack');
    console.log(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }));
  }
  // collsion detection
  if(rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    })
    && player.isAttacking){
    player.isAttacking = false;
    console.log('hit');
    enemy.health -= 20;
    document.getElementById('enemyHealth').style.width = enemy.health + '%';
  }

  if(rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    })
    && enemy.isAttacking){
    enemy.isAttacking = false;
    console.log('hit');
    player.health -= 20;
    document.getElementById('playerHealth').style.width = player.health + '%';
  }

  /// end game
  if(enemy.health <= 0 || player.health <= 0){
    determineWinner({player, enemy, timerId});
  }
}

animate();

window.addEventListener('keydown', (event) =>{
  switch(event.key){
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
    break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
    break;
    case 'w':
      keys.w.pressed = true;
      // player.lastKey = 'w';
      player.velocity.y = -20;
    break;
    case ' ':
      player.attack();
    break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
    break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      // enemy.lastKey = 'ArrowUp';
      enemy.velocity.y = -20;
    break;
    case 'ArrowDown':
      enemy.attack();
    break;
  }
  console.log(event.key);
})

window.addEventListener('keyup', (event) =>{
  switch(event.key){
    case 'd':
      keys.d.pressed = false;
    break;
    case 'a':
      keys.a.pressed = false;
    break;
    case 'w':
      keys.w.pressed = false;
    break;
    // case ' ':
    //   player.attack();
    // break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
    break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
    break;
  }
  // console.log(event.key);
})
