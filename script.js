/* ===============================
   CALCULAR Y GUARDAR HORARIOS
================================ */
function calcularProximas() {
  const medicamentos = [
    {
      nombre: "Loperamida",
      time: "loperaTime",
      freq: "loperaFreq",
    },
    {
      nombre: "Hioscina",
      time: "hiosTime",
      freq: "hiosFreq",
    },
    {
      nombre: "Metronidazol",
      time: "metroTime",
      freq: "metroFreq",
    },
  ];

  let resultadoHTML = "";
  let dataToSave = [];

  medicamentos.forEach((med) => {
    const horaInicial = document.getElementById(med.time).value;
    const frecuencia = parseInt(document.getElementById(med.freq).value);

    if (!horaInicial || !frecuencia) return;

    const [hh, mm] = horaInicial.split(":").map(Number);
    const ahora = new Date();

    let proxima = new Date();
    proxima.setHours(hh, mm, 0, 0);
    proxima.setHours(proxima.getHours() + frecuencia);

    const esManana = proxima.getDate() !== ahora.getDate();
    const etiquetaDia = esManana ? "Mañana" : "Hoy";

    const horaFormateada = proxima.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

    resultadoHTML += `
      <div class="alert alert-info">
        <strong>${med.nombre}</strong><br>
        Próxima dosis: <b>${etiquetaDia} a las ${horaFormateada}</b>
      </div>
    `;

    dataToSave.push({
      nombre: med.nombre,
      horaInicial,
      frecuencia,
      proxima: proxima.toISOString(),
    });
  });

  document.getElementById("resultado").innerHTML = resultadoHTML;

  // 💾 Guardar en localStorage
  localStorage.setItem("medSchedule", JSON.stringify(dataToSave));
}

/* ===============================
   CARGAR DATOS AL INICIAR
================================ */
document.addEventListener("DOMContentLoaded", function () {
  const savedData = localStorage.getItem("medSchedule");
  if (!savedData) return;

  const medicamentos = JSON.parse(savedData);

  medicamentos.forEach((med) => {
    if (med.nombre === "Loperamida") {
      document.getElementById("loperaTime").value = med.horaInicial;
      document.getElementById("loperaFreq").value = med.frecuencia;
    }

    if (med.nombre === "Hioscina") {
      document.getElementById("hiosTime").value = med.horaInicial;
      document.getElementById("hiosFreq").value = med.frecuencia;
    }

    if (med.nombre === "Metronidazol") {
      document.getElementById("metroTime").value = med.horaInicial;
      document.getElementById("metroFreq").value = med.frecuencia;
    }
  });

  // 🔁 Recalcular automáticamente
  calcularProximas();
});
