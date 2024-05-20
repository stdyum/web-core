import { Pagination } from '../../pagination/models/pagination.models';

export type RoomPagination = Pagination<Room>

export interface Room {
  id: string;
  studyPlaceId: string;
  name: string;
}