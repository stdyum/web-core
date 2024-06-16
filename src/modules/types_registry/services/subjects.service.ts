import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { map, Observable, tap } from 'rxjs';
import { StudentPagination } from '../models/students.models';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';
import { Subject, SubjectPagination } from '../models/subjects.models';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/pagination';
import { TeacherPagination } from '../models/teachers.models';

@Injectable({
  providedIn: 'root',
})
export class SubjectsService {
  loadedSubjects = signal<SubjectPagination | null>(null);

  private http = inject(HttpClient);

  load(params: PaginationParams | null = null): Observable<SubjectPagination | null> {
    return this.http.get<StudentPagination>('api/types_registry/v1/subjects', {
      params: params ?? {},
      context: httpContextWithStudyPlace(),
    })
      .pipe(tap(this.loadedSubjects.set.bind(this.loadedSubjects)));
  }

  loadForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.load(params)
      .pipe(map(this.mapSubjectsToSelectPagination.bind(this)));
  }

  add(subject: Subject): Observable<Subject> {
    return this.http.post<Subject[]>(`api/types_registry/v1/subjects`, { list: [subject] }, {
      context: httpContextWithStudyPlace(),
    })
      .pipe(map(arr => arr[0]));
  }

  update(id: string, subject: Subject): Observable<void> {
    return this.http.put<void>(`api/types_registry/v1/subjects/${id}`, subject, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(subject: Subject): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/subjects`, {
      body: { ids: [subject.id] },
      context: httpContextWithStudyPlace(),
    });
  }

  private mapSubjectsToSelectPagination(teachers: TeacherPagination | null): ItemPaginationItem<PaginationParams> | null {
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
}
