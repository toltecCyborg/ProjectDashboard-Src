import * as React from "react";
import { useState } from "react";
import { ITaskListItem } from "../../../models";
//import "~@bootstrap/;

interface ListGroupProps {
  items: ITaskListItem[];
  heading: string;
  onSelectItem: (item: string, group: string) => void;
}
const ListTasks = ({ items, heading, onSelectItem }: ListGroupProps) => {
  //Hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Task</th>
            <th>Completed</th>
            <th>Delay</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.Id}
              className={selectedIndex === index ? "table-active" : ""}
              onClick={() => {
                setSelectedIndex(index);
                onSelectItem(item.Tasks, "task");
              }}
            >
              <td>{item.Tasks}</td>
              <td>{Math.floor(item.Complete * 100)}% </td>
              <td>{item.Delay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListTasks;
