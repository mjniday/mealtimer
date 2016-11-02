class Step < ApplicationRecord
  # Rails 5 makes belongs_to required by default. Use `optional` to opt out
  belongs_to :recipe, optional: true

  # TODO: custom validation. Allow user to set Step # on create, 
  # or put it as the last step by default
  # validates_presence_of :ordinal
end
