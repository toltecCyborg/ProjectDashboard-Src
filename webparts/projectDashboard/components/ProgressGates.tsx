import * as React from "react";
import { IGateListItem, ITaskListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";
import { ProgressIndicator, IProgressIndicatorStyles } from "@fluentui/react";

interface GateCardProps {
  gates: IGateListItem[];
  tasks: ITaskListItem[];
  showDetails: boolean;
  onSelectItem: (item: string, group: string) => void;
}
const ProgressGates = ({
  gates,
  onSelectItem,
  showDetails,
  tasks,
}: GateCardProps) => {
  const progressStyles: IProgressIndicatorStyles = {
    itemProgress: {
      backgroundColor: "whitesmoke", // Color de la barra
      height: "2px"
    },
    root: {
      margin: "1px", // Ejemplo: ajustando margen
    },
    itemName: "gates",
    itemDescription: "gates progress bar...",
    progressBar: "bar",
    progressTrack: "track",
  };
  const getCardClass = (delay: number, complete: number) => {
    if (complete === 1) return styles.green;
    if (delay > 0 && delay <= 7) return styles.yellow;
    if (delay > 7) return styles.red;
    return styles.white; // Default Class
  };
  const getCardDelay = (delay: number, complete: number) => {
    if (complete === 1) return styles.whiteFont;
    if (delay === 0) return styles.greenFont;
    if (delay > 0 && delay <= 7) return styles.redFont;
    if (delay > 7) return styles.whiteFont;
    return styles.whiteFont; // Default Class
  };
  return (
    <>
      <div className={styles["cardContainer"]}>
        {gates.map((gate, index) => (
          <div
            key={gate.Id}
            className={`${styles["pilaCard"]} ${getCardClass(
              gate.Delay,
              gate.Complete
            )}`}
          >
            <div
              className={`${styles["cardContent"]} ${getCardDelay(
                gate.Delay,
                gate.Complete
              )}`}
              onClick={() => {
                onSelectItem(gate.Title, "gate");
              }}
            >
              {showDetails && tasks.length > 0 && (
                <ProgressIndicator
                  //label="Loading..."
                  //description="We are fetching the data"
                  percentComplete={gate.Complete}
                  styles={progressStyles}
                />
              )}
              <h5>
                <strong>{gate.Title} </strong>
              </h5>
              <p>
                <strong>{Math.floor(gate.Complete * 100)}% </strong>
              </p>
              {gate.Delay > 0 && (
                <p>
                  <strong>(- {gate.Delay} days) </strong>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProgressGates;
