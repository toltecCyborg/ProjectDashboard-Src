import { MSGraphClientV3 } from "@microsoft/sp-http";
import { IPlannerListItem, ITaskListItem } from "../../../models";
import { GetDelay } from "./GetDelay";

export interface IPlanItem {
  id: string;
  title: string;
  owner: string;
}

export interface IBucketItem {
  id: string;
  name: string;
}

export class PlannerService {
  private graphClient: MSGraphClientV3;

  constructor(graphClient: MSGraphClientV3) {
    this.graphClient = graphClient;
  }

  // Obtener los detalles de un plan de Planner
  public async getPlanDetails(groupId: string, planName: string): Promise<ITaskListItem[]> {
    try {
      // Obtener el ID del plan
      //let planId = "d-PaxcdMw0SdM122XZUHW2UAAgiU";    
      //groupId = "5c933eeb-3c3d-4610-8437-4daa637dfcd4";
      //console.log("[getPlanDetails] planId : "+planName+ " groupId: "+groupId);
      if(groupId.includes("-0000-")) groupId = "5c933eeb-3c3d-4610-8437-4daa637dfcd4";
      if(planName === "") planName = "PlanCascade";

      const planId = await this.getPlanId(groupId, planName);

      //console.log("[getPlanDetails] planId1 : "+planId);

      if (!planId) {
        throw new Error("Plan not found");
      }
      // Obtener los detalles del plan
      // const plan : IPlanItem = await this.graphClient
      //   .api(`/planner/plans/${planId}`)
      //   .get();

      //console.log("[getPlanDetails] plan: "+plan.title+"-"+plan.id)

      // Obtener las tareas del plan
      const bucketsResponse = await this.graphClient
        .api(`/planner/plans/${planId}/buckets`)
        .get();
        
      const buckets: IBucketItem[] = bucketsResponse.value; // Accede a `value`
      //console.log("[getPlanDetails] buckets:", buckets);

      // Obtener las tareas del plan
      const tasksResponse = await this.graphClient
        .api(`/planner/plans/${planId}/tasks`)
        .get();

      const tasks: IPlannerListItem[] = tasksResponse.value; // Accede a `value`
      //console.log("[getPlanDetails] tasks:", tasks);

      // Mapear los datos a la interfaz IPlanListItem
      return Object.values(tasks).map((task: IPlannerListItem) => ({
        Id: task.id,
        Title: this.getBucketNameById(task.bucketId,buckets),
        Complete: task.percentComplete?task.percentComplete:0 ,
        Task: task.title?task.title:"",
        Deliverable: task.title?task.title:"",
        Description: task.title?task.title:"",
        Start: new Date(task.startDateTime?task.startDateTime:"") ,
        Finish: new Date(task.dueDateTime?task.dueDateTime:"") ,
        ActualFinish: new Date(task.completedDateTime?task.completedDateTime:"") ,
          Effort: GetDelay(new Date(task.dueDateTime?task.dueDateTime:""), new Date(task.completedDateTime?task.completedDateTime:"") ),
        }))
      ;

      // planName: plan.title,
      // bucketName: this.getBucketNameById(task.bucketId, buckets),
      // planId: task.planId,
      // bucketId: task.bucketId,
      // id: task.id,
      // title: task.title,
      // startDateTime: task.startDateTime,
      // dueDateTime: task.dueDateTime,
      // percentComplete: task.percentComplete,

      // export interface IPlannerListItem {
      //   id: string;
      //   title: string;
      //   startDateTime?: string;
      //   dueDateTime?: string;
      //   completedDateTime?: string;
      //   percentComplete?: number;
      //   priority?: number;
      //   checklistItemCount?: number;
      //   activeChecklistItemCount?: number;
      //   planId: string;
      //   bucketId: string;
      //   planName?: string;
      //   bucketName?: string;
      // }

    } catch (error) {
      console.error("Error fetching plan details:", error);
      throw error;
    }
  }

  private getBucketNameById(bucketId: string, buckets: IBucketItem[]): string  {
    const bucket = buckets.find(b => b.id === bucketId);
    return bucket ? bucket.name : ""; // Devuelve el nombre si lo encuentra, sino undefined
  }

  // Obtener el ID del plan por nombre
  private async getPlanId(groupId: string, planName: string): Promise<string > {
    console.log("[getPlanId] groupId: "+groupId + " planName:"+planName )
    
    try{
      const plans = await this.graphClient
      .api(`/groups/${groupId}/planner/plans`)
      .get();
    
      if(plans.Count > 0 ){
        const plan = plans.value.find((p: any) => p.title === planName);

        console.log("[getPlanId] plan: "+plan.id + " Name: "+plan.displayName)
        //ToDo: To Correct Hardcode
        return plan ? plan.id : "d-PaxcdMw0SdM122XZUHW2UAAgiU";  
      } else {
        //ToDo: To Correct Hardcode
        return "d-PaxcdMw0SdM122XZUHW2UAAgiU";
      }

    }catch (error) {
      console.error("[getPlanId] Error fetching plan details:", error);
      throw error;
    }
    return "";
  }
}