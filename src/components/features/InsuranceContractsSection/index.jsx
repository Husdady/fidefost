import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

//tableInsuranceContracts
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from "@mui/material"

const dataInsuranceContracts = [
  {proveedor:'La Positiva',tipo:'P.Carga',fecha:'01/01/2024',estado:'ACTIVE' },
  {proveedor:'Mapfre',tipo:'P.Contenedor Endoso',fecha:'15/02/2024',estado:'PRO.EXPIRAR' },
  {proveedor:'Rimac',tipo:'P.Contenedor Endoso',fecha:'10/01/2025',estado:'EXPIRED' }, 
];
function InsuranceContractsSection({ title, description, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `insurance-contracts-section insurance-contracts-section--${accent}`,
          ])}
        >
          <div className="insurance-contracts-section__header d-flex align-items-start justify-content-between">
            <div className="insurance-contracts-section__info">
              <h1 className="insurance-contracts-section__title mb-0">{title}</h1>
              <p className="insurance-contracts-section__description mb-0">{description}</p>
            </div>
          </div>
          <div className="insurance-contracts-section__body">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PROVEEDOR</TableCell>
                    <TableCell>TIPO</TableCell>
                    <TableCell>FECHAS</TableCell>
                    <TableCell>ESTADO</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataInsuranceContracts.map(celda=>(
                    <TableRow>
                      <TableCell>{celda.proveedor}</TableCell>
                      <TableCell>{celda.tipo}</TableCell>
                      <TableCell>{celda.fecha}</TableCell>
                      <TableCell>{celda.estado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>

            </TableContainer>
          </div>
        </article>
          

  );
}

InsuranceContractsSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(InsuranceContractsSection);


