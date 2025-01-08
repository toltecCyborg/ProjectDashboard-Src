import React from "react";
//import { IGateListItem } from "../../../models";
//import styles from "./ProjectDashboard.module.scss";

// interface TaskCardProps {
//   gates: IGateListItem;
//   showDetails: boolean;
// }

//const Dashboard: React.FC<TaskCardProps> = ({ gates, showDetails }) => {

const Dashboard: React.FC = () => {
  
  
  return (
    <div className="task-card">
      <h1 className="task-title">Testing</h1>

      <svg
        width="100"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ border: "1px solid #ccc" }}
      >
        <circle cx="50" cy="50" r="40" fill="blue" />
      </svg>
    </div>
  );
};

export default Dashboard;
