import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { map, Observable, tap } from 'rxjs';
import { StudentPagination } from '../models/students.models';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';
import { Room, RoomPagination } from '../models/rooms.models';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { GroupPagination } from '../models/groups.models';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  loadedRooms = signal<RoomPagination | null>(null);

  private http = inject(HttpClient);

  load(params: PaginationParams | null = null): Observable<RoomPagination | null> {
    return this.http.get<StudentPagination>('api/types_registry/v1/rooms', {
      params: params ?? {},
      context: httpContextWithStudyPlace(),
    })
      .pipe(tap(this.loadedRooms.set.bind(this.loadedRooms)));
  }

  loadForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.load(params)
      .pipe(map(this.mapRoomsToSelectPagination.bind(this)));
  }

  add(room: Room): Observable<void> {
    return this.http.post<void>(`api/types_registry/v1/rooms`, { list: [room] }, {
      context: httpContextWithStudyPlace(),
    });
  }

  update(id: string, room: Room): Observable<void> {
    return this.http.put<void>(`api/types_registry/v1/rooms/${id}`, room, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(room: Room): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/rooms`, {
      body: { ids: [room.id] },
      context: httpContextWithStudyPlace(),
    });
  }

  private mapRoomsToSelectPagination(teachers: GroupPagination | null): ItemPaginationItem<PaginationParams> | null {
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
