// Librarys
import { memo } from "react";
import PropTypes from "prop-types";

// Components
import Modal from "components/modals/Modal";
import InputText from "components/common/InputText";

// Hook
import useOperatorForm from "./useOperatorForm";

function OperatorForm({ title, onHide, onSubmit, isShowing, defaultValues }) {
  const {
    errors,
    register,

    dragActive,
    internalSubmit,

    fileInputRef,
    selectedFiles,
    watchedFilesCount,

    handleDrop,
    handleSubmit,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleFilesChange,
    handleRemoveFile,
    handleOpenFileDialog,
  } = useOperatorForm({
    onSubmit: onSubmit,
    defaultValues: defaultValues,
  });

  return (
    <Modal centered onHide={onHide} isShowing={isShowing}>
      <section className="operator-form-modal">
        <div className="operator-form-header d-flex align-items-center justify-content-between">
          <h2 className="operator-form-title mb-0">{title}</h2>
        </div>

        <form
          className="operator-form-body"
          onSubmit={handleSubmit(internalSubmit)}
        >
          <InputText
            textLabel="NOMBRE DEL OPERADOR"
            placeholder="Ej: Transportes Globales S.A."
            customInput={register("operatorName")}
            error={errors?.operatorName?.message}
          />

          <InputText
            error={errors?.ruc?.message}
            customInput={register("ruc")}
            textLabel="RUC (Registro Único)"
            placeholder="Ingrese 11 dígitos"
          />

          <div className="operator-form-field">
            <label className="operator-form-label mb-2">
              DOCUMENTACIÓN LEGAL
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="d-none"
              onChange={handleFilesChange}
            />

            <button
              type="button"
              className={`operator-form-dropzone ${
                dragActive ? "drag-active" : ""
              } ${errors?.files ? "has-error" : ""}`}
              onClick={handleOpenFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="operator-form-dropzone-content d-flex flex-column align-items-center justify-content-center">
                <div className="operator-form-upload-icon">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M29.3337 29.3333L22.0003 22M22.0003 22L14.667 29.3333M22.0003 22V38.5M37.3637 33.7167C39.1509 32.7421 40.5632 31.2018 41.3749 29.3375C42.1865 27.4732 42.3512 25.3915 41.843 23.422C41.3348 21.4526 40.1832 19.7095 38.5719 18.4762C36.9606 17.2429 34.9839 16.5906 32.9545 16.625H30.6445C30.0899 14.4799 29.0562 12.4884 27.6206 10.8003C26.185 9.11214 24.3844 7.77234 22.3548 6.88185C20.3252 5.99137 18.1199 5.57341 15.9044 5.65988C13.6889 5.74636 11.5233 6.33495 9.56944 7.38105C7.61554 8.42715 5.92659 9.90301 4.63114 11.696C3.33568 13.489 2.46852 15.5545 2.0952 17.7341C1.72187 19.9136 1.85201 22.1499 2.47574 24.271C3.09947 26.392 4.20027 28.3426 5.6945 29.9725"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h6 className="operator-form-dropzone-title mb-1">
                  Arrastra archivos aquí
                </h6>

                <p className="operator-form-dropzone-text mb-0">
                  PDF, JPG o PNG hasta 10MB
                </p>

                <p className="operator-form-dropzone-helper mb-0">
                  Máximo {10 - watchedFilesCount} archivo
                  {10 - watchedFilesCount === 1 ? "" : "s"} adicional
                  {10 - watchedFilesCount === 1 ? "" : "es"}
                </p>
              </div>
            </button>

            {errors?.files && (
              <p className="operator-form-error mb-0">{errors.files.message}</p>
            )}

            {!!selectedFiles?.length && (
              <ul className="operator-form-files-list mb-0">
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="operator-form-file-item d-flex align-items-center justify-content-between"
                  >
                    <div className="operator-form-file-left d-flex align-items-center">
                      <div className="operator-form-file-icon d-flex align-items-center justify-content-center">
                        {file?.type?.includes("pdf") ? "PDF" : "IMG"}
                      </div>

                      <div className="operator-form-file-info d-flex flex-column">
                        <span className="operator-form-file-name">
                          {file.name}
                        </span>

                        <span className="operator-form-file-size">
                          {file.formattedSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="operator-form-file-delete d-flex align-items-center justify-content-center"
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Eliminar ${file.name}`}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.5 5H17.5M7.5 2.5H12.5M8.33333 8.33333V14.1667M11.6667 8.33333V14.1667M4.16667 5L5 16.6667C5.04128 17.2464 5.29904 17.7896 5.72144 18.1885C6.14383 18.5874 6.70077 18.8138 7.28167 18.8333H12.7183C13.2992 18.8138 13.8562 18.5874 14.2786 18.1885C14.701 17.7896 14.9587 17.2464 15 16.6667L15.8333 5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="operator-form-actions d-flex align-items-center gap-3">
            <button
              type="button"
              className="operator-form-btn operator-form-btn-cancel"
              onClick={onHide}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="operator-form-btn operator-form-btn-submit"
            >
              Guardar Operador
            </button>
          </div>
        </form>
      </section>
    </Modal>
  );
}

OperatorForm.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  title: PropTypes.string.isRequired,
};

export default memo(OperatorForm);
