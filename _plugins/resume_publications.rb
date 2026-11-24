require 'bibtex'
require 'date'
require 'json'
require 'fileutils'

module Jekyll
  # Keep the optional structured CV and its downloadable JSON in sync with the
  # canonical bibliography; resume.json stores professional data only.
  class ResumePublications < Generator
    safe true
    priority :low

    def generate(site)
      source = File.join(site.source, 'assets/json/resume.json')
      resume = JSON.parse(File.read(source))
      bibliography = BibTeX.open(File.join(site.source, '_bibliography/papers.bib'))
      papers = bibliography.entries.values.select { |entry| entry[:cv_selected].to_s == 'true' }
      papers.sort_by! { |entry| entry[:cv_order].to_s.to_i }
      resume['publications'] = papers.map do |entry|
        month = Date::ABBR_MONTHNAMES.index { |name| name && name.downcase == entry[:month].to_s.downcase[0, 3] }
        date = entry[:year].to_s
        date += format('-%02d', month) if month
        authors = entry.author.map(&:to_s).join(', ')
        summary = "Authors: #{authors}."
        summary += ' * Equal contribution.' if entry[:equal_contribution].to_s == 'true'
        summary += " #{entry[:note]}" if entry[:note]
        url = if entry[:html]
                entry[:html].to_s
              elsif entry[:doi]
                "https://doi.org/#{entry[:doi]}"
              else
                "https://arxiv.org/abs/#{entry[:arxiv]}"
              end
        {
          'name' => entry[:title].to_s,
          'publisher' => (entry[:journal] || entry[:booktitle] || entry[:school]).to_s,
          'releaseDate' => date,
          'url' => url,
          'summary' => summary
        }
      end
      site.data['resume'] = resume
      site.static_files.reject! { |file| file.relative_path == '/assets/json/resume.json' }
      site.static_files << GeneratedResume.new(site, resume)
    end
  end

  class GeneratedResume < StaticFile
    def initialize(site, resume)
      super(site, site.source, 'assets/json', 'resume.json')
      @resume = resume
    end

    def write(dest)
      target = destination(dest)
      FileUtils.mkdir_p(File.dirname(target))
      File.write(target, JSON.pretty_generate(@resume) + "\n")
      true
    end
  end
end
