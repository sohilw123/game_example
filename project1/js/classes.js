class Background {
  constructor({position, imageSrc}){
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw(){
    // ctx.drawImage(this.image, this.position.x, this.position.y);
    ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
  }

  update() {
    this.draw();
  }
}

class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({position, velocity, color, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites, attackBox = {offset, width, height}}){
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      // image
    });
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.image = new Image();
    this.image.src = imageSrc;
    // this.image = new Image();

    for(const sprite in this.sprites){
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  draw() {
    // ctx.drawImage(
    //   this.image,
    //   this.framesCurrent * (this.image.width / this.framesMax),
    //   0,
    //   this.image.width / this.framesMax,
    //   this.image.height,
    //   this.position.x - this.offset.x,
    //   this.position.y - this.offset.y,
    //   (this.image.width / this.framesMax) * this.scale,
    //   this.image.height * this.scale
    // )
    ctx.drawImage(
      this.image,
      0,
      this.framesCurrent * (this.image.height / this.framesMax),
      this.image.width,
      this.image.height  / this.framesMax,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width) * this.scale,
      (this.image.height/ this.framesMax) * this.scale
    )
    // console.log('drawing');
  }

  update() {
    this.draw();
    super.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    ctx.fillStyle = "green";
    // ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    ctx.fillStyle = "blue";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack(){
    this.isAttacking = true;
    setTimeout(() => {
      console.log('attack');
      this.isAttacking = false;
    }, 100)
  }

  takeHit() {
    this.health -= 20

    if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    // console.log(this.image);
    // console.log(this.sprites.death.image);
    // console.log('ran');
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break
    }
  }
}

//

class Fighter2 extends Sprite {
  constructor({position, velocity, color, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 }, sprites, attackBox = {offset, width, height}}){
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      // image
    });
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.image = new Image();
    this.image.src = imageSrc;
    // this.offset = offset;
    // this.offset = offset;
    // this.image = new Image();

    for(const sprite in this.sprites){
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  // draw(){
  //   ctx.save(); // save the current canvas context state
  //   ctx.scale(-1, 1); // flip horizontally
  //   ctx.drawImage(
  //   this.image,
  //   this.framesCurrent * (this.image.width / this.framesMax),
  //   0,
  //   this.image.width / this.framesMax,
  //   this.image.height,
  //   -(this.position.x + this.offset.x + (this.image.width / this.framesMax) * this.scale), // negate x position and offset
  //   this.position.y - this.offset.y,
  //   (this.image.width / this.framesMax) * this.scale,
  //   this.image.height * this.scale
  //   );
  //   ctx.restore(); // restore the canvas context state
  // }

  // draw() {
  //   ctx.drawImage(
  //     this.image,
  //     this.framesCurrent * (this.image.width / this.framesMax),
  //     0,
  //     this.image.width / this.framesMax,
  //     this.image.height,
  //     this.position.x - this.offset.x,
  //     this.position.y - this.offset.y,
  //     (this.image.width / this.framesMax) * this.scale,
  //     this.image.height * this.scale
  //   )
  //   // ctx.drawImage(
  //   //   this.image,
  //   //   0,
  //   //   this.framesCurrent * (this.image.height / this.framesMax),
  //   //   this.image.width,
  //   //   this.image.height  / this.framesMax,
  //   //   this.position.x - this.offset.x,
  //   //   this.position.y - this.offset.y,
  //   //   (this.image.width) * this.scale,
  //   //   (this.image.height/ this.framesMax) * this.scale
  //   // )
  //   // console.log('drawing');
  // }

  update() {
    this.draw();
    super.animateFrames();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    ctx.fillStyle = "green";
    // ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    ctx.fillStyle = "red";
    /// ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack(){
    this.isAttacking = true;
    setTimeout(() => {
      console.log('attack');
      this.isAttacking = false;
    }, 100)
  }

  takeHit() {
    this.health -= 20

    if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    // console.log(this.image);
    // console.log(this.sprites.death.image);
    // console.log('ran');
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return
    }

    // overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack.image &&
      this.framesCurrent < this.sprites.attack.framesMax - 1
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'attack':
        if (this.image !== this.sprites.attack.image) {
          this.image = this.sprites.attack.image;
          this.framesMax = this.sprites.attack.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break
    }
  }
}
// test code
/*
class Fighter extends Sprite {
  constructor({position, velocity, color, offset}){
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastkey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 50
    }
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = 'yellow';
    if(this.isAttacking){
        ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
    // ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack(){
    this.isAttacking = true;
    setTimeout(() => {
      console.log('attack');
      this.isAttacking = false;
    }, 100)
  }
}

*/
