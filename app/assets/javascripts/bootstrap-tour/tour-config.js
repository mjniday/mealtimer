var tour = new Tour({
    onEnd: function () {
      $('#1').removeClass('current').removeClass('times-up').removeClass('panel-primary').removeClass('panel-danger');
    },
    steps: [
    {
      orphan: true,
      backdrop: true,
      title: "Welcome to meal&middottimer",
      content: "<strong>meal&middottimer</strong> transforms your favorite recipes with an interactive experience that helps you get dinner on the table and on time.  Take this brief tour to see how it works."
    },
    {
      element: "#start",
      title: "Start meal&middottimer",
      content: "Click <code>Start &raquo;</code> when you are ready to cook and <strong>meal&middottimer</strong> will advance to the first step."
    },
    {
      element: ".hidden-xs .btn-group",
      title: "Advance to the next step",
      content: "After finishing a step in the recipe, press <code><span class='glyphicon glyphicon-arrow-right'></span></code> to advance to the next step (you can also go back to the previous steps by clicking <code><span class='glyphicon glyphicon-arrow-left'></span></code>). Or, use the left and right arrow keys on your keyboard.",
      placement: "bottom"
    },
    {
      element: ".hidden-xs .time",
      title: "Countdown",
      content: "The primary timer counts down the time remaining in the current step.",
      placement: "bottom"
    },
    {
      element: "#1",
      title: "Recipe step",
      content: "Each step in the recipe appears in its very own box.  The appearance of the box will change as you follow the recipe.",
      placement: "left",
      onShow: function (tour) {
        $('#1').removeClass('current').removeClass('panel-primary');
      }
    },
    {
      element: "#1",
      title: "Current Step",
      content: "The current step is highlighted in blue.",
      placement: "left",
      onShown: function (tour) {
        setTimeout(function () {
          $('#1').removeClass('times-up').removeClass('panel-danger');
          $('#1').addClass('current').addClass('panel-primary');
        }, 1000);
      }
    },
    {
      element: "#1",
      title: "Time's Up!",
      content: "When time expires on the current step, it turns red and a chime will sound.",
      placement: "left",
      onShown: function (tour) {
          setTimeout(function () {
              $('#1').addClass('times-up').addClass('panel-danger');
              $('#timer-audio')[0].play();
          }, 1000);
      }
    },
    {
      element: "#1 .total",
      title: "Duration",
      content: "The duration of each step is shown here (untimed steps will read <code>--:--:--</code>).  While the step is in progress, the elapsed time is visible.",
      placement: "bottom",
      onShown: function (tour) {
          $('#1').removeClass('times-up').removeClass('panel-danger').removeClass('current').removeClass('panel-primary');
          //$('#1 .play').click();
      }
    },
    {
      element: "#1 .play",
      title: "Play/Pause",
      content: "Working on more than one step at a time?  Just click <code><span class='glyphicon glyphicon-play'></span></code> and multiple timers will run simultaneously.",
      placement: "bottom",
      onShown: function (tour) {
          //$('#1 .play').click();
      }
    },
    {
      element: ".progress",
      title: "Progress indicator",
      content: "Visualize progress toward completing the recipe.  See which steps are complete and which are underway.",
      placement: "top"
    },
    {
      orphan: true,
      backdrop: true,
      title: "Bon Appetit!",
      content: "That's it!  Click <code>Start &raquo;</code> to begin cooking with <strong>meal&middottimer</strong>."
    }
  ]}).init().start();