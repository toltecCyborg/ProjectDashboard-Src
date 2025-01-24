import * as React from "react";
import { useState } from "react";
import { ITaskListItem } from "../../../models";
import { GetDelay } from "./GetDelay";
import { GetFormatDate } from "./GetFormatDate";
//import "~@bootstrap/;

interface ListGroupProps {
  items: ITaskListItem[];
  heading: string;
  showDetails: boolean;
  onSelectItem: (item: string, group: string) => void;
}
const ListTasks = ({ items, heading, onSelectItem, showDetails }: ListGroupProps) => {
  //Hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      { (showDetails ? items.length : items.filter((item) => Math.floor(item.Complete * 100) < 100).length ) >
        0 && (
        <div>
          <h1>{heading}</h1>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Task</th>
                <th>Completed</th>
                <th>Delay</th>
                <th>Finish</th>
                <th>Actual Finish</th>
                <th>Evidence of Completion</th>
              </tr>
            </thead>
            <tbody>
              {(showDetails ? 
                items :
                items.filter((item) => Math.floor(item.Complete * 100) < 100) 
                ).map((item, index) => (
                  <tr
                    key={item.Id}
                    className={selectedIndex === index ? "table-active" : ""}
                    onClick={() => {
                      setSelectedIndex(index);
                      onSelectItem(item.Task, "task");
                    }}
                  >
                    <td>{item.Task}</td>
                    <td>{Math.floor(item.Complete * 100)}% </td>
                    <td>{GetDelay(item.Finish, item.ActualFinish)}</td>
                    <td>{GetFormatDate(item.Finish)}</td>
                    <td>{GetFormatDate(item.ActualFinish)}</td>
                    <td>
                      <a href={item.EvidenceOfCompletion?.Url} target="_blank">
                        {item.EvidenceOfCompletion?.Description}
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ListTasks;
