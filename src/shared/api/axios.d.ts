import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    allowUnsuccessfulResponse?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
    allowUnsuccessfulResponse?: boolean;
  }
}
