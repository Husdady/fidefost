export default function calculateTrips(guides = []) {
  
  const MAX_PER_TRIP = 2;

  const groupedComments = new Set([
    "SE CARGO EN UN SOLO VIAJE",
    "SE CARGO EN DOS PUNTOS EN UN SOLO VIAJE",
  ]);

  let trips = 0;

  let buffer = [];

  const pushTrip = () => {
    if (buffer.length === 0) return;

    trips += Math.ceil(buffer.length / MAX_PER_TRIP);
    buffer = [];
  };

  guides.forEach((g, index) => {
    
    const isGrouped = groupedComments.has(g.comment);

    //  caso NO agrupado → viaje individual
    if (!isGrouped) {
      pushTrip();
      trips += 1;
      return;
    }

    // CASO: "UN SOLO VIAJE" (requiere misma fecha)
    if (g.comment === "SE CARGO EN UN SOLO VIAJE") {
  const prev = buffer[buffer.length - 1];

  const sameDay =
    prev &&
    new Date(prev.date).getDate() ===
      new Date(g.date).getDate();

  if (!prev || !sameDay) {
    pushTrip();
  }

  buffer.push(g);

  // NUEVO
  if (buffer.length === 2) {
    pushTrip();
  }

  return;
}

    //  CASO: "DOS PUNTOS EN UN SOLO VIAJE"
    buffer.push(g);

    // cerramos en grupos de 2
    if (buffer.length === 2) {
      pushTrip();
    }
  });

  pushTrip();

  return trips;
}