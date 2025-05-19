const participantesEl = document.getElementById('participantes');
const modoEl = document.getElementById('modo');
const valorEl = document.getElementById('valor');
const labelValor = document.getElementById('labelValor');
const tituloInput = document.getElementById('tituloEquipos');
const btnGenerar = document.getElementById('btnGenerar');
const pantalla1 = document.getElementById('pantalla1');
const pantalla2 = document.getElementById('pantalla2');
const tituloPantalla2 = document.getElementById('tituloPantalla2');
const listaEquiposEl = document.getElementById('listaEquipos');
const btnDescargar = document.getElementById('btnDescargar');
const btnCopiarTxt = document.getElementById('btnCopiarTxt');
const btnCopiarCols = document.getElementById('btnCopiarCols');

modoEl.addEventListener('change', () => {
  if (modoEl.value === 'equipos') {
    labelValor.textContent = 'Cantidad de equipos:';
  } else {
    labelValor.textContent = 'Participantes por equipo:';
  }
});

function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

btnGenerar.addEventListener('click', () => {
  let arr = participantesEl.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s);
  if (arr.length === 0) return alert('Ingrese al menos un participante.');
  if (arr.length > 100) return alert('Máximo 100 participantes.');

  const modo = modoEl.value;
  const v = parseInt(valorEl.value);
  if (!v || v < 1) return alert('Ingrese un número válido.');

  let numEquipos;
  if (modo === 'equipos') {
    numEquipos = v;
  } else {
    numEquipos = Math.ceil(arr.length / v);
  }

  const tituloBase = tituloInput.value || 'Equipo';

  arr = mezclar(arr);
  const equipos = Array.from({ length: numEquipos }, () => []);
  arr.forEach((p, i) => {
    equipos[i % numEquipos].push(p);
  });

  pantalla1.style.display = 'none';
  pantalla2.style.display = 'block';
  tituloPantalla2.textContent = 'Resultados de ' + tituloBase;
  listaEquiposEl.innerHTML = '';

  equipos.forEach((eq, idx) => {
    const cont = document.createElement('div');
    cont.className = 'equipo';
    cont.innerHTML = `<h3>${tituloBase} ${idx+1}</h3><ul>` +
      eq.map(x => `<li>${x}</li>`).join('') +
      '</ul>';
    listaEquiposEl.appendChild(cont);
  });

  btnDescargar.onclick = () => {
    html2canvas(listaEquiposEl).then(canvas => {
      const link = document.createElement('a');
      link.download = 'equipos.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    });
  };

  btnCopiarTxt.onclick = () => {
    const texto = equipos.map((eq, i) =>
      `${tituloBase} ${i+1}: ${eq.join(', ')}`
    ).join('\n');
    navigator.clipboard.writeText(texto).then(() => {
      alert('Copiado al portapapeles');
    });
  };

  btnCopiarCols.onclick = () => {
    const filasMax = Math.max(...equipos.map(eq => eq.length));
    let colsTexto = '';
    for (let r = 0; r < filasMax; r++) {
      colsTexto += equipos.map(eq => eq[r] || '').join('\t') + '\n';
    }
    navigator.clipboard.writeText(colsTexto).then(() => {
      alert('Columnas copiadas');
    });
  };
});

function mezclarArray(array) {
  return array
    .map(valor => ({ valor, orden: Math.random() }))
    .sort((a, b) => a.orden - b.orden)
    .map(obj => obj.valor);
}
