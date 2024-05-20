import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Preferences, SchedulePreferences } from '../models/preferences.models';
import { httpContextWithStudyPlace } from '../utils/selectedStudyPlaceId';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  preferences = signal<Preferences | null>(null);
  schedule = computed(() => this.preferences()?.schedule);

  private http = inject(HttpClient);

  load(): Observable<Preferences | null> {
    return this.http.get<Preferences>('api/studyplaces/v1/preferences', {
      context: httpContextWithStudyPlace(),
    })
      .pipe(map(this.validatePreferences.bind(this)))
      .pipe(tap(this.preferences.set.bind(this.preferences)));
  }

  save(group: string, preferences: any): Observable<void> {
    return this.http.put<void>('api/studyplaces/v1/preferences', {
      group: group,
      preferences: preferences,
    }, {
      context: httpContextWithStudyPlace(),
    });
  }

  private validatePreferences(preferences: Preferences): Preferences {
    preferences.schedule = this.validateSchedulePreferences(preferences.schedule);
    return preferences;
  }

  private validateSchedulePreferences(preferences: SchedulePreferences | any): SchedulePreferences | null {
    if (!preferences) return null;

    return typeof preferences.column === 'string' &&
    typeof preferences.columnId === 'string'
      ? preferences : null;
  };
}
