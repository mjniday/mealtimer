/*global Tour:true, purl:true*/

$(document).ready(function () {
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
  var $jumbotron = $('.jumbotron');
  var $progress = $('#progress-bar-master');
  var $start = $('#start');
  var $stop = $('#stop');
  var $ingredients = $('.ingredients');

  // affix progress bar
  $progress.affix({
    offset: {
      top: function () {
        return (this.top = $jumbotron.outerHeight() - $navbar.outerHeight());
      }
    }
  });

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

  function currentStepCountdown(currentStep, elapsed, stepTime) {
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

  // rewriting the step time formatting
  var allSteps = $('.step-times > .total');
  for(var i = 0; i < allSteps.length; i++) {
    time = allSteps[i].textContent;
    if (time) {
        stepTime = stopWatchTime(convertMS(time));
    } else {
        stepTime = "--:--:--";
    }
    allSteps[i].textContent = stepTime
  }

  var buildRecipe = function () {
    var totalTime = 0;
    var numNullSteps = 0; // for inserting null-time steps into the progress bar
    var recipeSteps = $('.steps > .panel');
    for (var i = 0; i < recipeSteps.length; i++) {
      numericStepTime = parseInt(recipeSteps[i].dataset.time);
      if(numericStepTime) {
        totalTime += numericStepTime;  
      }

    //   elapsedTimes.push(recipe.steps[i].elapsed);

      if (!numericStepTime) {
          numNullSteps++;
      }
    }
    
    // progress bar
    for (i = 0; i < recipeSteps.length; i++) {
      var widthNum;
      numericStepTime = parseInt(recipeSteps[i].dataset.time);
      if (isNaN(numericStepTime) || numericStepTime === 0) {
          widthNum = 0.5;
      } else {
          widthNum = numericStepTime * (100 - numNullSteps * 0.5) / totalTime;
      }
      var progressBarStep = ('<a href="#' + (i + 1) + '" class="progress-bar progress-bar-step" style="width: ' + widthNum + '%" id="progress' + ( i + 1 ) + '" data-toggle="tooltip" data-placement="bottom" title="Step ' + (i + 1) + '"></a>');
      $progress.append(progressBarStep);
    }

    // handle case where all progress bar steps are null
    if(numNullSteps == recipeSteps.length) {
      widthNum = 100 / numNullSteps;
      $('.progress-bar-step').css("width",widthNum.toString() + "%");
    }

    $('.progress-bar-step').tooltip(); // IN PROGRESS

    // other page elements
    $display.text(stopWatchTime(convertMS(totalTime)));
    
    for (i = 0; i < recipeSteps.length; i++) {
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
  buildRecipe();

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