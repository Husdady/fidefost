import React, { useState } from "react";

export default function DateRange() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  return (
    <div className="rango">
      <input
        type="text"
        placeholder="DESDE dd/mm/aaaa"
        value={desde}
        onChange={(e) => setDesde(e.target.value)}
      />

      <input
        type="text"
        placeholder="HASTA dd/mm/aaaa"
        value={hasta}
        onChange={(e) => setHasta(e.target.value)}
      />
    </div>
  );
}