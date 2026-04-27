// Librarys
import { memo } from "react";

// Components
import OperatorForm from "../OperatorForm";

// Hooks
import useOperatorList from "./useOperatorList";

// Styles
import "./styles.scss";

function OperatorList() {
  const {
    search,
    selectedOperator,
    editOperatorForm,
    filteredOperators,

    getStatusLabel,
    formatCreatedAt,
    toggleOperatorStatus,

    isDownloadingDocuments,

    handleSearch,
    handleEditOperator,
    handleDownloadDocuments,
    handleShowEditOperatorForm,
  } = useOperatorList();

  return (
    <section className="operator-list">
      <div className="operator-list-header">
        <h2 className="operator-list-title mb-0">Directorio de Operadores</h2>
      </div>

      <div className="operator-list-search-box">
        <div className="operator-list-search-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 15.75L12.4875 12.4875"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <input
          type="text"
          className="operator-list-search-input"
          placeholder="Buscar por nombre o RUC..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="operator-list-table-wrapper">
        <table className="operator-list-table">
          <colgroup>
            <col className="col-operator-name" />
            <col className="col-ruc" />
            <col className="col-status" />
            <col className="col-created-at" />
            <col className="col-actions" />
          </colgroup>

          <thead>
            <tr>
              <th>RAZÓN SOCIAL</th>
              <th>RUC</th>
              <th>ESTADO</th>
              <th>FECHA DE CREACIÓN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredOperators.length ? (
              filteredOperators.map((operator) => (
                <tr key={operator?._id}>
                  <td>
                    <span className="operator-list-name">
                      {operator?.operatorName || "-"}
                    </span>
                  </td>

                  <td>
                    <span className="operator-list-ruc">
                      {operator?.ruc || "-"}
                    </span>
                  </td>

                  <td>
                    <span
                      role="button"
                      title={`Cambiar estado del operador a: ${
                        operator?.status === "danger"
                          ? "SALUDABLE"
                          : "EN RIESGO"
                      }`}
                      onClick={() => toggleOperatorStatus(operator)}
                      className={`operator-list-status ${
                        operator?.status === "danger" ? "danger" : "fine"
                      }`}
                    >
                      {getStatusLabel(operator?.status)}
                    </span>
                  </td>

                  <td>
                    <span className="operator-list-date">
                      {formatCreatedAt(operator?.createdAt)}
                    </span>
                  </td>

                  <td>
                    <div className="operator-list-actions">
                      <button
                        type="button"
                        className="operator-list-action-btn"
                        onClick={() => handleShowEditOperatorForm(operator)}
                      >
                        <span className="operator-list-action-icon">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 13.3333H14"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.0001 2.33331C11.2653 2.0681 11.625 1.91907 12.0001 1.91907C12.3752 1.91907 12.7349 2.0681 13.0001 2.33331C13.2653 2.59853 13.4143 2.9582 13.4143 3.33331C13.4143 3.70841 13.2653 4.0681 13.0001 4.33331L4.66675 12.6666L2.00008 13.3333L2.66675 10.6666L11.0001 2.33331Z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>

                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDownloadingDocuments}
                        onClick={() => handleDownloadDocuments(operator)}
                        className="operator-list-action-btn secondary"
                      >
                        <span className="operator-list-action-icon">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 2V10"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.33325 7.33331L7.99992 10L10.6666 7.33331"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.66675 12.6667H13.3334"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>

                        <span>Descargar documentos</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="operator-list-empty">
                    No se encontraron operadores.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="operator-list-results mb-0">
        Mostrando {filteredOperators.length} resultado
        {filteredOperators.length === 1 ? "" : "s"}
      </p>

      {editOperatorForm.isShowing && (
        <OperatorForm
          isShowing
          title="Editar Cliente"
          onSubmit={handleEditOperator}
          onHide={editOperatorForm.hide}
          defaultValues={selectedOperator}
        />
      )}
    </section>
  );
}

export default memo(OperatorList);
