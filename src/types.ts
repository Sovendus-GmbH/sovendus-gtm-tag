import type {
  ExplicitAnyType,
  InterfaceDataElementKeyType,
} from "sovendus-integration-types";

export type CookieStorageObject = {
  [key in InterfaceDataElementKeyType]: ExplicitAnyType;
};

export type CookieSetOptions = {
  "path": "/";
  "max-age": number;
  "secure": true;
};
