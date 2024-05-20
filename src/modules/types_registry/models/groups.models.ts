import { Pagination } from '../../pagination/models/pagination.models';

export type GroupPagination = Pagination<Group>

export interface Group {
  id: string;
  studyPlaceId: string;
  name: string;
}