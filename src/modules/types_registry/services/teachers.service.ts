import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { map, Observable, tap } from 'rxjs';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { Teacher, TeacherPagination } from '../models/teachers.models';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  loadedTeachers = signal<TeacherPagination | null>(null);

  private http = inject(HttpClient);

  load(params: PaginationParams | null = null, studyPlaceId: string | null = null): Observable<TeacherPagination | null> {
    return this.http.get<TeacherPagination>('api/types_registry/v1/teachers', this.getLoadHttpOptions(studyPlaceId, params))
      .pipe(tap(this.loadedTeachers.set.bind(this.loadedTeachers)));
  }

  loadForSelect(params: PaginationParams | null = null, studyPlaceId: string | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.load(params, studyPlaceId)
      .pipe(map(this.mapTeachersToSelectPagination.bind(this)));
  }

  add(teacher: Teacher): Observable<void> {
    return this.http.post<void>(`api/types_registry/v1/teachers`, { list: [teacher] }, {
      context: httpContextWithStudyPlace(),
    });
  }

  update(id: string, teacher: Teacher): Observable<void> {
    return this.http.put<void>(`api/types_registry/v1/teachers/${id}`, teacher, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(teacher: Teacher): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/teachers`, {
      body: { ids: [teacher.id] },
      context: httpContextWithStudyPlace(),
    });
  }

  private mapTeachersToSelectPagination(teachers: TeacherPagination | null): ItemPaginationItem<PaginationParams> | null {
    if (!teachers) return null;

    return {
      items: teachers.items.map(v => <Item>{
        value: v.id,
        display: v.name,
      }),
      hasNext: !!teachers.next,
      meta: teachers.next,
    };
  }

  private getLoadHttpOptions(studyPlaceId: string | null, params: PaginationParams | null = null): {
    [key: string]: any
  } {
    const options: { [key: string]: any } = { params: params ?? {} };
    if (studyPlaceId) {
      options['headers'] = { 'Study-Place-Id': studyPlaceId };
    } else {
      options['context'] = httpContextWithStudyPlace();
    }

    return options;
  }
}
