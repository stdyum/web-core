import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { map, Observable, tap } from 'rxjs';
import { StudentPagination } from '../models/students.models';
import { Group, GroupPagination } from '../models/groups.models';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/pagination';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  loadedGroups = signal<GroupPagination | null>(null);

  private http = inject(HttpClient);

  load(params: PaginationParams | null = null): Observable<GroupPagination | null> {
    return this.http.get<StudentPagination>('api/types_registry/v1/groups', {
      params: params ?? {},
      context: httpContextWithStudyPlace(),
    })
      .pipe(tap(this.loadedGroups.set.bind(this.loadedGroups)));
  }

  loadForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.load(params)
      .pipe(map(this.mapGroupsToSelectPagination.bind(this)));
  }

  add(group: Group): Observable<Group> {
    return this.http.post<Group[]>(`api/types_registry/v1/groups`, { list: [group] }, {
      context: httpContextWithStudyPlace(),
    })
      .pipe(map(arr => arr[0]));
  }

  update(id: string, group: Group): Observable<void> {
    return this.http.put<void>(`api/types_registry/v1/groups/${id}`, group, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(group: Group): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/groups`, {
      body: { ids: [group.id] },
      context: httpContextWithStudyPlace(),
    });
  }

  private mapGroupsToSelectPagination(teachers: GroupPagination | null): ItemPaginationItem<PaginationParams> | null {
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
