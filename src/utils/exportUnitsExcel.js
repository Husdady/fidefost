import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function exportUnitsExcel(units) {

  const data = units.map((unit) => ({

    // UNIDAD /PT
    MARCA: unit.marca,
    PLACA_TRACTOR: unit.placaTractor,
    // REVISION TEC
    F_VENCIMIENTO_REVISION_TEC_TRACTOR:
      unit.revisionFechaPT,
    //PLACA CARRETA  
    PLACA_CARRETA: unit.placaCarreta,
    //REVISION TEC
    F_VENCIMIENTO_REVISION_TEC_CARRETA:
      unit.revisionFechaPC,

    // MTC / PROPIEDAD
    MTC: unit.mtc,

    TARJETA_VEHICULAR:
      unit.tarjetaVehicularInfo,

    // SEGUROS
    SOAT: unit.soat,

    POLIZA_VEHICULAR: unit.polizaVehicular,

    POLIZAS_CARGA_CONTENEDOR: unit.polizaCarga,

    POLIZA_ENDOSO: unit.polizaEndoso,

    // CHECKS
    DOCUMENTACION_MTC:
      unit.documentos?.mtcCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_SOAT:
      unit.documentos?.soatCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_POLIZAS:
      unit.documentos?.polizaCheck
        ? "SI"
        : "NO",

    DOCUMENTACION_TARJETA_VEHICULAR:
      unit.documentos?.tarjetaVehicularCheck
        ? "SI"
        : "NO",
    DOCUMENTACION_REVISION_TEC:
        unit.documentos?.revisionTecnicaCheck 
        ? "SI"
        : "NO",
    DOCUMENTACION_PERMISO_MUNICIPAL:
        unit.documentos?.permisoMunicipalCheck
        ? "SI"
        : "NO",
  }));

  // SHEET
  const worksheet =
    XLSX.utils.json_to_sheet(data);

  // WORKBOOK
  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "UNIDADES"
  );

  // BUFFER
  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  // FILE
  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    fileData,
    "UNIDADES.xlsx"
  );
}