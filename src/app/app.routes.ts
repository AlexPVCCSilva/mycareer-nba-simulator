import { Routes } from '@angular/router';
import { CreationComponent } from './features/creation/creation';
import { SeasonHubComponent } from './features/season-hub/season-hub';
import { DraftComponent } from './features/draft/draft';
import { NbaHubComponent } from './features/nba-hub/nba-hub'; 

export const routes: Routes = [
  { path: '', component: CreationComponent },
  { path: 'hub', component: SeasonHubComponent },
  { path: 'draft', component: DraftComponent }, // Rota padrão
  { path: 'nba', component: NbaHubComponent },
  { path: '**', redirectTo: '' } // Se o cara digitar URL imbecil, volta pro início
];