const express = require("express");

const app = express();
app.use(express.json());

let dados = {
  estado: "EM ESPERA",
  esp32: "ONLINE",
  objectoDetectado: true,

  total: 18,
  aprovados: 15,
  recusados: 3,

  altura: 8.4,
  limiteAltura: 10.0,

  temperatura: 27.4,
  humidade: 61,

  vibracao: "NORMAL",
  alerta: "NENHUM",

  ultimaActividade: "Objecto aprovado",
  horaActividade: "02:31:08"
};

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Monitorização da Esteira</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #07111f;
  color: white;
}

header {
  padding: 22px;
  background: #0b1728;
  border-bottom: 1px solid #1d3048;
}

.header {
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

h1 {
  margin: 0;
  font-size: 26px;
}

.subtitle {
  color: #8fa4bd;
  margin-top: 6px;
  font-size: 14px;
}

.online {
  background: #123c32;
  color: #45e0a3;
  padding: 9px 14px;
  border-radius: 20px;
  font-size: 13px;
  white-space: nowrap;
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 25px;
}

.section-title {
  color: #8fa4bd;
  font-size: 13px;
  margin: 25px 0 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.main-status {
  background: #0d1d31;
  border: 1px solid #1d3048;
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 15px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.card {
  background: #0d1d31;
  border: 1px solid #1d3048;
  border-radius: 16px;
  padding: 20px;
}

.card-title {
  color: #8fa4bd;
  font-size: 13px;
  margin-bottom: 12px;
}

.value {
  font-size: 30px;
  font-weight: bold;
}

.small {
  font-size: 16px;
  color: #8fa4bd;
  margin-top: 6px;
}

.green {
  color: #45e0a3;
}

.red {
  color: #ff667a;
}

.yellow {
  color: #ffc857;
}

.blue {
  color: #61b8ff;
}

.production {
  text-align: center;
}

.production .value {
  font-size: 38px;
}

.height-box {
  margin-top: 12px;
}

.bar {
  width: 100%;
  height: 12px;
  background: #182b42;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 15px;
}

.bar-fill {
  height: 100%;
  width: 84%;
  background: #61b8ff;
  border-radius: 20px;
}

.activity {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #1d3048;
  padding: 12px 0;
}

.activity:last-child {
  border-bottom: none;
}

.activity-time {
  color: #71869e;
  font-size: 13px;
}

.session {
  text-align: center;
  margin-top: 30px;
}

button {
  background: #61b8ff;
  border: none;
  padding: 13px 22px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.footer {
  text-align: center;
  color: #60758c;
  font-size: 12px;
  padding: 25px;
}

@media (max-width: 750px) {

  .grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  h1 {
    font-size: 22px;
  }

}

</style>
</head>

<body>

<header>

<div class="header">

<div>
<h1>Monitorização da Esteira</h1>
<div class="subtitle">
Sistema de monitorização e manutenção preventiva
</div>
</div>

<div class="online">
● ESP32 ONLINE
</div>

</div>

</header>

<div class="container">

<div class="section-title">
Estado da esteira
</div>

<div class="main-status green" id="estado">
EM ESPERA
</div>

<div class="grid">

<div class="card">
<div class="card-title">Objecto na entrada</div>
<div class="value green" id="objecto">SIM</div>
</div>

<div class="card">
<div class="card-title">Situação do objecto</div>
<div class="value green" id="situacao">APROVADO</div>
</div>

<div class="card">
<div class="card-title">Última actualização</div>
<div class="value" id="actualizacao">1 s</div>
</div>

</div>


<div class="section-title">
Produção da sessão
</div>

<div class="grid">

<div class="card production">
<div class="card-title">TOTAL</div>
<div class="value blue" id="total">18</div>
</div>

<div class="card production">
<div class="card-title">APROVADOS</div>
<div class="value green" id="aprovados">15</div>
</div>

<div class="card production">
<div class="card-title">RECUSADOS</div>
<div class="value red" id="recusados">3</div>
</div>

</div>


<div class="section-title">
Inspecção do objecto
</div>

<div class="card">

<div class="card-title">
ALTURA DO OBJECTO
</div>

<div class="value">
<span id="altura">8.4</span> cm
</div>

<div class="small">
Limite: <span id="limite">10.0</span> cm
</div>

<div class="bar">
<div class="bar-fill" id="barra"></div>
</div>

</div>


<div class="section-title">
Monitorização
</div>

<div class="grid">

<div class="card">
<div class="card-title">TEMPERATURA</div>
<div class="value" id="temperatura">27.4 °C</div>
</div>

<div class="card">
<div class="card-title">HUMIDADE</div>
<div class="value" id="humidade">61 %</div>
</div>

<div class="card">
<div class="card-title">VIBRAÇÃO</div>
<div class="value green" id="vibracao">NORMAL</div>
</div>

</div>


<div class="section-title">
Alertas
</div>

<div class="card">

<div class="value green" id="alerta">
NENHUM
</div>

</div>


<div class="section-title">
Actividade recente
</div>

<div class="card">

<div class="activity">
<span>Objecto detectado</span>
<span class="activity-time">02:31:04</span>
</div>

<div class="activity">
<span>Altura medida: 8.4 cm</span>
<span class="activity-time">02:31:05</span>
</div>

<div class="activity">
<span>Objecto aprovado</span>
<span class="activity-time">02:31:06</span>
</div>

<div class="activity">
<span>Objecto saiu da zona de inspecção</span>
<span class="activity-time">02:31:08</span>
</div>

</div>


<div class="session">

<button onclick="novaSessao()">
↻ NOVA SESSÃO
</button>

</div>

</div>

<div class="footer">
Esteira Transportadora Automatizada · Monitorização em tempo real
</div>


<script>

async function actualizar() {

  try {

    const resposta = await fetch("/api/dados");

    const d = await resposta.json();

    document.getElementById("estado").textContent = d.estado;

    document.getElementById("objecto").textContent =
      d.objectoDetectado ? "SIM" : "NÃO";

    document.getElementById("total").textContent = d.total;

    document.getElementById("aprovados").textContent = d.aprovados;

    document.getElementById("recusados").textContent = d.recusados;

    document.getElementById("altura").textContent =
      Number(d.altura).toFixed(1);

    document.getElementById("limite").textContent =
      Number(d.limiteAltura).toFixed(1);

    document.getElementById("temperatura").textContent =
      Number(d.temperatura).toFixed(1) + " °C";

    document.getElementById("humidade").textContent =
      d.humidade + " %";

    document.getElementById("vibracao").textContent =
      d.vibracao;

    document.getElementById("alerta").textContent =
      d.alerta;

  } catch (erro) {

    console.log("Erro ao actualizar:", erro);

  }

}

async function novaSessao() {

  if (!confirm("Iniciar uma nova sessão e zerar os contadores?")) {
    return;
  }

  await fetch("/api/nova-sessao", {
    method: "POST"
  });

  actualizar();

}

actualizar();

setInterval(actualizar, 2000);

</script>

</body>
</html>
  `);
});


app.get("/api/dados", (req, res) => {

  res.json(dados);

});


app.post("/api/dados", (req, res) => {

  dados = {
    ...dados,
    ...req.body
  };

  res.json({
    sucesso: true,
    dados: dados
  });

});


app.post("/api/nova-sessao", (req, res) => {

  dados.total = 0;
  dados.aprovados = 0;
  dados.recusados = 0;

  dados.alerta = "NENHUM";

  res.json({
    sucesso: true
  });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Servidor iniciado na porta " + PORT);

});
