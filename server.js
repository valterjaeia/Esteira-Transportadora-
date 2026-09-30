const express = require("express");

const app = express();
app.use(express.json());

let dados = {
  temperatura: 27,
  humidade: 60,
  distancia: 8.4,
  vibracao: "Normal",
  objectos: 0,
  estado: "Parada",
  alerta: "Nenhum"
};

// Página principal
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monitorização da Esteira</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f2f2f2;
      color: #222;
    }

    h1 {
      text-align: center;
    }

    .estado {
      text-align: center;
      font-size: 22px;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      max-width: 800px;
      margin: auto;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }

    .valor {
      font-size: 28px;
      font-weight: bold;
      margin-top: 10px;
    }

    .alerta {
      margin: 20px auto;
      max-width: 800px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }
  </style>
</head>

<body>

  <h1>Monitorização da Esteira</h1>

  <div class="estado">
    Estado: <span id="estado">--</span>
  </div>

  <div class="grid">

    <div class="card">
      <div>Temperatura</div>
      <div class="valor"><span id="temperatura">--</span> °C</div>
    </div>

    <div class="card">
      <div>Humidade</div>
      <div class="valor"><span id="humidade">--</span> %</div>
    </div>

    <div class="card">
      <div>Altura do objecto</div>
      <div class="valor"><span id="distancia">--</span> cm</div>
    </div>

    <div class="card">
      <div>Objectos</div>
      <div class="valor" id="objectos">--</div>
    </div>

    <div class="card">
      <div>Vibração</div>
      <div class="valor" id="vibracao">--</div>
    </div>

  </div>

  <div class="alerta">
    <strong>Alerta:</strong>
    <span id="alerta">--</span>
  </div>

<script>
async function actualizar() {
  const resposta = await fetch("/api/dados");
  const dados = await resposta.json();

  document.getElementById("temperatura").textContent = dados.temperatura;
  document.getElementById("humidade").textContent = dados.humidade;
  document.getElementById("distancia").textContent = dados.distancia;
  document.getElementById("objectos").textContent = dados.objectos;
  document.getElementById("vibracao").textContent = dados.vibracao;
  document.getElementById("estado").textContent = dados.estado;
  document.getElementById("alerta").textContent = dados.alerta;
}

actualizar();
setInterval(actualizar, 2000);
</script>

</body>
</html>
  `);
});

// Dados para a página
app.get("/api/dados", (req, res) => {
  res.json(dados);
});

// Receber dados do ESP32
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
