/**
 * Animate the hero gradient on the home page.
 *
 * @credit
 * http://opticalcortex.com/animating-css-gradients/
 */


var animateHeroGradient = function() {

  // Target the hero element
  var $element = document.querySelector(".js-animate-hero-gradient");

  // RGB values of the gradients
  var gradients = [
    { start: [249,172,10], stop: [253,83,111] },
    { start: [253,83,111], stop: [191,47,68] },
    { start: [191,47,68], stop: [249,172,10] }
  ];

  // How long for each transition
  var transition_time = 50;

  // How many frames per second
  var fps = 60;

  // Interval type vars
  var timer; // for the setInterval
  var interval_time = Math.round(1000/fps); // how often to interval
  var currentIndex = 0; // where we are in the gradients array
  var nextIndex = 1; // what index of the gradients array is next
  var steps_count = 0; // steps counter
  var steps_total = Math.round(transition_time*fps); // total amount of steps
  var rgb_steps = {
    start: [0,0,0],
    stop: [0,0,0]
  }; // how much to alter each rgb value
  var rgb_values = {
    start: [0,0,0],
    stop: [0,0,0]
  }; // the current rgb values, gets altered by rgb steps on each interval
  var prefixes = ["-webkit-",""]; // for looping through adding styles
  var div_style = $element.style; // short cut to actually adding styles
  var gradients_tested = false;
  var color1, color2;

  // Sets next current and next index of gradients array
  function set_next(num) {
    return (num + 1 < gradients.length) ? num + 1 : 0;
  }

  // Work out how big each rgb step is
  function calc_step_size(a,b) {
    return (a - b) / steps_total;
  }

  // Populate the rgb_values and rgb_steps objects
  function calc_steps() {
    for (var key in rgb_values) {
      if (rgb_values.hasOwnProperty(key)) {
        for(var i = 0; i < 3; i++) {
          rgb_values[key][i] = gradients[currentIndex][key][i];
          rgb_steps[key][i] = calc_step_size(gradients[nextIndex][key][i],rgb_values[key][i]);
        }
      }
    }
  }

  // Update current rgb vals, update DOM element with new CSS background
  function updateGradient(){
    // update the current rgb vals
    for (var key in rgb_values) {
      if (rgb_values.hasOwnProperty(key)) {
        for(var i = 0; i < 3; i++) {
          rgb_values[key][i] += rgb_steps[key][i];
        }
      }
    }

    // generate CSS rgb values
    var t_color1 = "rgb("+(rgb_values.start[0] | 0)+","+(rgb_values.start[1] | 0)+","+(rgb_values.start[2] | 0)+")";
    var t_color2 = "rgb("+(rgb_values.stop[0] | 0)+","+(rgb_values.stop[1] | 0)+","+(rgb_values.stop[2] | 0)+")";

    // has anything changed on this iteration
    if (t_color1 != color1 || t_color2 != color2) {

      // update cols strings
      color1 = t_color1;
      color2 = t_color2;

      // update DOM element style attribute
      for (var i = 0; i < 4; i++) {
        div_style.backgroundImage = prefixes[i]+"linear-gradient(-95deg, "+color1+", "+color2+")";
      }
    }

    // test if the browser can do CSS gradients
    if (div_style.backgroundImage.indexOf("gradient") == -1 && !gradients_tested) {
      // if not, kill the timer
      clearTimeout(timer);
    }
    gradients_tested = true;

    // we did another step
    steps_count++;
    // did we do too many steps?
    if (steps_count > steps_total) {
      // reset steps count
      steps_count = 0;
      // set new indexs
      currentIndex = set_next(currentIndex);
      nextIndex = set_next(nextIndex);
      // calc steps
      calc_steps();
    }
  }

  // Initial step calc
  calc_steps();

  // Launch!
  timer = setInterval(updateGradient,interval_time);
};
