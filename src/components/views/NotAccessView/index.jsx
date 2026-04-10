// Styles
import { memo } from "react";

function NotAccessView() {
  return (
    <section className="not-access-view d-flex align-items-center justify-content-center w-100 min-vh-100 position-relative overflow-hidden px-3">
      <div className="not-access-view__overlay position-absolute" />

      <div className="not-access-view__card position-relative text-center w-100 mx-auto">
        <div className="not-access-view__icon-box d-flex justify-content-center mb-3">
          <div className="not-access-view__icon d-flex align-items-center justify-content-center position-relative">
            <span className="not-access-view__screen d-block position-relative" />

            <span className="not-access-view__warning bg-white position-absolute text-center rounded-circle">
              !
            </span>
          </div>
        </div>

        <p className="not-access-view__eyebrow mb-2 text-uppercase fw-bold">
          Acceso no disponible
        </p>

        <h1 className="not-access-view__title mb-0 fw-bold">
          Este sistema requiere una pantalla más grande
        </h1>

        <p className="not-access-view__description mt-3 mb-0 mx-auto">
          Para visualizar correctamente esta plataforma, necesitas ingresar
          desde una laptop o computadora de escritorio, o usar una ventana con
          un ancho mayor.
        </p>

        <div className="not-access-view__message mt-4 mx-auto d-inline-flex align-items-center justify-content-center">
          <span className="not-access-view__message-dot" />
          <span>
            Usa una pantalla de al menos <strong>1025px de ancho</strong>.
          </span>
        </div>
      </div>
    </section>
  );
}

export default memo(NotAccessView);
