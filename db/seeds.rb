# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'net/http'
require 'json'

uri = URI("https://raw.githubusercontent.com/smingers/mealtimer/master/assets/recipes.json")
f = Net::HTTP.get(uri)
recipes = JSON.parse(f)

recipes.each do |r|
  unless r.empty?
    r_id = r['id'].to_i
    r_title = r['title']
    r_description = r['description']
    r_author = r['author']
    r_bg_image = r['bgImage']
    r_yield = r['yield']
    r_cook_time = r['time'].join(", ")
    r_steps = r['steps']

    recipe = Recipe.create(
      # :id => r_id, # Caused the need for `rake database:correct_sequence_ids`
      :title => r_title,
      :description => r_description,
      :author => r_author,
      :bg_image => r_bg_image,
      :yield => r_yield,
      :cook_time => r_cook_time
    )
    r_steps.each do |s|
      s_ordinal = s['ordinal']
      s_time = s['time']
      s_description = s['text']
      new_step = {:ordinal => s_ordinal, :time => s_time, :description => s_description}
      recipe.steps.create(new_step)
    end
  end
end