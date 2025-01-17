export interface ITaskListItem {
    Id: string;
    Title: string;
    Complete: number;
    Delay: number;
    Deliverable: string;
    Task: string;
    Description?: string;
    Responsible?: string;
    Start?: Date;
    Finish?: Date;
    Barriers?: string;
    ActualFinish?: Date;
    Effort?: number; 
    ActionableStatus?: string;
    EvidenceOfCompletion?: string;
  }