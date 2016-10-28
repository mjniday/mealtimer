class Step < ApplicationRecord
  belongs_to :recipe

  # TODO: custom validation. Allow user to set Step # on create, 
  # or put it as the last step by default
  # validates_presence_of :ordinal
end
