import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Registrar componentes necesarios en ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart: React.FC = () => {
  // Datos para el gráfico
  const data = {
    labels: ["Rojo", "Azul", "Amarillo", "Verde", "Púrpura"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2], // Valores
        backgroundColor: [
          "#FF6384", // Rojo
          "#36A2EB", // Azul
          "#FFCE56", // Amarillo
          "#4CAF50", // Verde
          "#8E44AD", // Púrpura
        ], // Colores para cada segmento
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4CAF50CC",
          "#8E44ADCC",
        ], // Colores al hacer hover
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Coloca la leyenda en la parte superior
      },
      title: {
        display: true,
        text: "Distribución de Colores", // Título del gráfico
      },
    },
  };

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
