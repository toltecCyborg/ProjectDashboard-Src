import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registro de los elementos requeridos en ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC = () => {
  // Configuración de datos del gráfico
  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales ($)",
        data: [12000, 15000, 18000, 20000, 22000],
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de las barras
        borderColor: "rgba(75, 192, 192, 1)", // Borde de las barras
        borderWidth: 1,
      },
    ],
  };

  // Configuración de opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Mostrar la leyenda
        position: "top" as const, // Posición de la leyenda
      },
      title: {
        display: true,
        text: "Monthly Sales",
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Inicia el eje Y desde 0
      },
    },
  };

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
