import jMoment from "moment-jalaali";

const pdate = (thedate: string, format = "jYYYY/jMM/jDD", showtime = false) => {
  const momentdate = jMoment(thedate);
  if (showtime) {
    return momentdate.format("ddd jD jMMMM jYYYY - HH:MM");
  } else {
    return momentdate.format(format);
  }
};

export { pdate };
