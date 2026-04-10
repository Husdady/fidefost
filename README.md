# FIDEFOST

Sistema web orientado a la gestión de información empresarial, permitiendo registrar, almacenar y administrar datos y documentos relacionados con clientes, contratos, servicios y unidades.

## Descripción

**FIDEFOST** es una aplicación web pensada para centralizar la información principal de la empresa en una sola plataforma. El sistema permite registrar entidades, asociar documentos, visualizar información relevante y facilitar la descarga de archivos cuando sea necesario.

La propuesta técnica para esta versión contempla una solución construida en **React**, usando:

- **localStorage** para datos ligeros y configuraciones
- **IndexedDB** para almacenamiento de archivos y documentos

## Objetivo

Centralizar y organizar la información de la empresa mediante módulos funcionales que permitan:

- Registrar clientes
- Almacenar documentos asociados a clientes
- Gestionar documentos de operadores y choferes
- Subir y listar documentos de guías
- Exportar reportes en Excel
- Registrar unidades y sus documentos asociados

## Alcance funcional

El sistema cuenta con los siguientes módulos principales:

- Clientes
- Contratos
- Servicios
- Unidades

---

## Módulos del sistema

### 1. Clientes

Este módulo permite listar clientes y registrar nuevos clientes mediante un formulario.

#### Campos principales

- RUC
- Nombres completos
- Subida de documentos

#### Funcionalidades

- Listado de clientes
- Registro de nuevos clientes
- Asociación de documentos por cliente
- Descarga de documentos
- Vista previa de archivos compatibles

#### Tipos de archivo permitidos

- PDF
- Word
- Excel
- Imágenes
- Otros documentos de oficina compatibles

---

### 2. Contratos

Este módulo permite gestionar documentos relacionados con operadores y choferes.

#### Funcionalidades

- Subir documentos de operadores
- Listar documentos de operadores
- Subir documentos de choferes
- Listar documentos de choferes
- Descargar documentos
- Vista previa de archivos compatibles

#### Tipos de archivo permitidos

- PDF
- Word
- Excel
- Imágenes
- Otros documentos de oficina compatibles

---

### 3. Servicios

Este módulo permite listar guías y subir documentos asociados a dichas guías.

#### Funcionalidades

- Listar guía de documentos
- Subir documentos de guías
- Descargar documentos
- Vista previa de archivos compatibles
- Exportar Excel automatizado de guías
- Mostrar gráficos con el total por día dentro de un mes

---

### 4. Unidades

Este módulo permite listar unidades y registrar una nueva unidad mediante formulario.

#### Campos principales

- MTC
- SOAT
- BREVETE
- PLACA CARRETA
- PLACA DE TRACTOR
- REVISIÓN TÉCNICA
- TARJETA DE PROPIEDAD
- TARJETA DE CIRCULACIÓN

#### Funcionalidades

- Listar unidades
- Registrar nuevas unidades
- Asociar documentos a cada unidad
- Descargar documentos
- Vista previa de archivos compatibles

---

## Tecnologías propuestas

### Frontend

- React
- Vite

### Almacenamiento local

- localStorage
- IndexedDB

### Librerías sugeridas

- React Router DOM
- idb o Dexie para IndexedDB
- xlsx para exportación de Excel
- Recharts o Chart.js para gráficos
- React Hook Form para formularios
- Yup o Zod para validaciones

---

## Estrategia de almacenamiento

Debido a que el sistema requiere almacenar tanto información estructurada como documentos, se propone dividir la persistencia en dos niveles:

### localStorage

Se utilizará para almacenar datos ligeros, como:

- Configuración general
- Preferencias del usuario
- Estados simples de interfaz
- Filtros
- Formularios temporales
- Metadata ligera de algunas entidades

### IndexedDB

Se utilizará para almacenar archivos y documentos reales, como:

- PDF
- Word
- Excel
- Imágenes
- Documentos de clientes
- Documentos de operadores
- Documentos de choferes
- Documentos de guías
- Documentos de unidades

### Motivo de esta estrategia

`localStorage` no es adecuado para archivos pesados, ya que:

- solo almacena texto
- tiene límite reducido de capacidad
- no está pensado para documentos grandes

`IndexedDB`, en cambio, permite:

- guardar `File` y `Blob`
- almacenar mayor cantidad de información
- trabajar mejor con archivos locales
- mantener una solución sin backend para un MVP

---

## Estructura sugerida del proyecto

```bash
src/
  components/
    DocumentUploader.jsx
    DocumentList.jsx
    DocumentPreview.jsx
    Layout.jsx
    Sidebar.jsx
    Header.jsx

  modules/
    clients/
      ClientsPage.jsx
      ClientForm.jsx
      ClientList.jsx

    contracts/
      ContractsPage.jsx
      OperatorsDocuments.jsx
      DriversDocuments.jsx

    services/
      ServicesPage.jsx
      GuidesList.jsx
      ServiceReports.jsx

    units/
      UnitsPage.jsx
      UnitForm.jsx
      UnitsList.jsx

  storage/
    localStorage.js
    indexedDb.js
    documentsRepository.js

  utils/
    formatFileSize.js
    downloadFile.js
    previewFile.js
    dateHelpers.js

  routes/
    AppRouter.jsx

  App.jsx
  main.jsx