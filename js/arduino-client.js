// Object to store all pins objects
var pins = {};

$(document).ready(function() {
  
  // Socket connection
  var socket = io.connect('http://localhost:8080');
  
  // Create pins objects and bind click events
  $(".pin").each(function(){
    pins[$(this).attr('id')] = {
      pinId: $(this).attr('id'),
      pinMode: 1,
      pinTitle: $(this).attr('title'),
      currentValue: 0,
    };
    pins[$(this).attr('id')].controlPanel = new controlPanel(pins[$(this).attr('id')].pinId, pins[$(this).attr('id')].pinTitle),
    $(this).click(function(){
      pins[$(this).attr('id')].controlPanel.build();
      socket.emit("ping",{ mode: "digital", pin: $(this).attr('title'), value: 0 });
    });  
  });

  socket.on("pong",function(data){
  	$("#msgbox").append(data.txt+"<br>");
  });
});

var controlPanel = function(pin, title) {
  this.pin = pin;
  this.title = title;
  this.html = '<div class="controlpanel" id="' + this.pin + '">\
                <h2>Settings for ' + this.title + '</h2>\
                <form>\
                  <p>\
                    <label>Mode:</label>\
                    <select class="mode">\
                    <option value="1">Digital</option>\
                    <option value="0">Analog</option>\
                    <select/>\
                  <p/>\
                  <p class="digital-values">\
                    <label>Value:</label>\
                    <input type="radio" name="value-on" value="1">On\
                    <input type="radio" name="value-off" value="0">Off\
                  <p/>\
                  <p class="analog-values">\
                    <label>Value:</label>\
                    <span class="slider-value"></span>\
                    <div class="slider" id="' + this.pin + '"></div>\
                  <p/>\
                </form>\
              </div>';
  this.build = function() {
    $(".controlpanel").remove();
    $(".right-panel").prepend(this.html);
    this.applySlider();
  }
  this.applySlider = function() {
    $("#" + this.pin + " .slider").slider({
      min: 0,
      max: 255,
      change: function(event, ui) {
        pins[$(this).attr('id')].currentValue = ui.value;
        $(".controlpanel#" + $(this).attr('id') + " .slider-value").text(pins[$(this).attr('id')].currentValue);
      },
      slide: function(event, ui) {
        $(".controlpanel#" + $(this).attr('id') + " .slider-value").text(ui.value);
      }
    });
    $("#" + this.pin + " .slider").slider("option", "value", pins[this.pin].currentValue);
  }
}