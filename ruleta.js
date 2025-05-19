// ruleta.js
const textarea = document.getElementById('entradaElementos');
const canvas = document.getElementById('lienzoRuleta');
const ctx = canvas.getContext('2d');
const resultadoDiv = document.getElementById('resultado');

let elementos = [];
let ultimoElemento = null;
let anguloActual = 0;
let girando = false;
let indiceSeleccionado = -1;

const colores = ['red', 'blue', 'green', 'yellow', 'purple'];

function actualizarRuleta() {
  const lineas = textarea.value.trim().split('\n');
  elementos = lineas.filter(e => e.trim() !== '' && !e.startsWith('#'));
  if (!girando) dibujarRuleta();
}

function dibujarRuleta() {
  const total = elementos.length;
  const radio = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(radio, radio);
  ctx.rotate(anguloActual);

  for (let i = 0; i < total; i++) {
    const anguloInicio = (i / total) * 2 * Math.PI;
    const anguloFin = ((i + 1) / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = colores[i % colores.length];
    ctx.arc(0, 0, radio, anguloInicio, anguloFin);
    ctx.fill();

    ctx.save();
    ctx.rotate(anguloInicio + (anguloFin - anguloInicio) / 2);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(elementos[i], radio - 10, 5);
    ctx.restore();
  }

  ctx.restore();
}

function iniciarRuleta() {
  actualizarRuleta();
  if (elementos.length === 0 || girando) return;

  girando = true;

  const total = elementos.length;
  const vueltas = Math.floor(Math.random() * 3) + 5;
  const anguloPorSector = (2 * Math.PI) / total;

  const sector = Math.floor(Math.random() * total);
  const anguloSectorMedio = sector * anguloPorSector + anguloPorSector / 2;
  const anguloDestino = (2 * Math.PI * vueltas) - anguloSectorMedio;
  const anguloInicial = anguloActual;
  const anguloTotal = anguloDestino - anguloInicial;

  let progreso = 0;

  function animar() {
    progreso += 0.01;
    if (progreso >= 1) {
      anguloActual = anguloDestino % (2 * Math.PI);
      dibujarRuleta();
      girando = false;

      // Calcular el sector realmente alineado con la posición fija (ángulo 0)
      const sectorSeleccionadoFinal = Math.floor(((2 * Math.PI) - anguloActual + anguloPorSector / 2) / anguloPorSector) % total;

      indiceSeleccionado = sectorSeleccionadoFinal;
      ultimoElemento = elementos[indiceSeleccionado];
      resultadoDiv.textContent = `Seleccionado: ${ultimoElemento}`;

      dibujarRuleta();
      return;
    }

    const ease = 1 - Math.pow(1 - progreso, 3);
    anguloActual = anguloInicial + ease * anguloTotal;
    dibujarRuleta();
    requestAnimationFrame(animar);
  }

  animar();
}

function ocultarUltimoElemento() {
  if (!ultimoElemento) return;

  const lineas = textarea.value.split('\n');
  for (let i = 0; i < lineas.length; i++) {
    if (lineas[i].trim() === ultimoElemento) {
      lineas[i] = '# ' + lineas[i];
      break;
    }
  }
  textarea.value = lineas.join('\n');
  resultadoDiv.textContent = '';
  ultimoElemento = null;
  indiceSeleccionado = -1;
  actualizarRuleta();
}

function reiniciarRuleta() {
  const lineas = textarea.value.split('\n').map(linea => {
    return linea.startsWith('# ') ? linea.slice(2) : linea;
  });
  textarea.value = lineas.join('\n');
  ultimoElemento = null;
  indiceSeleccionado = -1;
  resultadoDiv.textContent = '';
  actualizarRuleta();
}

function activarPantallaCompleta() {
  document.documentElement.requestFullscreen();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') iniciarRuleta();
  else if (e.key === 'S') ocultarUltimoElemento();
  else if (e.key === 'E') textarea.readOnly = false;
  else if (e.key === 'R') reiniciarRuleta();
  else if (e.key === 'F') activarPantallaCompleta();
});

textarea.addEventListener('input', () => {
  if (!textarea.readOnly) actualizarRuleta();
});

textarea.addEventListener('click', () => {
  textarea.readOnly = false;
});

canvas.addEventListener('click', iniciarRuleta);

actualizarRuleta();
