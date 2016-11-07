// For Edit and New Recipe forms
$(document).ready(function () {
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
});