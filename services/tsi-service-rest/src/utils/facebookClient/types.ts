/**
 * Description: Types and interfaces for Facebook API client
 */

export interface IFacebookClient {
  facebookAuth(shortTermAccessToken: string): Promise<FacebookUser>;
}

export type LongLivedAccessTokenData = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type FacebookUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  data: FacebookUserAvatar;
};

export type FacebookUserAvatar = {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
};
