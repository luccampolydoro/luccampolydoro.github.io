// ====== JOGO COM MENU NO CANVAS, REINÍCIO AUTOMÁTICO, PLACAR, SPRITES E VITÓRIA ======

const canvas = document.getElementById("canvas");
const pincel = canvas.getContext("2d");

// --------- CONSTANTES ---------
const WIDTH = 900;
const HEIGHT = 720;
const BOTAO = { x: 370, y: 500, width: 160, height: 60 };
const VOLTAR_MENU_DELAY_MS = 1200;

// --------- VARIÁVEIS DE JOGO ---------
let bg, bg2, flor, abelha, aranha;
const placar = new Text();
const perdeu = new Text();

let play = false;
let floresColetadas = 0;
let loopId = null;

let imagesCache = null;
let startImg = new Image();
let startLoaded = false;

let menuAtivo = true;
let reiniciando = false;
let vitoriaAtiva = false;

// --------- CARREGAMENTO DO START (MENU) ---------
startImg.src = "imagem/start.png";
startImg.onload = () => { startLoaded = true; };

// --------- PRÉ-CARREGAMENTO DE SPRITES ---------
function loadImages(urls) {
  const map = {};
  let loaded = 0;
  return new Promise((resolve, reject) => {
    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        map[url] = img;
        loaded++;
        if (loaded === urls.length) resolve(map);
      };
      img.onerror = () => reject(new Error("Erro ao carregar: " + url));
      img.src = url;
    });
  });
}

const assets = [
  "imagem/bg.png",
  "imagem/bee1.png", "imagem/bee2.png", "imagem/bee3.png", "imagem/bee4.png",
  "imagem/spider1.png", "imagem/spider2.png", "imagem/spider3.png", "imagem/spider4.png",
  "imagem/flower1.png",
  "imagem/youwin.png"
];

// --------- CONTROLES ---------
document.addEventListener("keydown", (e) => {
  if (!play || !abelha) return;
  if (e.key === "d" || e.key === "D") abelha.dir = 6;
  if (e.key === "a" || e.key === "A") abelha.dir = -6;
});

document.addEventListener("keyup", (e) => {
  if (!play || !abelha) return;
  if (e.key === "d" || e.key === "D") abelha.dir = 0;
  if (e.key === "a" || e.key === "A") abelha.dir = 0;
});

canvas.addEventListener("click", async (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (menuAtivo) {
    if (mx >= BOTAO.x && mx <= BOTAO.x + BOTAO.width &&
        my >= BOTAO.y && my <= BOTAO.y + BOTAO.height) {
      menuAtivo = false;
      reiniciando = false;
      vitoriaAtiva = false;
      await startGame();
    }
    return;
  }

  if (vitoriaAtiva) {
    if (mx >= BOTAO.x && mx <= BOTAO.x + BOTAO.width &&
        my >= BOTAO.y && my <= BOTAO.y + BOTAO.height) {
      voltarAoMenu();
    }
  }
});

// --------- MENU ---------
function desenharMenu() {
  pincel.clearRect(0, 0, WIDTH, HEIGHT);
  if (startLoaded) {
    pincel.drawImage(startImg, 0, 0, WIDTH, HEIGHT);
  } else {
    pincel.fillStyle = "black";
    pincel.fillRect(0, 0, WIDTH, HEIGHT);
  }
  pincel.fillStyle = "rgba(0,0,0,0.45)";
  pincel.fillRect(0, 0, WIDTH, HEIGHT);
  pincel.fillStyle = "white";
  pincel.font = "20px Arial";
  pincel.fillText("Mova com A / D. Desvie da aranha e colete flores!", 220, 340);
  pincel.fillStyle = "#22c55e";
  pincel.fillRect(BOTAO.x, BOTAO.y, BOTAO.width, BOTAO.height);
  pincel.fillStyle = "white";
  pincel.font = "28px Arial";
  pincel.fillText("Jogar", BOTAO.x + 40, BOTAO.y + 40);
}

