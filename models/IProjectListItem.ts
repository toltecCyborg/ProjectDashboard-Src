export interface IProjectListItem {
    Id: string;
    Title: string;
    ListName: string,
    isPlanner: boolean,
    Link: {
      Url: string,
      Description: string
    }
  } 