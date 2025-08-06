function cargarAbastecimiento03(url) {
  $("#content").load(url, function () {
    inicializarGraficosA2();
  });
}

function inicializarGraficosA3() {
    fetch("json/abastecimiento03/predicciones_comparacion_abastecimiento3.json")
    .then((res) => res.json())
    .then((data) => {
        const filterYear = document.getElementById("filterYearIngresos");
        const filterSede = document.getElementById("sede-select3");

        const validYears = [...new Set(data.map(item => parseInt(item.Year)))].filter(y => !isNaN(y)).sort();

        validYears.forEach((year) => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        filterYear.appendChild(option);
        });

        const filterData = (sede, year) => {
        return data
            .filter(item => item.campo === sede && (year === "all" || item.Year === parseInt(year)))
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        };

        const ctx = document.getElementById("comparacionIngresosChart").getContext("2d");

        const createChart = (datos) => {
        return new Chart(ctx, {
            type: "line",
            data: {
            labels: datos.map(d => d.fecha),
            datasets: [
                {
                label: "Ingreso Real",
                data: datos.map(d => d.Actual),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                tension: 0.4
                },
                {
                label: "Ingreso Predicho",
                data: datos.map(d => d.Predicted),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderDash: [5, 5],
                tension: 0.4
                }
            ]
            },
            options: {
            responsive: true,
            plugins: {
                title: {
                display: true,
                text: "Comparación de Ingresos por Sede y Fecha",
                font: { size: 18 }
                }
            },
            scales: {
                x: { title: { display: true, text: "Fecha" } },
                y: { title: { display: true, text: "Ingreso (S/.)" } }
            }
            }
        });
        };

        let currentSede = "SEHS ANOP";
        let currentYear = "all";
        let chart = createChart(filterData(currentSede, currentYear));

        filterYear.addEventListener("change", (e) => {
        currentYear = e.target.value;
        const datos = filterData(currentSede, currentYear);
        chart.data.labels = datos.map(d => d.fecha);
        chart.data.datasets[0].data = datos.map(d => d.Actual);
        chart.data.datasets[1].data = datos.map(d => d.Predicted);
        chart.update();
        });

        filterSede.addEventListener("change", (e) => {
        currentSede = e.target.value;
        const datos = filterData(currentSede, currentYear);
        chart.data.labels = datos.map(d => d.fecha);
        chart.data.datasets[0].data = datos.map(d => d.Actual);
        chart.data.datasets[1].data = datos.map(d => d.Predicted);
        chart.update();
        });
    })
    .catch((error) => {
        console.error("Error al cargar los datos del JSON de ingresos:", error);
    });
}