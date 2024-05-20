import { Pagination, PaginationParams } from '../models/pagination.models';

export type PaginationRelativeTo = 'combined' | 'current';

export interface PaginationOptions<T> {
  savePrevious: boolean;
  relativeTo: PaginationRelativeTo;
  emitLoadNext: (processor: PaginationProcessor<T>, params: PaginationParams) => void;
  emitLoadPrevious: (processor: PaginationProcessor<T>, params: PaginationParams) => void;
}

export class PaginationProcessor<T> {
  private currentModel: Pagination<T>;
  private combinedModel: Pagination<T> | null;

  constructor(initial: Pagination<T>, private options: PaginationOptions<T>) {
    this.currentModel = initial;
    this.combinedModel = options.savePrevious ? Object.assign({}, initial) : null;
  }

  get value(): Pagination<T> {
    return this.getRelativePagination(this.options.relativeTo);
  }

  loadNext(relativeTo: PaginationRelativeTo = this.options.relativeTo): void {
    const pagination = this.getRelativePagination(relativeTo);
    this.options.emitLoadNext(this, pagination.next);
  }

  loadPrevious(relativeTo: PaginationRelativeTo = this.options.relativeTo): void {
    const pagination = this.getRelativePagination(relativeTo);
    this.options.emitLoadPrevious(this, pagination.previous);
  }

  setNext(pagination: Pagination<T>): void {
    this.currentModel = pagination;
    if (this.options.savePrevious) {
      this.appendNext(pagination);
    }
  }

  setPrevious(pagination: Pagination<T>): void {
    this.currentModel = pagination;
    if (this.options.savePrevious) {
      this.appendPrevious(pagination);
    }
  }

  private appendNext(pagination: Pagination<T>): void {
    if (this.setCombinedModelIfNull(pagination)) return;

    const combinedModel = this.combinedModel!;

    combinedModel.next = pagination.next;
    combinedModel.items = [...combinedModel.items, ...pagination.items];

    this.combinedModel = { ...combinedModel };
  }

  private appendPrevious(pagination: Pagination<T>): void {
    if (this.setCombinedModelIfNull(pagination)) return;

    const combinedModel = this.combinedModel!;

    combinedModel.previous = pagination.previous;
    combinedModel.items = [...pagination.items, ...combinedModel.items];

    this.combinedModel = { ...combinedModel };
  }

  private setCombinedModelIfNull(pagination: Pagination<T>): boolean {
    if (this.combinedModel) return false;

    this.combinedModel = pagination;
    return true;
  }

  private getRelativePagination(relativeTo: PaginationRelativeTo): Pagination<T> {
    switch (relativeTo) {
      case 'combined':
        return this.combinedModel ?? this.currentModel;
      case 'current':
        return this.currentModel;
      default:
        return this.combinedModel ?? this.currentModel;
    }
  }
}
