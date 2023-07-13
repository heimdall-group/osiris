import { Profile_Follow, Profile_Followers, Profile_Following } from "./profile.model";

export interface Return {
  data?: Object,
  success: boolean,
  message?: string,
  error?: string,
  error_code?: string,
} 

export interface Return_Followers {
  data?: Profile_Followers | 'completed' | 'no-followers',
  success: boolean,
  message?: string,
  error?: string,
  error_code?: string,
} 

export interface Return_Following {
  data?: Profile_Following | 'completed' | 'no-followers',
  success: boolean,
  message?: string,
  error?: string,
  error_code?: string,
} 