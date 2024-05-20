import { Pagination } from '../../pagination/models/pagination.models';

export type StudyPlacePagination = Pagination<StudyPlace>

export interface StudyPlace {
  id: string;
  title: string;
}