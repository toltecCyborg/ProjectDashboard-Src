export interface IPlannerListItem {
  id: string;
  title: string;
  orderHint: string;
  startDateTime?: string;
  dueDateTime?: string;
  completedDateTime?: string;
  percentComplete?: number;
  priority?: number;
  checklistItemCount?: number;
  activeChecklistItemCount?: number;
  planId: string;
  bucketId: string;
  planName?: string;
  bucketName?: string;
  attachementUrl? : string;
  attachementDescription?: string;
  
}