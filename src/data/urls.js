// Constants
import { ORIGIN } from "./api";
import { DEV_URL, TEST_URL_01, TEST_URL_02, TEST_URL_03 } from "./envs";

export const ALLOWED_URLS_FOR_DEVELOPMENT = [DEV_URL];

export const ALLOWED_URLS_FOR_MAKE_POST_MESSAGE = [
  TEST_URL_01,
  TEST_URL_02,
  TEST_URL_03,
];

export const isAllowedOrginForMakePostMessage =
  ALLOWED_URLS_FOR_DEVELOPMENT.every((url) => url !== ORIGIN);
