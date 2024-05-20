import { Pagination } from '../../pagination/models/pagination.models';

export type SubjectPagination = Pagination<Subject>

export interface Subject {
  id: string;
  studyPlaceId: string;
  name: string;
}