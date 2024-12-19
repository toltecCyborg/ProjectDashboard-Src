import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
// Registrar componentes necesarios en ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProjectTempPie: React.FC = () => {
  // Datos para el gráfico
  const data = {
    labels: [
      "1.Kick Off",
      "2.Requirements",
      "3.Proof of Concept",
      "4.MVP Implementation",
      "5.Production",
    ],
    datasets: [
      {
        data: [20, 20, 20, 20, 20], // Valores
        backgroundColor: [
          "#4CAF50", // Rojo
          "#4CAF50", // Azul
          "#4CAF50", // Amarillo
          "#ffffff", // Verde
          "#ffffff", // Púrpura
        ], // Colores para cada segmento
        hoverBackgroundColor: [
          "#4CAF50CC",
          "#4CAF50CC",
          "#4CAF50CC",
          "#4CAF50CC",
          "#4CAF50CC",
        ], // Colores al hacer hover
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const, // Coloca la leyenda en la parte superior
      },
      title: {
        display: true,
        text: "% Complete", // Título del gráfico
      },
    },
  };

  return (
    <div style={{ width: "400px", margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ProjectTempPie;
