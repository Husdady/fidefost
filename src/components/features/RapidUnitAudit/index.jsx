import { memo } from "react";
import PropTypes from "prop-types";

// Utils
import classnames from "utils/classnames";

//tableRapidUnitAudit
import {TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from "@mui/material"

const dataRapidUnitAudit = [
  {conductor:'Ricardo Mendoza',contrato:'Ene 2025-Dic 2026',licenciaeps:'',estado:'EN RUTA',acciones:'' },
  {conductor:'Carlos Salazar',contrato:'Mar 2024-Oct 2024',licenciaeps:'',estado:'DETENIDO/ALERTA',acciones:'' },
  {conductor:'Elena Portillo',contrato:'Ene 2025-Dic 2026',licenciaeps:'',estado:'STAND-BY',acciones:'' }, 
];

function RapidUnitAudit({ title, children, className = "",  accent = "default" }) {
  return (
        <article
          className={classnames([
            className,
            `rapid-unit-audit rapid-unit-audit--${accent}`,
          ])}
        >
        <section className={classnames(["page-header", className])}>
          <div className="rapid-unit-audit__header d-flex align-items-start justify-content-between">
            <div className="rapid-unit-audit__info">
              <h1 className="rapid-unit-audit__title mb-0">{title}</h1>
            </div>
          
            <div className="rapid-unit-audit__actions d-flex align-items-center">
            {children}
            </div>
          </div>
        
        </section>  

          <div className="rapid-unit-audit__body">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CONDUCTOR</TableCell>
                    <TableCell>CONTRATO</TableCell>
                    <TableCell>LICENCIA/EPS</TableCell>
                    <TableCell>ESTADO OPERATIVO</TableCell>
                    <TableCell>ACCIONES</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {dataRapidUnitAudit.map(celda=>(
                    <TableRow>
                      <TableCell>{celda.conductor}</TableCell>
                      <TableCell>{celda.contrato}</TableCell>
                      <TableCell>{celda.licenciaeps}</TableCell>
                      <TableCell>{celda.estado}</TableCell>
                      <TableCell>{celda.acciones}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>

            </TableContainer>
          </div>
        </article>
          

  );
}

RapidUnitAudit.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  accent: PropTypes.oneOf(["default", "info", "warning", "danger"]),
};

export default memo(RapidUnitAudit);

 