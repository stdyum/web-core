import { Pagination } from '../../pagination/models/pagination.models';

export type TeacherPagination = Pagination<Teacher>

export interface Teacher {
  id: string;
  studyPlaceId: string;
  name: string;
}