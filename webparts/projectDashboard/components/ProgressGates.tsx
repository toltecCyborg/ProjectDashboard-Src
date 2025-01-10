/* eslint-disable @typescript-eslint/no-var-requires */
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
      height: "2px",
    },
    root: {
      margin: "1px", // Ejemplo: ajustando margen
    },
    itemName: "gates",
    itemDescription: "gates progress bar...",
    progressBar: "bar",
    progressTrack: "track",
  };

  const getBackgroundImage = (delay: number, complete: number) => {
    if (complete === 1) {
      return require("../assets/ArrowGreen.png");
    } else if (delay >= 14) {
      return require("../assets/ArrowRed.png");
    } else if (delay >= 7) {
      return require("../assets/ArrowYellow.png");
    } else {
      return require("../assets/ArrowWhite.png");
    }
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
      {showDetails ? (
        <div className={styles["cardContainer"]}>
          {gates.map((gate, index) => (
            <div
              key={gate.Id}
              //className={styles["gateCard"]}
              //className={`${styles["gateCard"]} ${getBackgroundImage(gate.Delay, gate.Complete)}`}
              className={`${styles["gateCardDetail"]} ${getCardClass(
                gate.Delay,
                gate.Complete
              )}`}
              //className={`${getBackgroundImage(gate.Delay, gate.Complete)}`}
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
                {tasks.length > 0 && (
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
      ) : (
        <div className={styles["cardContainer"]}>
          {gates.map((gate, index) => (
            <div
              style={{ position: "relative", width: "80px", height: "80px" }}
              key={gate.Id}
            >
              <img
                alt=""
                //src={require("../assets/ArrowGreen.jpg")}
                src={getBackgroundImage(gate.Delay, gate.Complete)}
                className={styles["iconArrow"]}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "20%",
                  //transform: "translate(-50%, -50%)",
                  // color: "white",
                  // fontSize: "20px",
                  // fontWeight: "bold",
                  //textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)"
                }}
                className={`${styles["cardContent"]} ${getCardDelay(
                  gate.Delay,
                  gate.Complete
                )}`}
                onClick={() => {
                  onSelectItem(gate.Title, "gate");
                }}
              >
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
      )}
    </>
  );
};

export default ProgressGates;
