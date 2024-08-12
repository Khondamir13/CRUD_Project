import moment from "moment";
export default {
  ifequal(a, b, options) {
    if (a == b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  getFirstCharacter(firstName, lastName) {
    return firstName.charAt(0) + lastName.charAt(0);
  },
  formDate(date) {
    return moment(date).format("DD MMM YYYY");
  },
};
