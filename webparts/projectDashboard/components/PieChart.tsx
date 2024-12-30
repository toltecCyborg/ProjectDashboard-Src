import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { IGateListItem } from "../../../models";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieProps {
  gates: IGateListItem[];
}

const PieChart: React.FC<PieProps> = ({ gates }) => {
  // Datos para el gráfico
  const getCardColor = (delay: number, complete: number) => {
    console.log("Styles:" + delay + "-" + complete);
    if (complete === 1) return "#4CAF50";
    if (delay > 0 && delay <= 7) return "#FFCE56";
    if (delay > 7) return "#FF3B4E";
    return "#FFFFFF"; // Default Class
  };
  const getCardBackground = (delay: number, complete: number) => {
    console.log("BackStyles:" + delay + "-" + complete);
    if (complete === 1) return "#4CAF50CC";
    if (delay > 0 && delay <= 7) return "#FFCE56CC";
    if (delay > 7) return "#FF6384CC";
    return "#CCCCCC80"; // Default Class
  };
  const data = {
    //labels: ["Rojo", "Azul", "Amarillo", "Verde", "Púrpura"],
    labels: gates.map((gate, index) => gate.Title),
    datasets: [
      {
        data: [20, 20, 20, 20, 20], // Valores
        backgroundColor: gates.map((gate, index) =>
          getCardColor(gate.Delay, gate.Complete)
        ), // Colores para cada segmento
        hoverBackgroundColor: gates.map((gate, index) =>
          getCardBackground(gate.Delay, gate.Complete)
        ), // Colores al hacer hover
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
        text: "RF Cascade", // Título del gráfico
      },
    },
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
