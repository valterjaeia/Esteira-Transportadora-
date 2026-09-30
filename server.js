const express = require("express");

const app = express();
app.use(express.json());

const ADMIN_PIN = process.env.ADMIN_PIN || "1234";

let dados = {
  estado: "EM ESPERA",
  esp32: "ONLINE",
  objectoDetectado: false,

  total: 0,
  aprovados: 0,
  recusados: 0,

  altura: 0,
  limiteAltura: 10.0,

  temperatura: 0,
  humidade: 0,

  vibracao: "NORMAL",
  alerta: "NENHUM",
  situacao: "AGUARDANDO",

  actividades: []
};

function registarActividade(texto) {
  const agora = new Date().toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  dados.actividades.unshift({
    texto: texto,
    hora: agora
  });

  dados.actividades = dados.actividades.slice(0, 5);
}

app.get("/", (req, res) => {

  res.send(`

<!DOCTYPE html>

<html lang="pt">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

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
  background: #0b1728;
  border-bottom: 1px solid #1d3048;
  padding: 18px 22px;
}

.header {
  max-width: 1180px;
  margin: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 15px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.subtitle {
  margin-top: 5px;
  color: #8fa4bd;
  font-size: 13px;
}

.status-top {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 12px;
  border-radius: 18px;

  background: #123c32;
  color: #45e0a3;

  font-size: 12px;
  font-weight: bold;
}

.badge.waiting {
  background: #273143;
  color: #a9b7c8;
}

.container {
  max-width: 1180px;
  margin: auto;
  padding: 18px;
}

.section-title {
  color: #7890aa;

  font-size: 11px;

  text-transform: uppercase;

  letter-spacing: 1.2px;

  margin: 12px 0 8px;
}

.grid {
  display: grid;
  gap: 10px;
}

.main-grid {
  grid-template-columns: 1.2fr 1fr;
}

.production-grid {
  grid-template-columns: repeat(3, 1fr);
}

.monitor-grid {
  grid-template-columns: repeat(4, 1fr);
}

.card {
  background: #0d1d31;

  border: 1px solid #1d3048;

  border-radius: 12px;

  padding: 15px;
}

.card-title {
  color: #8fa4bd;

  font-size: 11px;

  text-transform: uppercase;

  margin-bottom: 9px;
}

.big {
  font-size: 27px;
  font-weight: bold;
}

.medium {
  font-size: 20px;
  font-weight: bold;
}

.small {
  color: #8fa4bd;
  font-size: 13px;
  margin-top: 5px;
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

.object-card {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
}

.object-state {
  font-size: 25px;
  font-weight: bold;
}

.height-value {
  font-size: 27px;
  font-weight: bold;
}

.bar {
  height: 9px;

  background: #182b42;

  border-radius: 20px;

  overflow: hidden;

  margin-top: 12px;
}

.bar-fill {
  height: 100%;

  width: 0%;

  background: #61b8ff;

  border-radius: 20px;

  transition: width .25s;
}

.production {
  text-align: center;
}

.production .value {
  font-size: 32px;
  font-weight: bold;
}

.monitor {
  text-align: center;
}

.activity-list {
  display: grid;
  gap: 0;
}

.activity {
  display: flex;

  justify-content: space-between;

  gap: 15px;

  padding: 9px 0;

  border-bottom: 1px solid #1d3048;

  font-size: 13px;
}

.activity:last-child {
  border-bottom: none;
}

.activity-time {
  color: #71869e;

  white-space: nowrap;
}

.controls {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
}

button {
  border: 0;

  border-radius: 8px;

  padding: 10px 15px;

  cursor: pointer;

  font-weight: bold;

  background: #61b8ff;

  color: #06111d;
}

button.secondary {
  background: #1b2c42;
  color: white;
}

button:hover {
  opacity: .9;
}

.footer {
  text-align: center;

  color: #60758c;

  font-size: 11px;

  padding: 15px;
}

.modal {
  display: none;

  position: fixed;

  inset: 0;

  background: rgba(0,0,0,.65);

  align-items: center;

  justify-content: center;

  padding: 20px;
}

.modal-box {
  width: min(380px, 100%);

  background: #0d1d31;

  border: 1px solid #29415f;

  border-radius: 14px;

  padding: 20px;
}

input {
  width: 100%;

  padding: 11px;

  margin: 7px 0 12px;

  border-radius: 8px;

  border: 1px solid #304967;

  background: #07111f;

  color: white;

  font-size: 16px;
}

.modal-actions {
  display: flex;

  gap: 8px;

  justify-content: flex-end;
}

.error {
  color: #ff667a;

  font-size: 13px;

  min-height: 18px;
}

@media (max-width: 800px) {

  .header {
    align-items: flex-start;

    flex-direction: column;
  }

  .main-grid,
  .monitor-grid {
    grid-template-columns: 1fr 1fr;
  }

}

@media (max-width: 520px) {

  .main-grid,
  .production-grid,
  .monitor-grid {
    grid-template-columns: 1fr;
  }

  .object-card,
  .controls {
    align-items: flex-start;

    flex-direction: column;
  }

}

</style>

</head>

<body>

<header>

<div class="header">

<div>

<h1>Esteira Transportadora</h1>

<div class="subtitle">
Monitorização e manutenção preventiva
</div>

</div>

<div class="status-top">

<div class="badge" id="esp32">
● ESP32 ONLINE
</div>

<div class="badge waiting" id="estado">
● EM ESPERA
</div>

</div>

</div>

</header>


<div class="container">


<div class="section-title">
Estado actual
</div>


<div class="grid main-grid">


<div class="card object-card">

<div>

<div class="card-title">
Objecto na entrada
</div>

<div class="object-state green" id="objecto">
NÃO
</div>

<div class="small">
Situação:
<span id="situacao">
AGUARDANDO
</span>
</div>

</div>


<div style="text-align:right">

<div class="card-title">
Altura
</div>

<div class="height-value">

<span id="altura">
0.0
</span>

cm

</div>

<div class="small">

Limite:

<span id="limite">
10.0
</span>

cm

</div>

</div>

</div>


<div class="card">

<div class="card-title">
Inspecção
</div>

<div class="bar">

<div
class="bar-fill"
id="barra">
</div>

</div>

<div
class="small"
id="alturaTexto">

Sem medição

</div>

</div>

</div>


<div class="section-title">
Produção da sessão
</div>


<div class="grid production-grid">


<div class="card production">

<div class="card-title">
Total
</div>

<div
class="value blue"
id="total">

0

</div>

</div>


<div class="card production">

<div class="card-title">
Aprovados
</div>

<div
class="value green"
id="aprovados">

0

</div>

</div>


<div class="card production">

<div class="card-title">
Recusados
</div>

<div
class="value red"
id="recusados">

0

</div>

</div>


</div>


<div class="section-title">
Monitorização
</div>


<div class="grid monitor-grid">


<div class="card monitor">

<div class="card-title">
Temperatura
</div>

<div
class="medium"
id="temperatura">

0.0 °C

</div>

</div>


<div class="card monitor">

<div class="card-title">
Humidade
</div>

<div
class="medium"
id="humidade">

0 %

</div>

</div>


<div class="card monitor">

<div class="card-title">
Vibração
</div>

<div
class="medium green"
id="vibracao">

NORMAL

</div>

</div>


<div class="card monitor">

<div class="card-title">
Alerta
</div>

<div
class="medium green"
id="alerta">

NENHUM

</div>

</div>


</div>


<div class="section-title">
Actividade recente
</div>


<div
class="card activity-list"
id="actividades">

<div class="activity">

<span>
A aguardar dados...
</span>

<span class="activity-time">
--:--:--
</span>

</div>

</div>


<div class="section-title">
Configuração
</div>


<div class="card controls">

<div>

<div class="card-title">
Limite de altura
</div>

<div class="medium">

<span id="limiteConfig">
10.0
</span>

cm

</div>

</div>


<button onclick="abrirConfig()">

ALTERAR LIMITE

</button>

</div>


</div>


<div class="footer">

Esteira Transportadora Automatizada · Actualização automática

</div>


<div
class="modal"
id="modal">


<div class="modal-box">

<h3>
Alterar limite de altura
</h3>


<label>
PIN de administrador
</label>

<input
id="pin"
type="password"
inputmode="numeric">


<label>
Novo limite (cm)
</label>

<input
id="novoLimite"
type="number"
min="0.1"
step="0.1">


<div
class="error"
id="erro">
</div>


<div class="modal-actions">

<button
class="secondary"
onclick="fecharConfig()">

CANCELAR

</button>


<button
onclick="guardarLimite()">

GUARDAR

</button>

</div>

</div>

</div>


<script>

async function actualizar() {

  try {

    const resposta =
      await fetch("/api/dados");

    const d =
      await resposta.json();


    document.getElementById("estado")
      .textContent =
      "● " + d.estado;


    document.getElementById("esp32")
      .textContent =
      "● ESP32 " + d.esp32;


    const objecto =
      document.getElementById("objecto");


    objecto.textContent =
      d.objectoDetectado
      ? "SIM"
      : "NÃO";


    objecto.className =
      "object-state " +
      (d.objectoDetectado
      ? "green"
      : "");


    document.getElementById("situacao")
      .textContent =
      d.situacao;


    document.getElementById("total")
      .textContent =
      d.total;


    document.getElementById("aprovados")
      .textContent =
      d.aprovados;


    document.getElementById("recusados")
      .textContent =
      d.recusados;


    document.getElementById("altura")
      .textContent =
      Number(d.altura)
      .toFixed(1);


    document.getElementById("limite")
      .textContent =
      Number(d.limiteAltura)
      .toFixed(1);


    document.getElementById("limiteConfig")
      .textContent =
      Number(d.limiteAltura)
      .toFixed(1);


    const percent =
      Math.min(
        100,
        Math.max(
          0,
          (d.altura /
          d.limiteAltura) * 100
        )
      );


    document.getElementById("barra")
      .style.width =
      percent + "%";


    document.getElementById("alturaTexto")
      .textContent =
      d.altura > 0
      ? Number(d.altura).toFixed(1)
        + " cm / limite "
        + Number(d.limiteAltura).toFixed(1)
        + " cm"
      : "Sem medição";


    document.getElementById("temperatura")
      .textContent =
      Number(d.temperatura)
      .toFixed(1)
      + " °C";


    document.getElementById("humidade")
      .textContent =
      d.humidade + " %";


    document.getElementById("vibracao")
      .textContent =
      d.vibracao;


    document.getElementById("alerta")
      .textContent =
      d.alerta;


    const lista =
      document.getElementById("actividades");


    if (
      d.actividades &&
      d.actividades.length
    ) {

      lista.innerHTML =
        d.actividades.map(a => `

<div class="activity">

<span>
${a.texto}
</span>

<span class="activity-time">
${a.hora}
</span>

</div>

`).join("");

    }


  } catch (erro) {

    document.getElementById("esp32")
      .textContent =
      "● ESP32 OFFLINE";

  }

}


function abrirConfig() {

  document.getElementById("modal")
    .style.display =
    "flex";


  document.getElementById("pin")
    .value = "";


  document.getElementById("novoLimite")
    .value = "";


  document.getElementById("erro")
    .textContent = "";

}


function fecharConfig() {

  document.getElementById("modal")
    .style.display =
    "none";

}


async function guardarLimite() {

  const pin =
    document.getElementById("pin")
    .value;


  const limite =
    Number(
      document.getElementById("novoLimite")
      .value
    );


  if (!pin || !limite || limite <= 0) {

    document.getElementById("erro")
      .textContent =
      "Preencha o PIN e um limite válido.";

    return;

  }


  const resposta =
    await fetch("/api/config", {

      method: "POST",

      headers: {
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({

        pin: pin,

        limiteAltura:
        limite

      })

    });


  const resultado =
    await resposta.json();


  if (!resposta.ok) {

    document.getElementById("erro")
      .textContent =
      resultado.erro ||
      "Não foi possível alterar.";

    return;

  }


  fecharConfig();

  actualizar();

}


actualizar();

setInterval(
  actualizar,
  1000
);

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


app.post("/api/config", (req, res) => {

  const {
    pin,
    limiteAltura
  } = req.body;


  if (pin !== ADMIN_PIN) {

    return res.status(401).json({

      erro: "PIN incorrecto."

    });

  }


  const limite =
    Number(limiteAltura);


  if (!limite || limite <= 0) {

    return res.status(400).json({

      erro: "Limite inválido."

    });

  }


  dados.limiteAltura =
    limite;


  registarActividade(
    "Limite de altura alterado para "
    + limite.toFixed(1)
    + " cm"
  );


  res.json({

    sucesso: true,

    limiteAltura:
      dados.limiteAltura

  });

});


app.post("/api/nova-sessao", (req, res) => {

  const {
    pin
  } = req.body;


  if (pin !== ADMIN_PIN) {

    return res.status(401).json({

      erro: "PIN incorrecto."

    });

  }


  dados.total = 0;

  dados.aprovados = 0;

  dados.recusados = 0;

  dados.alerta = "NENHUM";

  dados.situacao =
    "AGUARDANDO";

  dados.actividades = [];


  registarActividade(
    "Nova sessão iniciada"
  );


  res.json({

    sucesso: true

  });

});


const PORT =
  process.env.PORT || 3000;


app.listen(
  PORT,
  () => {

    console.log(
      "Servidor iniciado na porta "
      + PORT
    );

  }
);
