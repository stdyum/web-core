import { UserPreview } from '../models/auth.model';

export interface AuthResponse {
  user: UserPreview;
  tokens: {
    access: string
  };
  enrollment: {
    id: string,
  };
}