// --------- TELA DE VITÓRIA ---------
function desenharVitoria() {
  pincel.clearRect(0, 0, WIDTH, HEIGHT);

  const imgWin = imagesCache?.["imagem/youwin.png"];
  if (imgWin && imgWin.complete) {
    pincel.drawImage(imgWin, 0, 0, WIDTH, HEIGHT);
  } else {
    pincel.fillStyle = "#0ea5e9";
    pincel.fillRect(0, 0, WIDTH, HEIGHT);
    pincel.fillStyle = "white";
    pincel.font = "48px Arial";
    pincel.fillText("VOCÊ VENCEU!", 300, 320);
  }

  pincel.fillStyle = "#f59e0b";
  pincel.fillRect(BOTAO.x, BOTAO.y, BOTAO.width, BOTAO.height);
  pincel.fillStyle = "#111";
  pincel.font = "28px Arial";
  pincel.fillText("Menu", BOTAO.x + 45, BOTAO.y + 40);
}

// --------- SISTEMAS ---------
function collides() {
  if (abelha.collide(aranha)) {
    aranha.mudaPosicao();
    abelha.lifes -= 1;
  }
  if (abelha.collide(flor)) {
    floresColetadas += 1;
    flor.mudaPosicao();
    if (floresColetadas >= 10) triggerVictory();
  }
}

function triggerVictory() {
  play = false;
  vitoriaAtiva = true;
  if (abelha) abelha.dir = 0;
}

function voltarAoMenu() {
  menuAtivo = true;
  vitoriaAtiva = false;
  reiniciando = false;
}

function gameover() {
  if (abelha.lifes <= 0) {
    play = false;
    if (!reiniciando) {
      reiniciando = true;
      setTimeout(() => {
        menuAtivo = true;
        vitoriaAtiva = false;
        if (abelha) abelha.dir = 0;
      }, VOLTAR_MENU_DELAY_MS);
    }
  }
}

function draw() {
  bg.desenha();
  bg2.desenha();

  if (play) {
    aranha.desenha();
    abelha.desenha();
    flor.desenha();
    placar.draw(`Vidas: ${abelha.lifes}   Flores: ${floresColetadas}`, 20, 40, "white");
  } else if (!menuAtivo && !vitoriaAtiva) {
    perdeu.draw("Game Over", 380, 380, "red");
  }
}

function update() {
  if (!play) return;
  bg.move(6, 720, 0);
  bg2.move(6, 0, -720);
  abelha.move();
  aranha.move();
  flor.move?.();
  abelha.animation();
  aranha.animation();
  collides();
  gameover();
}

function main() {
  pincel.clearRect(0, 0, WIDTH, HEIGHT);
  if (menuAtivo) desenharMenu();
  else if (vitoriaAtiva) desenharVitoria();
  else { update(); draw(); }
}

// --------- INICIALIZAÇÃO ---------
function initGame(images) {
  bg  = new Bg(0, 0, WIDTH, HEIGHT);
  bg2 = new Bg(0, -HEIGHT, WIDTH, HEIGHT);
  bg.setImage(images["imagem/bg.png"]);
  bg2.setImage(images["imagem/bg.png"]);

  abelha = new Abelha(450, 360, 100, 100);
  abelha.setFrames([
    images["imagem/bee1.png"],
    images["imagem/bee2.png"],
    images["imagem/bee3.png"],
    images["imagem/bee4.png"],
  ], 10);

  aranha = new Aranha(100, 100, 100, 100);
  aranha.setFrames([
    images["imagem/spider1.png"],
    images["imagem/spider2.png"],
    images["imagem/spider3.png"],
    images["imagem/spider4.png"],
  ], 10);

  flor = new Flor(0, 0, 50, 50);
  flor.setImage(images["imagem/flower1.png"]);

  floresColetadas = 0;
  abelha.lifes = 3;
  abelha.dir = 0;
  play = true;
  vitoriaAtiva = false;
}

// --------- START ---------
async function startGame() {
  try {
    if (!imagesCache) imagesCache = await loadImages(assets);
    initGame(imagesCache);
  } catch (err) {
    pincel.font = "20px Arial";
    pincel.fillStyle = "red";
    pincel.fillText("Erro ao carregar imagens: " + err.message, 20, 40);
  }
}

// --------- LOOP ---------
if (!loopId) loopId = setInterval(main, 8);
