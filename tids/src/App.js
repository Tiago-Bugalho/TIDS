import React, { useEffect, useState } from "react";

function App() {
  const desafios = [
    { nome: "Conta GitHub", cor: "#FF6B6B" },
    { nome: "Criar Repositório", cor: "#4ECDC4" },
    { nome: "Publicar em Deploy", cor: "#FFD93D" },
    { nome: "Trabalho", cor: "#6A4C93" },
  ];

  const students = [
    {
      nome: "Tiago",
      pontos: 7,
      github: "tiago-bugalho",
      programa: "TIDS PRO",
      desafios: ["Conta GitHub", "Criar Repositório", "Publicar em Deploy", "Trabalho"],
    },
    {
      nome: "Gabriel",
      pontos: 1,
      github: "gabriel-bugalho",
      programa: "TIDS LAB",
      desafios: ["Conta GitHub"],
    },
  ];

  const radius = 70;
  const center = { x: 70, y: 70 };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M${x} ${y} L${start.x} ${start.y} A${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const textPosition = (startAngle, endAngle) => {
    const angle = (startAngle + endAngle) / 2;
    return polarToCartesian(center.x, center.y, radius * 0.6, angle);
  };

  const [loaded, setLoaded] = useState(false);
  const [jumping, setJumping] = useState([false, false, false, false]);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);

    const wave = () => {
      const newJump = [false, false, false, false];
      setJumping([...newJump]);

      const duration = 60;
      const letterCount = 4;
      const delay = duration / letterCount;

      for (let i = 0; i < letterCount; i++) {
        setTimeout(() => {
          newJump[i] = true;
          setJumping([...newJump]);
          setTimeout(() => {
            newJump[i] = false;
            setJumping([...newJump]);
          }, delay);
        }, i * delay);
      }
    };

    wave();
    const interval = setInterval(() => wave(), Math.random() * 5000 + 5000);
    return () => clearInterval(interval);
  }, []);

  const title = ["T", "I", "D", "S"];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Programas */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginTop: "20px",
          marginBottom: "10px",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2em",
          textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
          letterSpacing: "1px",
        }}
      >
        <span>TIDS PRO</span>
        <span>TIDS LAB</span>
        <span>TIDS KIDS</span>
      </div>

      {/* Título principal */}
      <h1
        style={{
          marginTop: "10px",
          marginBottom: "40px",
          color: "#fff",
          fontSize: "3em",
          textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {title.map((letter, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              transition: "transform 0.03s",
              transform: jumping[index] ? "translateY(-10px)" : "translateY(0)",
            }}
          >
            {letter}
          </span>
        ))}
      </h1>

      {/* Círculo dos desafios */}
      <div
        id="desafios"
        style={{
          display: "inline-block",
          transform: loaded ? "scale(1)" : "scale(0.5)",
          opacity: loaded ? 1 : 0,
          transition: "all 1s ease",
          marginBottom: "50px",
        }}
      >
        <svg width="350" height="350" viewBox="0 0 140 140">
          {desafios.map((d, i) => {
            const startAngle = i * 90;
            const endAngle = (i + 1) * 90;
            const pos = textPosition(startAngle, endAngle);
            return (
              <React.Fragment key={i}>
                <path
                  d={describeArc(center.x, center.y, radius, startAngle, endAngle)}
                  fill={d.cor}
                  style={{
                    transformOrigin: "50% 50%",
                    transform: loaded ? "scale(1)" : "scale(0)",
                    transition: `transform 0.8s ease ${i * 0.2}s`,
                  }}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  fontSize="6"
                  fill="#fff"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontWeight="bold"
                  style={{
                    opacity: loaded ? 1 : 0,
                    transition: `opacity 1s ease ${i * 0.3 + 0.5}s`,
                  }}
                >
                  {d.nome}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>

      {/* Estudante */}
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>Estudantes</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {students.map((s, index) => (
          <div
            key={index}
            style={{
              background: "#1e3c72",
              color: "#fff",
              borderRadius: "10px",
              padding: "15px",
              width: "200px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src={`https://github.com/${s.github}.png`}
              alt={s.nome}
              style={{
                width: "80px",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            />
            <h3>{s.nome}</h3>
            <p>Pontos: {s.pontos}</p>
            <p style={{ color: "#FFD93D", fontWeight: "bold" }}>
              Programa: {s.programa}
            </p>
            <p>
              GitHub:{" "}
              <a
                href={`https://github.com/${s.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#FFD93D" }}
              >
                {s.github}
              </a>
            </p>
            <div>
              <h4>Desafios:</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {s.desafios.map((d, i) => (
                  <li
                    key={i}
                    style={{
                      background: "#4ECDC4",
                      margin: "3px 0",
                      borderRadius: "5px",
                      padding: "3px",
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
