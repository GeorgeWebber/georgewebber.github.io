require 'bibtex'
require 'date'
require 'json'

module PublicationManifest
  def self.records
    bibliography = BibTeX.open(File.expand_path('../_bibliography/papers.bib', __dir__))
    bibliography.entries.values.map do |entry|
      month = Date::ABBR_MONTHNAMES.index { |name| name && name.downcase == entry[:month].to_s.downcase[0, 3] } || 0
      {
        key: entry.key, title: entry[:title].to_s,
        category: entry[:publication_type].to_s,
        first_author: entry[:first_author].to_s == 'true',
        cofirst_author: entry[:cofirst_author].to_s == 'true',
        year: entry[:year].to_s.to_i, month: month,
        selected: entry[:selected].to_s == 'true', selected_order: entry[:selected_order].to_s.to_i,
        cv_selected: entry[:cv_selected].to_s == 'true', cv_order: entry[:cv_order].to_s.to_i,
        preview: entry[:preview].to_s, preview_alt: entry[:preview_alt].to_s,
        preview_credit: entry[:preview_credit].to_s
      }
    end
  end
end

puts JSON.pretty_generate(PublicationManifest.records) if $PROGRAM_NAME == __FILE__
