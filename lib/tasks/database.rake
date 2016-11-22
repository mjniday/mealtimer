namespace :database do
  desc "Fix sequence ids issue caused by setting Recipe ids when seeding"
  task correct_sequence_ids: :environment do
    ActiveRecord::Base.connection.tables.each do |t|
      ActiveRecord::Base.connection.reset_pk_sequence!(t)
    end
  end
end