// ====== CLASSES DO JOGO – Arquivo Classe (com sprites) ======

class Obj {
  constructor(x, y, width, height, Som = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.Som = Som;
    this.image = null;
    this.frames = null;
    this.frameIndex = 0;
    this.timer = 0;
    this.frameDelay = 10;
  }

  setImage(img) {
    this.image = img;
    this.frames = null;
  }

  setFrames(imgArray, frameDelay = 10) {
    this.frames = imgArray;
    this.image = null;
    this.frameIndex = 0;
    this.frameDelay = frameDelay;
  }

  desenha() {
    if (this.frames && this.frames.length > 0) {
      const img = this.frames[this.frameIndex];
      if (img && img.complete) pincel.drawImage(img, this.x, this.y, this.width, this.height);
      return;
    }
    if (this.image && this.image.complete) pincel.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  animation() {
    if (!this.frames || this.frames.length <= 1) return;
    this.timer += 1;
    if (this.timer > this.frameDelay) {
      this.timer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
  }
}

class Abelha extends Obj {
  dir = 0;
  lifes = 3;
  move() {
    this.x += this.dir;
    this.x = Math.max(0, Math.min(this.x, 900 - this.width));
  }
  collide(obj) {
    if (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < obj.y + obj.height &&
      this.y + this.height > obj.y
    ) {
      if (this.Som) {
        const Som = new Audio();
        Som.src = this.Som;
        Som.play().catch(() => {});
      }
      return true;
    }
    return false;
  }
}

class Aranha extends Obj {
  move() {
    this.y += 6;
    if (this.y > 900) {
      this.y = -50;
      this.x = Math.random() * (600 - 0);
    }
  }
  mudaPosicao() {
    this.y = -50;
    this.x = Math.random() * (600 - 0);
  }
}

class Bg extends Obj {
  move(speed, limit, pos) {
    this.y += speed;
    if (this.y > limit) this.y = pos;
  }
}

class Flor extends Aranha {
  mudaPosicao() {
    this.y = -50;
    this.x = Math.random() * (600 - 0);
  }
}

class Text {
  draw(texto, x, y, cor = "white") {
    pincel.font = "20px Arial";
    pincel.fillStyle = cor;
    pincel.fillText(texto, x, y);
  }
}
