/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { IGateListItem } from "../../../models";
import styles from "./ProjectDashboard.module.scss";

interface GateCardProps {
  gates: IGateListItem[];
  showDetails: boolean;
  onSelectItem: (item: string, group: string) => void;
}
const ProgressGates = ({ gates, onSelectItem, showDetails }: GateCardProps) => {
  const getBackgroundImage = (delay: number, complete: number) => {
    if (complete === 1) {
      return require("../assets/ArrowGreen.png");
    } else if (delay >= 7) {
      return require("../assets/ArrowRed.png");
    } else if (delay > 0) {
      return require("../assets/ArrowYellow.png");
    } else {
      return require("../assets/ArrowWhite.png");
    }
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
              style={{ position: "relative", width: "80px", height: "80px" }}
              key={gate.Id}
            >
              <img
                alt=""
                src={getBackgroundImage(gate.Delay, gate.Complete)}
                className={styles["iconArrow"]}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "20%",
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
                  <strong>
                    {gate.Title.length > 7
                      ? gate.Title.substring(0, 7)
                      : gate.Title}{" "}
                  </strong>
                </h5>
                <p>
                  <strong>{Math.floor(gate.Complete)}% </strong>
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
                  <strong>
                    {gate.Title.length > 7
                      ? gate.Title.substring(0, 7)
                      : gate.Title}{" "}
                  </strong>
                </h5>
                <p>
                  <strong>{Math.floor(gate.Complete)}% </strong>
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
