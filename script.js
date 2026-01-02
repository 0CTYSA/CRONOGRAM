function calcularProximas() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let meds = [
    {
      name: "Loperamida",
      time: loperaTime.value,
      freq: Number(loperaFreq.value),
    },
    {
      name: "Hioscina",
      time: hiosTime.value,
      freq: Number(hiosFreq.value),
    },
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
    // Hora inicial (HOY)
    let [h, m] = med.time.split(":").map(Number);
    let start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m
    );

    // Próxima toma = hora inicial + frecuencia
    let next = new Date(start.getTime() + med.freq * 60 * 60 * 1000);

    // Determinar si es hoy o mañana
    let dayLabel =
      next > today && next.getDate() !== today.getDate() ? "Tomorrow" : "Today";

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
