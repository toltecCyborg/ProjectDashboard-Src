import React from "react";
import { IGateListItem } from "../../../models";
import { GroupByProject } from "./GroupByProject";
//import styles from "./ProjectDashboard.module.scss";

interface DashboardProps {
  gates: IGateListItem[];
  project : string;
}

//const Dashboard: React.FC<TaskCardProps> = ({ gates, showDetails }) => {

const Dashboard: React.FC<DashboardProps> = ({ gates, project }) => {
  const getCardColor = (delay: number, complete: number) => {
    if (complete === 1) return "green";
    if (delay > 0 && delay <= 7) return "yellow";
    if (delay > 7) return "red";
    return "white"; // Default Class
  };

  const getCardDelay = (delay: number, complete: number) => {
    if (complete === 1) return "white";
    if (delay === 0) return "black";
    if (delay > 0 && delay <= 7) return "darkred";
    if (delay > 7) return "darkyellow";
    return "black"; // Default Class
  };

  return (
    <div className="task-card">
      <div>
        <a
          href="https://ed2corp.sharepoint.com/sites/ED2Team/SitePages/SW_RFCascade.aspx"
          target="_blank"
        >
          <h1> {project} </h1>
          {gates && (
            <div className="task-card">              
              <svg
                width="200"
                height="200"
                xmlns="http://www.w3.org/2000/svg"
                style={{ border: "2px solid blue" }}
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <rect
                  x="80"
                  y="1"
                  rx="10"
                  width="50"
                  height="50"
                  fill={getCardColor(gates[0].Delay, gates[0].Complete)}
                  stroke="black"
                  strokeWidth="2"
                />
                <rect
                  x="149"
                  y="50"
                  rx="10"
                  width="50"
                  height="50"
                  fill={getCardColor(gates[1].Delay, gates[1].Complete)}
                  stroke="black"
                  strokeWidth="2"
                />
                <rect
                  x="130"
                  y="130"
                  rx="10"
                  width="50"
                  height="50"
                  fill={getCardColor(gates[2].Delay, gates[2].Complete)}
                  stroke="black"
                  strokeWidth="2"
                />
                <rect
                  x="20"
                  y="130"
                  rx="10"
                  width="50"
                  height="50"
                  fill={getCardColor(gates[3].Delay, gates[3].Complete)}
                  stroke="black"
                  strokeWidth="2"
                />
                <rect
                  x="1"
                  y="50"
                  rx="10"
                  width="50"
                  height="50"
                  fill={getCardColor(gates[4].Delay, gates[4].Complete)}
                  stroke="black"
                  strokeWidth="2"
                />

                <text x="100" y="35" fill={getCardDelay(gates[0].Delay, gates[0].Complete)} font-size="24">
                  {gates[0].Title.substring(0,1) }
                </text>
                <text x="170" y="85" fill={getCardDelay(gates[1].Delay, gates[1].Complete)} font-size="24">
                  {gates[1].Title.substring(0,1) }
                </text>
                <text x="150" y="165" fill={getCardDelay(gates[2].Delay, gates[2].Complete)} font-size="24">
                  {gates[2].Title.substring(0,1) }
                </text>
                <text x="40" y="165" fill={getCardDelay(gates[3].Delay, gates[3].Complete)} font-size="24">
                  {gates[3].Title.substring(0,1) }
                </text>
                <text x="20" y="85" fill={getCardDelay(gates[4].Delay, gates[4].Complete)} font-size="24">
                  {gates[4].Title.substring(0,1) }
                </text>

                <text
                  x="68"
                  y="110"
                  fill={getCardDelay(GroupByProject(gates).Delay, GroupByProject(gates).Complete)}
                  font-size="35"
                >
                  {GroupByProject(gates).Complete + "%"}
                </text>
              </svg>
            </div>
          )}
          {!gates && <h1>Without info defined for the project... </h1>}
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
