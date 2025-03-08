/* eslint-disable guard-for-in */
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

export interface IAttachements {
  Description: string;
  Url: string;
}

export class PlannerService {
  private graphClient: MSGraphClientV3;

  constructor(graphClient: MSGraphClientV3) {
    this.graphClient = graphClient;
  }

  // Obtener los detalles de un plan de Planner
  public async getPlanDetails(planId: string): Promise<ITaskListItem[]> {
    try {
      console.log("[getPlanDetails] planId : "+planId);

      if (!planId) {
        throw new Error("Plan not defined");
      }          

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
      
      if(tasks.length > 0){            
        for(let i=0; i < tasks.length ; i++){          
          const attachments = this.getAttachements(tasks[i].id) ;
          if((await attachments).Description.length > 0){
            tasks[i].attachementUrl = (await attachments).Url;
            tasks[i].attachementDescription = (await attachments).Description;
            console.log(`<a href="${tasks[i].attachementUrl}" target="_blank">${tasks[i].attachementDescription}</a>`);
          }           
        }
      }   
 
      // Mapear los datos a la interfaz IPlanListItem
      return Object.values(tasks).map((task: IPlannerListItem) => ({
        Id: task.id,
        Title: this.getBucketNameById(task.bucketId,buckets),
        Complete: task.percentComplete?task.percentComplete:0 ,
        Task: task.title?task.title:"",
        Deliverable: task.title?task.title:"",
        Description: task.title?task.title:"",
        Start: task.startDateTime ? new Date(task.startDateTime) : undefined ,
        Finish: task.dueDateTime ? new Date(task.dueDateTime) : undefined ,
        EvidenceOfCompletion: {Url: task.attachementUrl||"", Description: task.attachementDescription||""},
        ActualFinish: task.completedDateTime ? new Date(task.completedDateTime) : undefined ,
          Effort: GetDelay( task.dueDateTime ? new Date(task.dueDateTime) : new Date() ,  task.completedDateTime ? new Date(task.completedDateTime) : new Date() ),
        })).sort((a, b) => a.Task.localeCompare(b.Task))
      ; 

    } catch (error) {
      console.error("Error fetching plan details:", error);
      throw error;
    }
  }

  // private async populateAttachements(taskId: string): Promise<IAttachements > {

  // }
  private async getAttachements(taskId: string): Promise<IAttachements > {
    let attachement: IAttachements = {
          Url : "",
          Description : "",
        }
        const taskDetails = await this.graphClient
        .api(`/planner/tasks/${taskId}/details`)
        .get();

        if (taskDetails.references)
        {
          const references = taskDetails.references;
          for (const encodedUrl in references) {
            const decodedUrl = decodeURI(decodeURIComponent(encodedUrl)); // Decodificar la URL
            const filename = references[encodedUrl].alias; // Obtener el nombre del archivo
            attachement.Url = decodedUrl;
            attachement.Description = filename;
            //console.log(`<a href="${attachement.Url}" target="_blank">${attachement.Description}</a>`);
          }  
          //console.log("[getAttachements] References - " + references.length + " - " + taskId + " ; "+ attachement.Description+ " => " + attachement.Url);
            
        }
    return attachement || {Url:"",Description:""}; // Devuelve el nombre si lo encuentra, sino undefined
  }

  private getBucketNameById(bucketId: string, buckets: IBucketItem[]): string  {
    const bucket = buckets.find(b => b.id === bucketId);
    return bucket ? bucket.name : ""; // Devuelve el nombre si lo encuentra, sino undefined
  }

  // Obtener el ID del plan por nombre
  public async getPlanId(groupId: string, planName: string): Promise<string > {
    //console.log("[getPlanId] groupId: "+groupId + " planName:"+planName )
    
    try{
      const plansResponse = await this.graphClient
      .api(`/groups/${groupId}/planner/plans`)
      .get();
         
      const plans: IPlanItem[] = plansResponse.value; // Accede a `value`    

      if(plans.length > 0 ){
        const plan = plans.find((p: any) => p.title === planName);

        //console.log("[getPlanId] plan: "+plan?.id + " Name: "+plan?.title)
        //ToDo: To Correct Hardcode
        return plan ? plan.id : "";  
      } else {
        console.log("[getPlanId] Error fetching plan details...");
        //ToDo: To Correct Hardcode
        return "";
      }

    }catch (error) {
      console.error("[getPlanId] Error fetching plan details:", error);
      throw error;
    }
    return "";
  }
}