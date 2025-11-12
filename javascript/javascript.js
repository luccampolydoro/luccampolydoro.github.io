/* =============================
   Menu lateral e preferências
   ============================= */

// Abre a sidebar (menu)
function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const main = document.getElementById("main");
  if (sidebar) sidebar.style.left = "0";
  if (main) main.style.marginLeft = "250px";
}

// Fecha a sidebar (menu)
function closeNav() {
  const sidebar = document.getElementById("mySidebar");
  const main = document.getElementById("main");
  if (sidebar) sidebar.style.left = "-250px";
  if (main) main.style.marginLeft = "0";
}

// Troca a família de fontes do site
function mudarFonte(fonte) {
  const pagina = document.getElementById("pagina");
  if (pagina) pagina.style.fontFamily = fonte;
}

/* =============================
   Dados do carrossel
   =============================
   Campos:
   - src: caminho da imagem
   - titulo: legenda/tooltip
   - data: data exibida no pop-up
   - descricao: descrição do projeto
   - largura/altura: tamanho no pop-up
   - link (opcional): se presente, navega para a página (sem pop-up)
*/

const imagens = [
  {
    src: "imagem/canal.png",
        titulo: "Canal de Star Coiny Animations",
        data: "2020",
        descricao: "Projecto de Crossover",
        largura: "600px",
        altura: "auto"
      },
      {
        src: "imagem/1.png",
        titulo: "Archetype",
        data: "2025",
        descricao: "Projeto conclusão de curso.",
        largura: "500px",
        altura: "auto"
      },
      {
        src: "imagem/2.png",
        titulo: "Jogo do espaço",
        data: "2024",
        descricao: "Projeto da disciplina de programação de jogos digitais.",
        largura: "50%",
        altura: "auto"
      },
  // ====== Item integrado: Jogo da Abelha ======
  {
    // se não possuir bee_thumb.png, pode usar "imagem/start.png"
    src: "imagem/youwin.png",
    titulo: "Jogo da Abelha",
    data: "Novembro de 2025",
    descricao: "Mini-game em Canvas. Use A/D para mover, desvie da aranha e colete 10 flores.",
    largura: "400px",
    altura: "auto",
    link: "jogo.html" // abre a página do jogo
  }
];

/* =============================
   Lógica do carrossel
   ============================= */

let indiceAtual = 0;
const imagensPorTela = 3;

// Renderiza as imagens do carrossel (se o carrossel existir na página)
function exibirImagens() {
  const container = document.getElementById("carrossel-imagens");
  if (!container) return; // Página sem carrossel (ex.: jogo-abelha.html)

  container.innerHTML = "";

  for (let i = 0; i < imagensPorTela; i++) {
    const index = (indiceAtual + i) % imagens.length;
    const imagemInfo = imagens[index];

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";

    const img = document.createElement("img");
    img.src = imagemInfo.src;
    img.alt = imagemInfo.titulo;
    img.title = imagemInfo.descricao;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", imagemInfo.titulo);
    img.style.cursor = "pointer";
    img.loading = "lazy";
    img.decoding = "async";
    img.tabIndex = 0; // acessível via teclado

    const abrirItem = () => {
      if (imagemInfo.link) {
        window.location.href = imagemInfo.link;
        return;
      }

      const popup = window.open(
        "",
        `popup${index}`,
        "width=850,height=700,resizable=yes,scrollbars=yes"
      );

      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>${imagemInfo.titulo}</title>
              <meta charset="UTF-8" />
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                img { width: ${imagemInfo.largura}; height: ${imagemInfo.altura}; border-radius: 8px; display: block; margin-bottom: 15px; }
                h1 { margin-top: 0; }
                .info { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <h1>${imagemInfo.titulo}</h1>
              <div class="info"><strong>Data de criação:</strong> ${imagemInfo.data}</div>
              <img src="${imagemInfo.src}" alt="${imagemInfo.titulo}">
              <p><strong>Descrição:</strong> ${imagemInfo.descricao}</p>
            </body>
          </html>
        `);
        popup.document.close();
        popup.focus();
      } else {
        alert("Por favor, permita pop-ups para visualizar as informações.");
      }
    };

    // Clique do mouse
    img.onclick = abrirItem;

    // Ativação por teclado (Enter/Espaço)
    img.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        abrirItem();
      }
    });

    const caption = document.createElement("small");
    caption.textContent = imagemInfo.titulo;
    caption.style.display = "block";
    caption.style.textAlign = "center";
    caption.style.marginTop = "6px";

    wrapper.appendChild(img);
    wrapper.appendChild(caption);
    container.appendChild(wrapper);
  }
}

// Avança ou retrocede o carrossel
function mudarImagens(direcao) {
  // Se a página não tiver carrossel, não faz nada
  if (!document.getElementById("carrossel-imagens")) return;

  // Gira páginas inteiras (em blocos de N imagens)
  indiceAtual = (indiceAtual + direcao * imagensPorTela + imagens.length) % imagens.length;
  exibirImagens();
}

/* =============================
   Inicialização segura
   ============================= */

document.addEventListener("DOMContentLoaded", () => {
  // Só tenta montar o carrossel se ele existir nesta página
  if (document.getElementById("carrossel-imagens")) {
    exibirImagens();
  }
});
