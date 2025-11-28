function price(pickup, dropoff, pickupDate, dropoffDate, type, age, licenseHeldYears) {
  if (licenseHeldYears < 1) {
    return "License held for less than 1 year are ineligible to rent";
  }

  const clazz = getClazz(type);
  const days = get_days(pickupDate, dropoffDate);
  const season = getSeason(pickupDate, dropoffDate);
  const weekendDays = WeekendDays(pickupDate, dropoffDate);
  const weekdayDays = days - weekendDays;

  
  if (age < 18) {
    return "Driver too young - cannot quote the price";
  }

  if (age <= 21 && clazz !== "Compact") {
    return "Drivers 21 y/o or less can only rent Compact vehicles";
  }

  let rentalprice = age * days;

  if (licenseHeldYears < 2) {
    rentalprice *= 1.3;
  } else if (licenseHeldYears < 3 && season === "High") {
    rentalprice += 15 * days;
  }

  if (clazz === "Racer" && age <= 25 && season === "High") {
    rentalprice *= 1.5;
  }

  if (season === "High") {
    rentalprice *= 1.15;
  }

  if (days > 10 && season === "Low") {
    rentalprice *= 0.9;
  }

  return '$' + rentalprice.toFixed(2);
}

function getClazz(type) {
  switch (type) {
    case "Compact":
      return "Compact";
    case "Electric":
      return "Electric";
    case "Cabrio":
      return "Cabrio";
    case "Racer":
      return "Racer";
    default:
      return "Unknown";
  }
}

function WeekendDays(pickupDate, dropoffDate) {
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);
  let weekendDays = 0;
  
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay(); 
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weekendDays;
}

function get_days(pickupDate, dropoffDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(pickupDate);
  const secondDate = new Date(dropoffDate);

  return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);

  const start = 4;
  const end = 10; 

  const pickupMonth = pickup.getMonth();
  const dropoffMonth = dropoff.getMonth();

  if (
    (pickupMonth >= start && pickupMonth <= end) ||
    (dropoffMonth >= start && dropoffMonth <= end) ||
    (pickupMonth < start && dropoffMonth > end)
  ) {
    return "High";
  } else {
    return "Low";
  }
}

exports.price = price;