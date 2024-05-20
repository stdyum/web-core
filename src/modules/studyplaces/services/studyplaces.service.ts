import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { StudyPlacePagination } from '../models/studyplaces.models';

@Injectable({
  providedIn: 'root',
})
export class StudyPlacesService {
  private http = inject(HttpClient);

  loadStudyplaces(params: PaginationParams | null = null): Observable<StudyPlacePagination | null> {
    return this.http.get<StudyPlacePagination>('api/studyplaces/v1/studyplaces', {
      params: params ?? {},
      observe: 'response',
    })
      .pipe(map(r => {
        if (r.status >= 400) throw r;
        return r.body;
      }));
  }

  loadStudyplacesForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.loadStudyplaces(params)
      .pipe(map(this.mapStudyplacesToSelectPagination.bind(this)));
  }

  private mapStudyplacesToSelectPagination(studyplace: StudyPlacePagination | null): ItemPaginationItem<PaginationParams> | null {
    if (!studyplace) return null;

    return {
      items: studyplace.items.map(v => <Item>{
        value: v.id,
        display: v.title,
      }),
      hasNext: !!studyplace.next,
      meta: studyplace.next,
    };
  }
}
