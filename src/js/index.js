import './import-jquery'
import 'swipeshow'


$(document).ready(function() {
  $('.swipeshow').swipeshow({
    autostart: false,
    $dots: $("div.dots")
  })
})