import type { InterfaceDataElementKeyType } from "sovendus-integration-types";

export type CookieStorageObject = {
  [key in InterfaceDataElementKeyType]: string | undefined;
};

export type CookieSetOptions = {
  "path": "/";
  "max-age": number;
  "secure": true;
};
