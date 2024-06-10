import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Translation } from '../models/translation';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  all = signal<{ [lang: string]: Translation }>({});
  currentLanguage = signal<string>('en-us');

  current = computed(() => this.all()[this.currentLanguage()] ?? {});

  private http = inject(HttpClient);

  constructor() {
    this.load(this.currentLanguage()).subscribe();
  }

  load(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/i18n/${lang}.json`)
      .pipe(take(1))
      .pipe(tap(t => this.all.update(a => {
        a[lang] = t;
        return { ...a };
      })));
  }

  getTranslation(key: string): Signal<string> {
    return computed(() => this.current()[key] ?? key);
  }

  set(lang: string): void {
    if (this.all()[lang])
      this.currentLanguage.set(lang);
    else
      this.load(lang).subscribe(() => this.currentLanguage.set(lang));
  }
}
