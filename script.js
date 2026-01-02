/* ===============================
   CARGAR HORARIOS GUARDADOS
================================ */
window.onload = function () {
  const saved = localStorage.getItem("medSchedule");
  if (!saved) return;

  const data = JSON.parse(saved);

  if (data.loperamida) {
    loperaTime.value = data.loperamida.time || "";
    loperaFreq.value = data.loperamida.freq || 8;
  }

  if (data.hioscina) {
    hiosTime.value = data.hioscina.time || "";
    hiosFreq.value = data.hioscina.freq || 8;
  }

  if (data.metro) {
    metroTime.value = data.metro.time || "";
    metroFreq.value = data.metro.freq || 8;
  }
};

/* ===============================
   GUARDAR HORARIOS
================================ */
function guardarHorarios() {
  const data = {
    loperamida: {
      time: loperaTime.value,
      freq: Number(loperaFreq.value),
    },
    hioscina: {
      time: hiosTime.value,
      freq: Number(hiosFreq.value),
    },
    metro: {
      time: metroTime.value,
      freq: Number(metroFreq.value),
    },
  };

  localStorage.setItem("medSchedule", JSON.stringify(data));
}

function calcularProximas() {
  guardarHorarios();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let meds = [
    {
      name: "Loperamida",
      time: loperaTime.value,
      freq: Number(loperaFreq.value),
    },
    { name: "Hioscina", time: hiosTime.value, freq: Number(hiosFreq.value) },
    {
      name: "Metronidazol",
      time: metroTime.value,
      freq: Number(metroFreq.value),
    },
  ];

  let html = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Medicamento</th>
          <th>Próxima toma</th>
        </tr>
      </thead>
      <tbody>`;

  meds.forEach((med) => {
    if (!med.time || !med.freq) return;

    let [h, m] = med.time.split(":").map(Number);

    // Hora inicial (hoy)
    let start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      h,
      m
    );

    // Próxima toma = hora inicial + frecuencia
    let next = new Date(start.getTime() + med.freq * 60 * 60 * 1000);

    // Etiqueta de día
    let dayLabel;
    if (next.toDateString() === today.toDateString()) {
      dayLabel = "Today";
    } else if (
      next.toDateString() ===
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()
    ) {
      dayLabel = "Tomorrow";
    } else {
      dayLabel = next.toLocaleDateString();
    }

    let timeStr = next.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    html += `
      <tr>
        <td>${med.name}</td>
        <td>${dayLabel} at ${timeStr}</td>
      </tr>`;
  });

  html += "</tbody></table>";
  document.getElementById("resultado").innerHTML = html;
}
