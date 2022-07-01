import jMoment from "moment-jalaali";

const pdate = (thedate: string, showtime = false) => {
  const momentdate = jMoment(thedate);
  if (showtime) {
    return momentdate.format("ddd jD jMMMM jYYYY - HH:MM");
  } else {
    return momentdate.format("jYYYY/jMM/jDD");
  }
};

export { pdate };
