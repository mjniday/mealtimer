class Recipe < ApplicationRecord
  has_many :steps
  has_many :ingredients
  has_and_belongs_to_many :tools

  accepts_nested_attributes_for :steps
end
