
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './DashboardWebPart.module.scss';
//import { IGateListItem } from "../../models";

export interface IDashboardWebPartProps {
  description : string ;
}

export default class DashboardWebPart extends BaseClientSideWebPart<IDashboardWebPartProps> {

  private msg : string = "monitor...";
  //private _gates: IGateListItem[] = [];
  // const getCardClass = (delay: number, complete: number) => {
  //   if (complete === 1) return styles.green;
  //   if (delay > 0 && delay <= 7) return styles.yellow;
  //   if (delay > 7) return styles.red;
  //   return styles.white; // Default Class
  // };

  public render(): void {
    this.domElement.innerHTML = `
    <section class="${styles.dashboard} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">      
      <div> <a href="https://ed2corp.sharepoint.com/sites/ED2Team/SitePages/SW_RFCascade.aspx" target="_blank">
        <h1>RF Cascade
        <p>
     ` + this.msg +` </p>  
        <div className="task-card">
          <svg
            width="200"
            height="200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ border: "2px solid blue" }}
          >
            <circle cx="100" cy="100" r="80" fill="white" stroke="black" strokeWidth="2"  />
            <rect x="80" y="1" rx="10" width="50" height="50" fill="green" stroke="black" strokeWidth="2"  />
            <rect x="149" y="50" rx="10" width="50" height="50" fill="red" stroke="black" strokeWidth="2"  />
            <rect x="130" y="130" rx="10" width="50" height="50" fill="yellow" stroke="black" strokeWidth="2"  />
            <rect x="20" y="130" rx="10" width="50" height="50" fill="white" stroke="black" strokeWidth="2"  />
            <rect x="1" y="50" rx="10" width="50" height="50" fill="white" stroke="black" strokeWidth="2"  />

            <text x="100" y="35" fill="darkblue" font-size="24"> 1 </text>
            <text x="170" y="85" fill="darkblue" font-size="24"> 2 </text>
            <text x="150" y="165" fill="darkblue" font-size="24"> 3 </text>
            <text x="40" y="165" fill="darkblue" font-size="24"> 4 </text>
            <text x="20" y="85" fill="darkblue" font-size="24"> 5 </text>

            <text x="70" y="110" fill="black" font-size="35"> 75%  </text>
            </svg>
        </div>
      </a></div>
    </section>`;
  }

  // public render(): void {
  //   this.domElement.innerHTML = `
  //   <section class="${styles.dashboard} ${!!this.context.sdks.microsoftTeams ? styles.teams : ''}">      
  //     <div> <a href="https://ed2corp.sharepoint.com/sites/ED2Team/SitePages/SW_RFCascade.aspx" target="_blank">
  //       <h1>RF Cascade</h1>
        
  //       <div className="task-card">
  //         <svg
  //           width="200"
  //           height="200"
  //           xmlns="http://www.w3.org/2000/svg"
  //           style={{ border: "2px solid blue" }}
  //         >
  //           <circle cx="100" cy="100" r="80" fill="white" stroke="black" strokeWidth="2"  />
  //           <rect x="80" y="1" rx="10" width="50" height="50" fill="green" stroke="black" strokeWidth="2"  />
  //           <rect x="149" y="50" rx="10" width="50" height="50" fill="red" stroke="black" strokeWidth="2"  />
  //           <rect x="130" y="130" rx="10" width="50" height="50" fill="yellow" stroke="black" strokeWidth="2"  />
  //           <rect x="20" y="130" rx="10" width="50" height="50" fill="white" stroke="black" strokeWidth="2"  />
  //           <rect x="1" y="50" rx="10" width="50" height="50" fill="white" stroke="black" strokeWidth="2"  />

  //           <text x="100" y="35" fill="darkblue" font-size="24"> 1 </text>
  //           <text x="170" y="85" fill="darkblue" font-size="24"> 2 </text>
  //           <text x="150" y="165" fill="darkblue" font-size="24"> 3 </text>
  //           <text x="40" y="165" fill="darkblue" font-size="24"> 4 </text>
  //           <text x="20" y="85" fill="darkblue" font-size="24"> 5 </text>

  //           <text x="70" y="110" fill="black" font-size="35"> 75%  </text>
  //           </svg>
  //       </div>
  //     </a></div>
  //   </section>`;
  // }

}
