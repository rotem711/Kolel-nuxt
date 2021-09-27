import Vue from 'vue'
import moment from 'moment';
import 'moment/locale/he';

moment.locale('he');

Vue.filter('formatdate', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(value).format("DD-MM-YYYY");   
})

Vue.filter('fromNow', function (value) {
  if (!value) return ''
  value = value.toString()
  return moment(new Date(value)).fromNow();
})

var numeral = require("numeral");

Vue.filter("formatViews", function (value) {
  if (value > 999 && value < 100000) {
    let res = numeral(value).format("0.0a");
    if (res.endsWith(".0k")) {
      res = res.substring(0, res.length - 3);
      return res + 'k'; 
    }
    return res; 
  } else if (value > 99999) {
    return numeral(value).format("0a"); 
  }
  return value;
});

Vue.filter("numberDefaultFormat", function (value) {
  return numeral(value).format("0,0"); 
});