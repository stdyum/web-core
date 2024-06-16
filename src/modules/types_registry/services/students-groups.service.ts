import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { httpContextWithStudyPlace } from '../../studyplaces/utils/selectedStudyPlaceId';
import { StudentGroup } from '../models/students_groups.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StudentsGroupsService {
  private http = inject(HttpClient);

  add(studentGroup: StudentGroup): Observable<StudentGroup> {
    return this.http.post<StudentGroup[]>(`api/types_registry/v1/students_groups`, {
      groupId: studentGroup.groupId,
      studentIds: [studentGroup.studentId],
    }, {
      context: httpContextWithStudyPlace(),
    })
      .pipe(map(arr => arr[0]));
  }

  remove(studentGroup: StudentGroup): Observable<void> {
    return this.http.delete<void>(`api/types_registry/v1/students_groups`, {
      body: { studentId: studentGroup.studentId, groupId: studentGroup.groupId },
      context: httpContextWithStudyPlace(),
    });
  }
}
