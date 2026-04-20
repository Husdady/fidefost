// Images
import offlineViewImageSrc from "./offline-image.jpg";

<<<<<<< HEAD
// Utils
import classnames from "utils/classnames";

export default function OfflineView() {
  return (
    <section
      className="offline-view d-flex flex-column align-items-center justify-content-center mx-auto"
    >
=======
export default function OfflineView() {
  return (
    <section className="offline-view d-flex flex-column align-items-center justify-content-center mx-auto">
>>>>>>> feature/ui
      <img
        width={300}
        height={200}
        alt="offline-view"
        className="offline-view-image"
        src={offlineViewImageSrc}
      />

      <h6 className="message mt-2">You have no an internet connection</h6>
    </section>
  );
}