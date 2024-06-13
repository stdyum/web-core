import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';
import { StudentGroup } from '../models/students_groups.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentsGroupsService {
  private http = inject(HttpClient);

  add(studentGroup: StudentGroup): Observable<void> {
    return this.http.post<void>(`api/types_registry/v1/students_groups`, {
      groupId: studentGroup.groupId,
      studentIds: [studentGroup.studentId],
    }, {
      context: httpContextWithStudyPlace(),
    });
  }

  remove(studentGroup: StudentGroup): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/students_groups`, {
      body: { studentId: studentGroup.studentId, groupId: studentGroup.groupId },
      context: httpContextWithStudyPlace(),
    });
  }
}
