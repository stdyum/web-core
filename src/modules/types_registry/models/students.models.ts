import { Pagination } from '../../pagination/models/pagination.models';

export type StudentPagination = Pagination<Student>

export interface Student {
  id: string;
  studyPlaceId: string;
  name: string;
}