// Dados dos desafios
const desafios = [
  { nome: "Conta GitHub", cor: "#FF6B6B" },
  { nome: "Criar Repositório", cor: "#4ECDC4" },
  { nome: "Publicar em Deploy", cor: "#FFD93D" },
  { nome: "Trabalho", cor: "#6A4C93" },
  { nome: "Contador", cor: "#FF8C42" },
  { nome: "Lista de Tarefas", cor: "#6BCB77" },
  { nome: "Contador React", cor: "#1982C4" },
];

// Dados dos estudantes
const estudantes = [
  {
    nome: "Mayara",
    pontos: 1,
    github: "mayaracaximbo",
    programa: "TIDS LAB",
    desafios: ["Conta GitHub"],
  },
  {
    nome: "Gabriel",
    pontos: 1,
    github: "gabriel-bugalho",
    programa: "TIDS LAB",
    desafios: ["Conta GitHub"],
  },
  {
    nome: "Gabriel",
    pontos: 1,
    github: "lucaspachecotexeira",
    programa: "TIDS LAB",
    desafios: ["Conta GitHub"],
  },
];

// Funções para a roleta
function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M${x} ${y} L${start.x} ${start.y} A${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

// Renderiza a roleta
function renderDesafios() {
  const svg = document.getElementById("desafios");
  const center = { x: 70, y: 70 };
  const radius = 70;
  const total = desafios.length;

  desafios.forEach((d, i) => {
    const startAngle = (i * 360) / total;
    const endAngle = ((i + 1) * 360) / total;

    // fatia
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeArc(center.x, center.y, radius, startAngle, endAngle));
    path.setAttribute("fill", d.cor);
    path.style.transform = "scale(0)";
    path.style.transition = "transform 0.5s ease-out";
    setTimeout(() => { path.style.transform = "scale(1)"; }, i * 150);
    svg.appendChild(path);

    // texto da fatia
    const pos = polarToCartesian(center.x, center.y, radius * 0.6, (startAngle + endAngle) / 2);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", pos.x);
    text.setAttribute("y", pos.y);
    text.setAttribute("font-size", "5.5"); // ajuste para caber mais fatias
    text.setAttribute("fill", "#fff");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.textContent = d.nome;
    svg.appendChild(text);
  });
}

// Renderiza estudantes
function renderEstudantes() {
  const container = document.getElementById("estudantes");
  estudantes.forEach((s, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.2}s`;

    const img = document.createElement("img");
    img.src = `https://github.com/${s.github}.png`;
    img.alt = s.nome;

    const nome = document.createElement("h3");
    nome.textContent = s.nome;

    const pontos = document.createElement("p");
    pontos.textContent = `Pontos: ${s.pontos}`;

    const programa = document.createElement("p");
    programa.className = "programa";
    programa.textContent = `Programa: ${s.programa}`;

    const github = document.createElement("p");
    github.innerHTML = `GitHub: <a href="https://github.com/${s.github}" target="_blank" style="color:#FFD93D">${s.github}</a>`;

    const listaDesafios = document.createElement("ul");
    listaDesafios.className = "desafios";
    s.desafios.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      listaDesafios.appendChild(li);
    });

    card.append(img, nome, pontos, programa, github, listaDesafios);
    container.appendChild(card);
  });
}

// Animação título TIDS
function animateTitulo() {
  const titulo = document.getElementById("titulo");
  const letters = Array.from(titulo.textContent);
  titulo.textContent = "";
  letters.forEach(letter => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.display = "inline-block";
    titulo.appendChild(span);
  });

  setInterval(() => {
    const spans = titulo.querySelectorAll("span");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.transform = "translateY(-10px)";
        setTimeout(() => { span.style.transform = "translateY(0)"; }, 60);
      }, i * (60 / spans.length));
    });
  }, Math.random() * 5000 + 5000);
}

// Inicializa tudo
renderDesafios();
renderEstudantes();
animateTitulo();
