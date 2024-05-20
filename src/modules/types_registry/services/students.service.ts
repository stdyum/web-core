import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { map, Observable, tap } from 'rxjs';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { Student, StudentPagination } from '../models/students.models';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  loadedStudents = signal<StudentPagination | null>(null);

  private http = inject(HttpClient);

  load(params: PaginationParams | null = null, studyPlaceId: string | null = null): Observable<StudentPagination | null> {
    return this.http.get<StudentPagination>('api/types_registry/v1/students', this.getLoadHttpOptions(studyPlaceId, params))
      .pipe(tap(this.loadedStudents.set.bind(this.loadedStudents)));
  }

  loadForSelect(params: PaginationParams | null = null, studyPlaceId: string | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.load(params, studyPlaceId)
      .pipe(map(this.mapStudentsToSelectPagination.bind(this)));
  }

  add(student: Student): Observable<void> {
    return this.http.post<void>(`api/types_registry/v1/students`, { list: [student] }, {
      context: httpContextWithStudyPlace(),
    });
  }

  update(id: string, student: Student): Observable<void> {
    return this.http.put<void>(`api/types_registry/v1/students/${id}`, student, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(student: Student): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/students`, {
      body: { ids: [student.id] },
      context: httpContextWithStudyPlace(),
    });
  }

  private mapStudentsToSelectPagination(student: StudentPagination | null): ItemPaginationItem<PaginationParams> | null {
    if (!student) return null;

    return {
      items: student.items.map(v => <Item>{
        value: v.id,
        display: v.name,
      }),
      hasNext: !!student.next,
      meta: student.next,
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
