import { Routes } from '@angular/router';
import { FunFactComponent } from './funfact/funfact.component';
import { ScoreOverviewComponent } from './scoreOverview/score-overview.component';

export const routes: Routes = [
  { path: '', component: ScoreOverviewComponent },
  { path: 'funfacts', component: FunFactComponent }
];
