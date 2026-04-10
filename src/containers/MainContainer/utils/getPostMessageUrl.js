// Constants
import { WIX_APP_URL } from "data/envs";
import { ALLOWED_URLS_FOR_MAKE_POST_MESSAGE } from "data/urls";

/**
 * Callback to get post message url
 * @returns {string|undefined} Url
 */
export default function getPostMessageUrl() {
  return (
    ALLOWED_URLS_FOR_MAKE_POST_MESSAGE.find((url) =>
      window.location.href.includes(url.replace(/\./g, "-"))
    ) ?? WIX_APP_URL
  );
}
