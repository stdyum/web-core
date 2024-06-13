import { Pagination } from '../../pagination/models/pagination.models';

export type StudentsGroupPagination = Pagination<StudentGroup>

export interface StudentGroup {
  studyPlaceId: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
}