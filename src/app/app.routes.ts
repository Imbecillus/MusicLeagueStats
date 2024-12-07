import { Routes } from '@angular/router';
import { YourWrappedComponent } from './your-wrapped/your-wrapped.component';
import { ScoreOverviewComponent } from './scoreOverview/score-overview.component';

export const routes: Routes = [
  { path: '', component: ScoreOverviewComponent },
  { path: 'your-wrapped', component: YourWrappedComponent }
];
