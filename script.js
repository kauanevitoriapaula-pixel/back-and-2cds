// Elementos da página
const tabuleiro = document.getElementById("tabuleiro");
const jogadasTexto = document.getElementById("jogadas");
const paresTexto = document.getElementById("pares");
const mensagem = document.getElementById("mensagem");
const botaoReiniciar = document.getElementById("reiniciar");

// Símbolos do jogo
const simbolos = [
  { desenho: "♡", nome: "coração" },
  { desenho: "☁", nome: "nuvem" },
  { desenho: "✿", nome: "flor" },
  { desenho: "★", nome: "estrela" },
  { desenho: "☾", nome: "lua" },
  { desenho: "♫", nome: "notas musicais" }
];

// Estado da partida
let primeiraCarta = null;
let bloqueado = false;
let jogadas = 0;
let pares = 0;
let temporizador = null;

// Embaralha as cartas
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [lista[i], lista[j]] = [lista[j], lista[i]];
  }

  return lista;
}

// Esconde o símbolo de uma carta
function esconderCarta(carta) {
  carta.textContent = "✧";
  carta.classList.remove("aberta");

  carta.setAttribute(
    "aria-label",
    "Carta " + carta.dataset.posicao + ", fechada"
  );

  carta.setAttribute("aria-pressed", "false");
}

// Revela uma carta e verifica se há um par
function virarCarta(carta, simbolo) {
  if (
    bloqueado ||
    carta === primeiraCarta ||
    carta.disabled
  ) {
    return;
  }

  carta.textContent = simbolo.desenho;
  carta.classList.add("aberta");

  carta.setAttribute(
    "aria-label",
    "Carta " + carta.dataset.posicao + ": " + simbolo.nome
  );

  carta.setAttribute("aria-pressed", "true");

  // Aguarda a segunda carta
  if (primeiraCarta === null) {
    primeiraCarta = carta;
    return;
  }

  jogadas++;
  jogadasTexto.textContent = jogadas;

  const cartaAnterior = primeiraCarta;
  primeiraCarta = null;

  // Verifica se as duas cartas formam um par
  if (cartaAnterior.dataset.simbolo === carta.dataset.simbolo) {
    [cartaAnterior, carta].forEach(function (item) {
      item.classList.remove("aberta");
      item.classList.add("par");
      item.disabled = true;

      item.setAttribute(
        "aria-label",
        item.getAttribute("aria-label") + ", par encontrado"
      );
    });

    pares++;
    paresTexto.textContent = pares;

    if (pares === simbolos.length) {
      mensagem.textContent =
        "Parabéns! Você encontrou todos os pares em " +
        jogadas +
        " jogadas! ♡";
    } else {
      mensagem.textContent =
        "Um par encontrado! Continue assim. ♡";
    }
  } else {
    // Bloqueia novas escolhas durante um segundo
    bloqueado = true;

    mensagem.textContent =
      "Ainda não foi um par. Tente novamente!";

    temporizador = setTimeout(function () {
      esconderCarta(cartaAnterior);
      esconderCarta(carta);

      bloqueado = false;
      temporizador = null;
    }, 1000);
  }
}

// Inicia ou reinicia o jogo
function iniciarJogo() {
  clearTimeout(temporizador);

  temporizador = null;
  primeiraCarta = null;
  bloqueado = false;
  jogadas = 0;
  pares = 0;

  jogadasTexto.textContent = "0";
  paresTexto.textContent = "0";
  mensagem.textContent = "Encontre um par para começar. ♡";

  // Remove as cartas da partida anterior
  tabuleiro.replaceChildren();

  // Duplica os símbolos para criar seis pares
  const cartas = embaralhar([...simbolos, ...simbolos]);

  cartas.forEach(function (simbolo, indice) {
    const carta = document.createElement("button");

    carta.type = "button";
    carta.className = "carta";
    carta.dataset.simbolo = simbolo.nome;
    carta.dataset.posicao = indice + 1;

    esconderCarta(carta);

    carta.addEventListener("click", function () {
      virarCarta(carta, simbolo);
    });

    tabuleiro.appendChild(carta);
  });
}

// Botão de recomeçar
botaoReiniciar.addEventListener("click", iniciarJogo);

// Ano automático no rodapé
document.getElementById("ano").textContent =
  new Date().getFullYear();

// Inicia a primeira partida
iniciarJogo();