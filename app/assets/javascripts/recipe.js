/*global Tour:true, purl:true*/

$(document).ready(function () {
  // For creating nested forms for Recipes
  $('#add-step-button').on('click',function(e){
    e.preventDefault();
    addStepField();
  });

  var addStepField = function() {
    var step_container = $('#steps-container');
    var prev_fields = $('.step-block').length - 1; // step ids get 0 indexed
    var next_step_id = prev_fields + 1;
    var new_step = document.createElement('div');
    new_step.className = "step-block";

    var new_ordinal = document.createElement('input');
    var ordinal_break = document.createElement('br');
    new_ordinal.name = "recipe[steps_attributes][" + next_step_id + "][ordinal]";
    new_ordinal.type = "number";
    new_ordinal.className = 'form-control';
    new_ordinal.placeholder = "#";

    var new_time = document.createElement('input');
    var time_break = document.createElement('br');
    new_time.name = "recipe[steps_attributes][" + next_step_id + "][time]";
    new_time.type = "number";
    new_time.className = 'form-control';
    new_time.placeholder = "# milliseconds";

    var new_textarea = document.createElement('textarea');
    var step_break = document.createElement('br');
    new_textarea.name = "recipe[steps_attributes][" + next_step_id + "][description]";
    new_textarea.className = 'form-control';
    new_textarea.placeholder = "Start some boiling water."

    new_step.appendChild(new_ordinal);
    new_step.appendChild(ordinal_break);
    new_step.appendChild(new_time);
    new_step.appendChild(time_break);
    new_step.appendChild(new_textarea);
    new_step.appendChild(step_break);
    step_container[0].appendChild(new_step);
  };

  $('#add-ingredient-button').on('click',function(e){
    e.preventDefault();
    addIngredientField();
  });

  var addIngredientField = function() {
    var ingredient_container = $('#ingredients-container');
    var prev_fields = $('.ingredient-block').length - 1;
    var next_ingredient_id = prev_fields + 1;
    var new_ingredient = document.createElement('div');
    new_ingredient.className = "ingredient-block";

    var new_quantity = document.createElement('input');
    var quantity_break = document.createElement('br');
    new_quantity.name = "recipe[ingredients_attributes][" + next_ingredient_id + "][quantity]";
    new_quantity.type = "number";
    new_quantity.className = 'form-control';
    new_quantity.placeholder = "#";

    var new_unit = document.createElement('input');
    var unit_break = document.createElement('br');
    new_unit.name = "recipe[ingredients_attributes][" + next_ingredient_id + "][unit]";
    new_unit.className = 'form-control';
    new_unit.placeholder = "pinch, gram, gallon";

    var new_comment = document.createElement('input');
    var comment_break = document.createElement('br');
    new_comment.name = "recipe[ingredients_attributes][" + next_ingredient_id + "][comment]";
    new_comment.className = 'form-control';
    new_comment.placeholder = "crushed, minced, chopped";

    var new_name = document.createElement('input');
    var name_break = document.createElement('br');
    new_name.name = "recipe[ingredients_attributes][" + next_ingredient_id + "][name]";
    new_name.className = "form-control";
    new_name.placeholder = 'Garlic';

    new_ingredient.appendChild(new_quantity);
    new_ingredient.appendChild(quantity_break);
    new_ingredient.appendChild(new_unit);
    new_ingredient.appendChild(unit_break);
    new_ingredient.appendChild(new_comment);
    new_ingredient.appendChild(comment_break);
    new_ingredient.appendChild(new_name);
    new_ingredient.appendChild(name_break);

    ingredient_container[0].appendChild(new_ingredient);
  };

  

  // var countDown; // counts down the time using setInterval
  var currentStep = 0; // current step in the recipe (zero indexed)
  // var paused;  // assigned boolean value if timer paused (true) or not (false)
  // var startTime; // date.now when current step begins
  // var elapsed; // amount of time elapsed in the current step
  // var userAddedTime = 0; // time added to the current step by the user
  // var titleReg = document.title;
  // var titleAlert = "(!) " + document.title;
  var elapsedTimes = []; // actual completion times for the user
  var recipeStepTimes = []; // times, in ms, for each step in the recipe

  // DOM elements called > 1x
  var $display = $('.display');
  var $play = $('.play');
  var $pause = $('.pause');
  var $more = $('.more');
  var $prev = $('.prev');
  var $next = $('.next');
  var $navbar = $('.navbar');
  var $step = $('.step');
  // var $timerRow = $('.timer-row');
  var $jumbotron = $('.jumbotron');
  var $progress = $('#progress-bar-master');
  var $start = $('#start');
  var $stop = $('#stop');
  var $ingredients = $('.ingredients');

  // time conversion and rendering functions
  function convertMS(milliseconds) {
    // converts time into hours, minutes, seconds
    var absMilliseconds = Math.abs(milliseconds);
    var hours = Math.floor(absMilliseconds / 3600000);
    var minutes = Math.floor((absMilliseconds % 3600000) / 60000);
    var seconds = Math.floor(((absMilliseconds % 3600000) % 60000) / 1000);
    var time = [hours, minutes, seconds, milliseconds];
    return time;
  };

  function stopWatchTime(time) {
    if (time[3] > -1000) {
      return ("0" + time[0]).slice(-2) + ":" + ('0' + time[1]).slice(-2) + ":" + ("0" + time[2]).slice(-2);
    } else {
      return "-" + ("0" + time[0]).slice(-2) + ":" + ('0' + time[1]).slice(-2) + ":" + ("0" + time[2]).slice(-2);
    }
  };

  // rewriting the step time formatting
  // var allSteps = $('.panel.panel-default');
  var allSteps = $('.step-times');
  for(var i = 0;i < allSteps.length;i++) {
    time = allSteps[i].textContent;
    // time = allSteps[i].dataset['time'];
    if (time) {
        stepTime = stopWatchTime(convertMS(time));
    } else {
        stepTime = "--:--:--";
    }
    // allSteps[i].childNodes[1].childNodes[1].childNodes[3].childNodes[5].textContent = stepTime
    allSteps[i].textContent = stepTime
  }

  // load recipe content from JSON
  var buildRecipe = function (recipe) {
    var totalTime = 0;
    var numNullSteps = 0; // for inserting null-time steps into the progress bar

    // step panels
    // for (var i = 0, length = recipe.steps.length; i < length; i++) {
    //   var stepNum = recipe.steps[i].ordinal;
    //   var stepTime;

    //   var passive;
    //   if (recipe.steps[i].passive) {
    //       passive = true;
    //   } else {
    //       passive = false;
    //   }

    //   if (recipe.steps[i].time) {
    //       stepTime = stopWatchTime(convertMS(recipe.steps[i].time));
    //   } else {
    //       stepTime = "--:--:--";
    //   }
    //   var stepText = recipe.steps[i].description;

    //   $('.steps').append('<div class="panel panel-default" data-time="' + recipe.steps[i].time +'" data-passive="' + passive + '" id="' + stepNum + '"><div class="panel-heading"><div class="step-controls"><div class="btn-group step-btn"><button type="button" class="btn btn-default btn-xs play disabled"><span class="glyphicon glyphicon-play"></span></button><button type="button" class="btn btn-default btn-xs more" data-container="body" data-toggle="popover"><span class="glyphicon glyphicon-chevron-down"></span></button></div><span class="step-times"><span class="elapsed small"></span><span class="divisor small"></span><span class="total small">' + stepTime + '</span></span></div></div><table class="panel-table"><tr><tbody><td class="step-ordinal">' + stepNum + '</td><td class="step-text">'+ stepText +'</td></tbody></tr></table></div>');

    //   recipeStepTimes.push(recipe.steps[i].time);
    //   totalTime += recipe.steps[i].time;
    //   elapsedTimes.push(recipe.steps[i].elapsed);

    //   if (!recipe.steps[i].time) {
    //       numNullSteps++;
    //   }
    // }

    // progress bar
    for (i = 0, length = recipe.steps.length; i < length; i++) {
        var widthNum;
        if (recipe.steps[i].time === null || recipe.steps[i].time === 0) {
            widthNum = 0.5;
        } else {
            widthNum = recipe.steps[i].time * (100 - numNullSteps * 0.5) / totalTime;
        }
        var progressBarStep = ('<a href="#' + (i + 1) + '" class="progress-bar progress-bar-step" style="width: ' + widthNum + '%" id="progress' + ( i + 1 ) + '" data-toggle="tooltip" data-placement="bottom" title="Step ' + (i + 1) + '"></a>');
        $progress.append(progressBarStep);
    }
    $('.progress-bar-step').tooltip(); // IN PROGRESS

    // other page elements
    $display.text(stopWatchTime(convertMS(totalTime)));
    $jumbotron.css("background-image", "url('" + recipe.bgImage + "')");
    $('.title').text(recipe.title);
    // document.title = recipe.title + " | " + document.title;
    $('.description').html(recipe.description);
    $('.author').html(recipe.author);
    $('.yield').append('<li>' + recipe.yield + '</li>');
    // for (i = 0, length = recipe.time.length; i < length; i++) {
        $('.prep-time').append('<li>' + recipe.cook_time + '</li>');
    // }
    for (i = 0, length = recipe.tools.length; i < length; i++) {
        $('.tools').append('<li>' + recipe.tools[i] + '</li>');
    }
    for (i = 0, length = recipe.ingredients.length; i < length; i++) {
        if (recipe.ingredients[i].category) {
            $ingredients.append('<h6>' + recipe.ingredients[i].category + '</h6>');
            for (var j = 0, length2 = recipe.ingredients[i].ingredients.length; j < length2; j++) {
                $ingredients.append('<li class="ingredient">' + recipe.ingredients[i].ingredients[j] + '</li>');
            }
            $ingredients.append('<br>');
        } else {
            $ingredients.append('<li class="ingredient">' + recipe.ingredients[i] + '</li>');
        }

    // more button fn (add, subtract, reset)
    var $more = $('.more');
    $more.popover({
        position : 'fixed',
        placement : 'bottom',
        html : 'true',
        content : '<div class="btn-group-vertical"><button type="button" class="btn btn-default add"><span class="glyphicon glyphicon-plus"></span> Add a minute</button><button type="button" class="btn btn-default subtract"><span class="glyphicon glyphicon-minus"></span> Subtract a minute</button><button type="button" class="btn btn-default reset"><span class="glyphicon glyphicon-repeat"></span> Reset time</button></div>'
    }).on('click', function () {
        $('.popover-content').addClass('paddingless');
    }) // this dynamic class addition is kind of lame; try to make it better.  can conflict with the tour popovers

    }

    // stop function, restores pretty much everything back to its original state
     $stop.click(function () {
        // clearInterval(countDown);
        $more.popover('hide');
        currentStep = 0;
        $display.text(stopWatchTime(convertMS(totalTime)));
        $step.text('');
        $prev.addClass('disabled');
        $play.removeClass('disabled');
        $pause.addClass('disabled');
        $more.addClass('disabled');
        $next.addClass('disabled');
        $('.panel').removeClass('completed').removeClass('current').removeClass('playing').removeClass('panel-primary').removeClass('panel-danger');
        $('.play').addClass('disabled');
        $('.pause').addClass('disabled');
        $('.progress-bar-step').removeClass('progress-bar-step-current').removeClass('progress-bar-step-completed');
        $start.css('visibility', 'visible');
        $stop.css('visibility', 'hidden');
        clearInterval($('.panel').data('timer')); // not working properly
        clearInterval($('.total-elapsed').data('total'));
        elapsedTimes = elapsedTimes.map(function(){
           return 0; // resets all values in array to zero
        });
    });

    // affix progress bar
    $progress.affix({
        offset: {
            top: function () {
                return (this.top = $jumbotron.outerHeight() - $navbar.outerHeight());
            }
        }
    });

    // affix sidebar  (BUGGY; WHY DO HEIGHT AND OUTERHEIGHT === 550 WHEN CALCULATED AND 570 IN CHROME DEV TOOLS?)
    var affixSidebar = function () {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var $toolsIngredients = $('.tools-ingredients');

        if (windowHeight > $toolsIngredients.height() && windowWidth >= 992) {
            $toolsIngredients.affix({
                offset: {
                  top: function () {
                      return (this.top = $toolsIngredients.offset().top - $navbar.outerHeight(true) - $progress.outerHeight());
                  } /*,
                  bottom: function () {
                      console.log('bottom', $('.bs-footer').outerHeight(true));
                      return (this.bottom = $('.bs-footer').outerHeight(true));
                  } */
                }
            });
        }
    };
    affixSidebar();
    $(window).resize(affixSidebar);

  };

  /*
  //IN PROGERSS - smooth scrolling on click of progress bar pieces
  $('.progress-bar-step').click(function (ordinal) {
      $(this).attr('href', ordinal);
      console.log(ordinal);
      // smooth scrolling
      $('html, body').stop().animate({
          scrollTop: $('#' + ordinal).offset().top - $navbar.outerHeight(true) - $progress.outerHeight()
      }, 500);
  });
  */

  // smooth scrolling
  var smoothScrolling = function () {
    $('html, body').stop().animate({
      scrollTop: $('#' + currentStep).offset().top - $navbar.outerHeight(true) - $progress.outerHeight()
    }, 500);
  };

  // disable prev and next buttons at the beginning and end of the recipe, respectively
  var prevNextDisabler = function (currentStep) {
    if (currentStep === 1) {
      $prev.addClass('disabled');
    } else {
      $prev.removeClass('disabled');
    }

    if (currentStep === (recipeStepTimes.length)) {
      $next.addClass('disabled');
    } else {
      $next.removeClass('disabled');
    }
  };

  var currentStepCountdown = function (currentStep, elapsed, stepTime) {
      var remaining;
      if (stepTime) {
          remaining = stopWatchTime(convertMS(stepTime - elapsed));
      } else {
          remaining = 'N/A';
      }
      $display.text(remaining);

      //currentStepClass
      if (stepTime && elapsed > stepTime) {
          $('#' + currentStep).addClass('panel-danger');
          $('#progress' + currentStep).addClass('progress-bar-step-times-up-current');
      } else {
          $('#' + currentStep).addClass('panel-primary');
          $('#progress' + currentStep).addClass('progress-bar-step-playing-current');
      }
      $('#progress' + currentStep).removeClass('progress-bar-step-completed');
  };

  // IN PROGRESS
  var stepClasses = function (currentStep) {

    var $panels = $('.steps').children();
    var $progressBars = $progress.children();

    $panels.each(function () {
      if (+$(this).attr('id') != currentStep) {
        $(this).removeClass('panel-danger');
        $(this).removeClass('panel-primary');
      }
    });

    $progressBars.each(function () {
      if (+$(this).attr('id').slice(8) != currentStep) {
        $(this).removeClass('progress-bar-step-times-up-current');
        $(this).removeClass('progress-bar-step-playing-current');
      }
      if (+$(this).attr('id').slice(8) < currentStep && !($(this).hasClass('playing'))) {
        $(this).addClass('progress-bar-step-completed');
      } else if (+$(this).attr('id').slice(8) < currentStep && $(this).hasClass('playing')) {
        $(this).addClass('progress-bar-step-playing');
      }

    });
  };

  var totalElapsed = function () {
    var $totalElapsed = $('.total-elapsed');
    var total = 0;
    $totalElapsed.html('Total time: '+ stopWatchTime(convertMS(total)));
    $totalElapsed.data('total', setInterval(function () {
      total += 1000;
      $totalElapsed.html('Total time: '+ stopWatchTime(convertMS(total)));
    }, 1000));
  };

  // BUTTONS
  $('.steps').on('click', 'button', function (event) {
    var $this = $(this);
    var $panel = $this.closest('.panel');
    // var $progressID = $('#progress' + $panel.attr('id'));
    // console.log($panel);
    var id = +$panel.attr('id') - 1; // kinda lame
    if ($this.hasClass('play')) {
      $panel.data('playing', true);
      $panel.toggleClass('playing');
      $panel.trigger('tick', id);
      $panel.data('timer', setInterval(function () {
          $panel.trigger('tick', id);
      }, 1000));
      $this.toggleClass('play').toggleClass('pause').html('<span class="glyphicon glyphicon-pause"></span>');
      // $progressID.toggleClass('progress-bar-step-playing');
    } else if ($this.hasClass('pause')) {
      $panel.data('playing', false);
      $panel.toggleClass('playing');
      $panel.removeClass('times-up');
      clearInterval($panel.data('timer'));
      $this.toggleClass('play').toggleClass('pause').html('<span class="glyphicon glyphicon-play"></span>');
    }
    stepClasses(currentStep);
  });

  $('.steps').on('tick', function (event, id) {
    var $element = $(event.currentTarget).children().eq(id);
    var $progressBarStep = $progress.children().eq(id);
    var $elapsed = $element.find('.elapsed');
    var elapsed = $element.data('elapsed') || 0;

    var $divisor = $element.find('.divisor');
    $divisor.text(' / ');

    var stepTime = $element.data('time');

    $elapsed.text(stopWatchTime(convertMS(elapsed)));
    elapsed += 1000;
    $element.data('elapsed', elapsed);

    if (elapsed > stepTime && stepTime) {
      $element.addClass('times-up');
      $progressBarStep.addClass('progress-bar-step-times-up');
    } else if (elapsed === stepTime && stepTime) {
      $('#timer-audio')[0].play();
    }

    if (id + 1 === currentStep) {
      currentStepCountdown(currentStep, elapsed, stepTime);
    }

  });

  $start.on('click', function () {
    currentStep = 1;
    $prev.removeClass('disabled');
    $next.removeClass('disabled');
    $('.play').removeClass('disabled');
    $start.css('visibility', 'hidden');
    $stop.css('visibility', 'visible');
    var $currentStepPlay = $('.steps').find('#' + currentStep + ' .play');
    $currentStepPlay.trigger('click');
    $step.text('Step ' + currentStep);
    prevNextDisabler(currentStep);
    smoothScrolling();
    totalElapsed();
  });

  $prev.tooltip();
  $next.tooltip();

  var prev = function () {
    $prev.tooltip('hide');
    var $currentStepStop = $('.steps').find('#' + currentStep + ' .pause');
    $currentStepStop.trigger('click');
    currentStep--;
    var $currentStepPlay = $('.steps').find('#' + currentStep + ' .play');
    $currentStepPlay.trigger('click');
    // stepClasses(currentStep);
    $step.text('Step ' + currentStep);
    prevNextDisabler(currentStep);
    smoothScrolling();
  };

  $prev.on('click', prev);

  var next = function () {
    $next.tooltip('hide');
    if (!$('.steps').find('#' + currentStep).data('passive')) {
      var $currentStepStop = $('.steps').find('#' + currentStep + ' .pause');
      $currentStepStop.trigger('click');
    }
    currentStep++;
    if (!$('.steps').find('#' + currentStep).data('playing')) {
      var $currentStepPlay = $('.steps').find('#' + currentStep + ' .play');
      $currentStepPlay.trigger('click');
    }
    // stepClasses(currentStep);
    $step.text('Step ' + currentStep);
    prevNextDisabler(currentStep);
    smoothScrolling();
  };

  $next.on('click', next);

  // Uses left and right arrow keys to go back / forward a step - PROBLEMS WITH SPACEBAR AND ENTER
  $(document).keydown(function (event) {
    if (!$prev.hasClass('disabled') && event.keyCode == 37) {
      prev();
    } else if (!$next.hasClass('disabled') && event.keyCode == 39) {
      next();
    }
  });

  $('body').on('click', '.add', function () {
    //userAddedTime += 60000;
    //displayRemainingTime(startTime);
  }).on('click', '.subtract', function () {
    //userAddedTime -= 60000;
    //displayRemainingTime(startTime);
  }).on('click', '.reset', function () {
    //elapsedTimes[currentStep] = 0;
    //userAddedTime = 0;
    //clearInterval(countDown);
    //startCountdown();
  });

  // click outside popover to dismiss; doesn't work on mobile
  // attributed to: http://stackoverflow.com/questions/11703093/how-to-dismiss-a-twitter-bootstrap-popover-by-clicking-outside and http://jsfiddle.net/mattdlockyer/C5GBU/2/
  $('body').on('click', function (event) {
    $('[data-toggle="popover"]').each(function () {
      // 'is' for buttons that trigger popups
      // 'has' for icons within a button that triggers a popup
      if (!$(this).is(event.target) && $(this).has(event.target).length === 0 && $('.popover').has(event.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });

  $('.help').tooltip();
  $('.help').on('click', function () {
    $(this).tooltip('destroy');
    tour.restart();
  });


}); // END
