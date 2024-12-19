import * as React from "react";
import { useState } from "react";
import { IProjectListItem } from "../../../models";
//import "~@bootstrap/;

interface ListProjectProps {
  items: IProjectListItem[];
  heading: string;
  grouper: string;
  selection: string;
  onSelectItem: (item: string) => void;
}
const ListProject = ({ items, heading, onSelectItem }: ListProjectProps) => {
  //Hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Project</th>
            <th>List Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.Id}
              className={selectedIndex === index ? "table-active" : ""}
              onClick={() => {
                setSelectedIndex(index);
                onSelectItem(item.Title);
              }}
            >
              <td>{item.Title}</td>
              <td>{item.ListName}</td>
              <td>{item.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListProject;
