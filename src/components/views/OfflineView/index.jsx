// Images
import offlineViewImageSrc from "./offline-image.jpg";

export default function OfflineView() {
  return (
    <section className="offline-view d-flex flex-column align-items-center justify-content-center mx-auto">
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
