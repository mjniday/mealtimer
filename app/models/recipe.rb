class Recipe < ApplicationRecord
  has_many :steps
  has_many :ingredients
  has_and_belongs_to_many :tools

  accepts_nested_attributes_for :steps
  accepts_nested_attributes_for :ingredients

  def self.search(query)
    if query.split.size > 1
      query_string = parse_search_query(query)
      results = Search.advanced_search(term: query_string)
      recipe_ids = []
      results.each {|r| recipe_ids.push(r.searchable_id)}
      Recipe.where(:id => recipe_ids)
    else
      Search.new(query: query).results
    end
  end

  def self.parse_search_query(query)
    query.split.join("|")
  end
end
