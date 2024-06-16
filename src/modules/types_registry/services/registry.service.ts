import { inject, Injectable } from '@angular/core';
import { GroupsService } from './groups.service';
import { RoomsService } from './rooms.service';
import { StudentsService } from './students.service';
import { SubjectsService } from './subjects.service';
import { TeachersService } from './teachers.service';
import { Observable, of } from 'rxjs';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { ItemPaginationItem } from '@likdan/form-builder-material/pagination';
import { GroupPagination } from '../models/groups.models';
import { RoomPagination } from '../models/rooms.models';
import { StudentPagination } from '../models/students.models';
import { SubjectPagination } from '../models/subjects.models';
import { TeacherPagination } from '../models/teachers.models';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private groups = inject(GroupsService);
  private rooms = inject(RoomsService);
  private students = inject(StudentsService);
  private subjects = inject(SubjectsService);
  private teachers = inject(TeachersService);

  getGroupsPaginatedForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.groups.loadForSelect(params);
  }

  getRoomsPaginatedForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.rooms.loadForSelect(params);
  }

  getStudentsPaginatedForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.students.loadForSelect(params);
  }

  getSubjectsPaginatedForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.subjects.loadForSelect(params);
  }

  getTeachersPaginatedForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.teachers.loadForSelect(params);
  }

  getByNameForSelect(name: string, params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    switch (name) {
      case 'group':
        return this.getGroupsPaginatedForSelect(params);
      case 'room':
        return this.getRoomsPaginatedForSelect(params);
      case 'student':
        return this.getStudentsPaginatedForSelect(params);
      case 'subject':
        return this.getSubjectsPaginatedForSelect(params);
      case 'teacher':
        return this.getTeachersPaginatedForSelect(params);
    }

    return of(null);
  }

  getLoadedGroups(): GroupPagination | null {
    return this.groups.loadedGroups();
  }

  getLoadedRooms(): RoomPagination | null {
    return this.rooms.loadedRooms();
  }

  getLoadedStudents(): StudentPagination | null {
    return this.students.loadedStudents();
  }

  getLoadedSubjects(): SubjectPagination | null {
    return this.subjects.loadedSubjects();
  }

  getLoadedTeachers(): TeacherPagination | null {
    return this.teachers.loadedTeachers();
  }

  getGroupsPaginatedSelectConfig(): Object {
    return {
      items: this.getGroupsPaginatedForSelect(),
      next: (options: any, meta: any) => this.getGroupsPaginatedForSelect({ ...options, ...meta }),
      reload: (options: any) => this.getGroupsPaginatedForSelect(options),
    };
  }

  getRoomsPaginatedSelectConfig(): Object {
    return {
      items: this.getRoomsPaginatedForSelect(),
      next: (options: any, meta: any) => this.getRoomsPaginatedForSelect({ ...options, ...meta }),
      reload: (options: any) => this.getRoomsPaginatedForSelect(options),
    };
  }

  getStudentsPaginatedSelectConfig(): Object {
    return {
      items: this.getStudentsPaginatedForSelect(),
      next: (options: any, meta: any) => this.getStudentsPaginatedForSelect({ ...options, ...meta }),
      reload: (options: any) => this.getStudentsPaginatedForSelect(options),
    };
  }

  getSubjectsPaginatedSelectConfig(): Object {
    return {
      items: this.getSubjectsPaginatedForSelect(),
      next: (options: any, meta: any) => this.getSubjectsPaginatedForSelect({ ...options, ...meta }),
      reload: (options: any) => this.getSubjectsPaginatedForSelect(options),
    };
  }

  getTeachersPaginatedSelectConfig(): Object {
    return {
      items: this.getTeachersPaginatedForSelect(),
      next: (options: any, meta: any) => this.getTeachersPaginatedForSelect({ ...options, ...meta }),
      reload: (options: any) => this.getTeachersPaginatedForSelect(options),
    };
  }
}
