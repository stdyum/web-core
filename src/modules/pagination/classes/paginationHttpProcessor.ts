import { computed, Injector, signal } from '@angular/core';
import { PaginationProcessor, PaginationRelativeTo } from './paginationProcessor';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { Pagination, PaginationParams } from '../models/pagination.models';

export interface PaginationQuery {
  [key: string]: any;
}

export interface PaginationHttpOptions {
  url: string;
  savePrevious?: boolean;
  relativeTo?: PaginationRelativeTo;
  query?: PaginationQuery;
  context?: (ctx: HttpContext) => HttpContext;
}

export class PaginationHttpProcessor<T> {
  processor: PaginationProcessor<T> | null = null;

  readonly pagination = signal<Pagination<T> | null>(null);
  readonly items = computed(() => this.pagination()?.items ?? []);
  readonly loading = signal(false);

  private http: HttpClient;

  constructor(private injector: Injector, public options: PaginationHttpOptions) {
    this.http = injector.get(HttpClient);
    this.initialLoad();
  }

  next(): void {
    this.processor?.loadNext();
  }

  previous(): void {
    this.processor?.loadPrevious();
  }

  private initialLoad(): void {
    if (this.loading()) return;

    this.loading.set(true);
    this.http.get<Pagination<T>>(this.options.url, {
      params: this.options.query,
      context: this.options.context ? this.options.context(new HttpContext()) : undefined,
    })
      .pipe(take(1))
      .pipe(tap(() => this.loading.set(false)))
      .pipe(tap(this.createPaginationProcessor.bind(this)))
      .subscribe(this.updateValues.bind(this));
  }

  private createPaginationProcessor(initial: Pagination<T>): void {
    this.processor = new PaginationProcessor(initial, {
      savePrevious: this.options.savePrevious ?? true,
      relativeTo: this.options.relativeTo ?? 'combined',
      emitLoadNext: (processor: PaginationProcessor<T>, params: PaginationParams): void => {
        this.loading.set(true);
        this.load$(params)
          .pipe(take(1))
          .pipe(tap(() => this.loading.set(false)))
          .pipe(tap(processor.setNext.bind(processor)))
          .subscribe(this.updateValues.bind(this));
      },
      emitLoadPrevious: (processor: PaginationProcessor<T>, params: PaginationParams): void => {
        this.loading.set(true);
        this.load$(params)
          .pipe(take(1))
          .pipe(tap(() => this.loading.set(false)))
          .pipe(tap(processor.setPrevious.bind(processor)))
          .subscribe(this.updateValues.bind(this));
      },
    });
  }

  private load$(params: PaginationParams): Observable<Pagination<T>> {
    const combinedParams = this.combineParams(params, this.options.query);
    return this.http.get<Pagination<T>>(this.options.url, {
      params: combinedParams,
      context: this.options.context ? this.options.context(new HttpContext()) : undefined,
    });
  }

  private combineParams(params: PaginationParams, query?: PaginationQuery): PaginationParams {
    return { ...query, ...params };
  }

  private updateValues(): void {
    this.pagination.set(this.processor?.value ?? null);
  }
}
