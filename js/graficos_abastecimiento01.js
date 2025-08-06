function cargarAbastecimiento01(url) {
  $("#content").load(url, function () {
    inicializarGraficosA01();
  });
}

function inicializarGraficosA01() {
  // Gráfico de Dispersión
  fetch("json/abastecimiento01/dispersion.json")
    .then((res) => res.json())
    .then((dispersionData) => {
      // Crear la gráfica
      const ctxDispersion = document
        .getElementById("dispersionChart")
        .getContext("2d");

      new Chart(ctxDispersion, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Predicciones", // Puntos de dispersión
              data: dispersionData.valores_reales.map((real, i) => ({
                x: real,
                y: dispersionData.predicciones[i],
              })),
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Azul claro
              borderColor: "rgba(75, 192, 192, 1)", // Azul
              pointRadius: 5,
            },
            {
              label: "Valores Históricos", // Línea roja
              data: dispersionData.valores_reales.map((real) => ({
                x: real,
                y: real,
              })),
              type: "line",
              borderColor: "rgba(255, 0, 0, 1)", // Rojo
              borderWidth: 2,
              fill: false,
              pointRadius: 0, // Sin puntos en la línea
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Valores Reales vs Predicciones",
              font: { size: 18 },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Valores Históricos",
              },
            },
            y: {
              title: {
                display: true,
                text: "Predicciones",
              },
            },
          },
        },
      });
    })
    .catch((error) => console.error("Error al cargar el JSON:", error));

  // Gráfico de Predicciones vs Reales
  fetch("json/abastecimiento01/predicciones_vs_reales.json")
    .then((res) => res.json())
    .then((prediccionesVsRealesData) => {
      const ctxPrediccionesVsReales = document
        .getElementById("prediccionesVsRealesChart")
        .getContext("2d");

      new Chart(ctxPrediccionesVsReales, {
        type: "line",
        data: {
          labels: prediccionesVsRealesData.fechas,
          datasets: [
            {
              label: "Valores Históricos",
              data: prediccionesVsRealesData.valores_reales,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
            {
              label: "Predicciones",
              data: prediccionesVsRealesData.predicciones,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Predicciones vs Valores Reales",
              font: { size: 18 },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Fecha",
              },
            },
            y: {
              title: {
                display: true,
                text: "Costos",
              },
            },
          },
        },
      });
    });

  // Gráfico de Predicciones Futuras
  let prediccionesChart;
  fetch("json/abastecimiento01/predicciones_futuras.json")
    .then((res) => res.json())
    .then((prediccionesFuturasData) => {
      // Extraer años únicos de las fechas
      const allYears = [
        ...new Set([
          ...prediccionesFuturasData.fechas_historicas.map((fecha) =>
            new Date(fecha).getFullYear()
          ),
          ...prediccionesFuturasData.fechas_futuras.map((fecha) =>
            new Date(fecha).getFullYear()
          ),
        ]),
      ];

      // Crear opciones en el <select>
      const filterSelect = document.getElementById(
        "filterYearPrediccionesFuturas"
      );
      allYears.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        filterSelect.appendChild(option);
      });

      // Función para filtrar datos según el año seleccionado
      const filterDataByYear = (year) => {
        const filteredLabels = [];
        const filteredHistoricos = [];
        const filteredFuturos = [];

        prediccionesFuturasData.fechas_historicas.forEach((fecha, index) => {
          const currentYear = new Date(fecha).getFullYear();
          if (year === "all" || currentYear === parseInt(year)) {
            filteredLabels.push(fecha);
            filteredHistoricos.push(
              prediccionesFuturasData.costos_historicos[index]
            );
            filteredFuturos.push(null); // Mantener valores futuros como null
          }
        });

        prediccionesFuturasData.fechas_futuras.forEach((fecha, index) => {
          const currentYear = new Date(fecha).getFullYear();
          if (year === "all" || currentYear === parseInt(year)) {
            filteredLabels.push(fecha);
            filteredHistoricos.push(null); // Mantener valores históricos como null
            filteredFuturos.push(
              prediccionesFuturasData.predicciones_futuras[index]
            );
          }
        });

        return { filteredLabels, filteredHistoricos, filteredFuturos };
      };

      // Crear el gráfico inicial
      const createChart = (data) => {
        const ctxPrediccionesFuturas = document
          .getElementById("prediccionesFuturasChart")
          .getContext("2d");

        return new Chart(ctxPrediccionesFuturas, {
          type: "line",
          data: {
            labels: data.filteredLabels,
            datasets: [
              {
                label: "Costos Históricos",
                data: data.filteredHistoricos,
                borderColor: "rgba(54, 162, 235, 1)", // Azul
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4,
              },
              {
                label: "Predicciones Futuras",
                data: data.filteredFuturos,
                borderColor: "rgba(255, 99, 132, 1)", // Rojo
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4,
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Predicciones Futuras y Datos Históricos",
                font: { size: 18 },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Fecha",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Costos",
                },
              },
            },
          },
        });
      };

      // Filtrar datos y crear el gráfico inicial
      const initialData = filterDataByYear("all");
      prediccionesChart = createChart(initialData);

      // Actualizar el gráfico cuando se seleccione un año
      filterSelect.addEventListener("change", (event) => {
        const selectedYear = event.target.value;
        const filteredData = filterDataByYear(selectedYear);

        prediccionesChart.data.labels = filteredData.filteredLabels;
        prediccionesChart.data.datasets[0].data =
          filteredData.filteredHistoricos;
        prediccionesChart.data.datasets[1].data = filteredData.filteredFuturos;
        prediccionesChart.update();
      });
    })
    .catch((error) => {
      console.error("Error al cargar los datos del JSON:", error);
    });

  //Gráfico de Comparaciones de Predicciones vs Valores Reales por Año
  fetch("json/abastecimiento01/comparacion_predicciones.json")
  .then((res) => res.json())
  .then((data) => {
    // Obtener referencia al select de sede y de año
    const filterYear = document.getElementById("filterYearComparacion");
    const filterSede = document.getElementById("sede-select"); // Asegúrate de tener este select en el HTML

    // Obtener años únicos desde los datos
    const validYears = [
      ...new Set(data.map((item) => parseInt(item.Year)))
    ].filter(y => !isNaN(y)).sort();

    // Llenar el <select> de años
    validYears.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      filterYear.appendChild(option);
    });

    // Función que filtra datos por sede y año
    const filterData = (sede, year) => {
      return data
        .filter((item) => item.campo === sede && (year === "all" || item.Year === parseInt(year)))
        .sort((a, b) => a.Year - b.Year);
    };

    // Función para construir el gráfico
    const createChart = (filteredData) => {
      const ctx = document.getElementById("comparacionPrediccionesChart").getContext("2d");

      return new Chart(ctx, {
        type: "line",
        data: {
          labels: filteredData.map(item => item.Year),
          datasets: [
            {
              label: "Valor Histórico",
              data: filteredData.map(item => item.Actual),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
              pointStyle: "circle",
              pointRadius: 5,
            },
            {
              label: "Predicción",
              data: filteredData.map(item => item.Predicted),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.5,
              pointStyle: "cross",
              pointRadius: 5,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Comparación de Predicciones vs Valores Reales por Año",
              font: { size: 18 },
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Año" },
            },
            y: {
              title: { display: true, text: "Cantidad Real y Predicha" },
              beginAtZero: false,
            },
          },
        },
      });
    };

    // Cargar datos iniciales (por defecto sede "SEHS ANOP", todos los años)
    let currentSede = "SEHS ANOP";
    let currentYear = "all";
    let chart = createChart(filterData(currentSede, currentYear));

    // Actualizar gráfico cuando cambie el año
    filterYear.addEventListener("change", (e) => {
      currentYear = e.target.value;
      const newData = filterData(currentSede, currentYear);
      chart.data.labels = newData.map(item => item.Year);
      chart.data.datasets[0].data = newData.map(item => item.Actual);
      chart.data.datasets[1].data = newData.map(item => item.Predicted);
      chart.update();
    });

    // Actualizar gráfico cuando cambie la sede
    filterSede.addEventListener("change", (e) => {
      currentSede = e.target.value;
      const newData = filterData(currentSede, currentYear);
      chart.data.labels = newData.map(item => item.Year);
      chart.data.datasets[0].data = newData.map(item => item.Actual);
      chart.data.datasets[1].data = newData.map(item => item.Predicted);
      chart.update();
    });
  })
  .catch((error) => {
    console.error("Error al cargar los datos del JSON:", error);
  });
}
