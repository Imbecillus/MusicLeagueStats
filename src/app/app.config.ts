import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { initializeCompetitors } from '../providers/CompetitorProvider';
import { initializeSubmissions } from '../providers/SubmissionProvider';
import { initializeVotes } from '../providers/VoteProvider';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { initializeRounds } from '../providers/RoundProvider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeRounds,
      deps: [HttpClient],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeCompetitors,
      deps: [HttpClient],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeSubmissions,
      deps: [HttpClient],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeVotes,
      deps: [HttpClient],
      multi: true
    }
  ]
};
