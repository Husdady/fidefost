// Librarys
import * as yup from "yup";

const schema = yup.object().shape({
  operatorName: yup.string().required("Ingresa el nombre del operador"),
  files: yup.array().min(1, "Debes subir por lo menos 1 documento legal"),

  ruc: yup
    .string()
    .required("Ingresa el RUC del operador")
    .min(11, "RUC must be 11 characters"),
});

export default schema;
