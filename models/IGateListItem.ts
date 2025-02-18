export interface IGateListItem {
    [x: string]: any;
    Id: string;
    Title: string;
    Complete: number;
    Delay: number;
    Count: number;
    Effort?: number;
    Start: Date;
    Finish: Date;
    ActualFinish: Date;
  }