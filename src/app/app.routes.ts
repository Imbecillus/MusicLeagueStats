import { Routes } from '@angular/router';
import { YourWrappedComponent } from './your-wrapped/your-wrapped.component';
import { ScoreOverviewComponent } from './scoreOverview/score-overview.component';
import { EverythingWrappedComponent } from './everything-wrapped/everything-wrapped.component';

export const routes: Routes = [
  { path: '', component: EverythingWrappedComponent },
  { path: 'heatmap', component: ScoreOverviewComponent },
  { path: 'your-wrapped', component: YourWrappedComponent }
];
