const estados = ["EN RUTA", "DETENIDO", "STAND-BY"];

const toggleEstado = (id) => {
  setAudits(prev =>
    prev.map(audit => {
      if (audit._id !== id) return audit;

      const currentIndex = estados.indexOf(audit.auditOperationalStatus || "EN RUTA");
      const nextEstado = estados[(currentIndex + 1) % estados.length];

      return {
        ...audit,
        auditOperationalStatus: nextEstado
      };
    })
  );
};