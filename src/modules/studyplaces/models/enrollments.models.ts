import { Pagination } from '../../pagination/models/pagination.models';

export type EnrollmentPagination = Pagination<Enrollment>

export interface Enrollment {
  id: string,
  userId: string,
  studyPlaceId: string,
  studyPlaceTitle: string,
  userName: string,
  role: string,
  typeId: string,
  permissions: string[],
  accepted: boolean
}

