class Recipe < ApplicationRecord
  has_many :steps
  has_many :ingredients
  has_and_belongs_to_many :tools
end
