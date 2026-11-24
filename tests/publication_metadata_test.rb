require 'minitest/autorun'
require 'bibtex'
require 'json'
require 'liquid'
require_relative '../_scripts/publication_manifest'

class PublicationMetadataTest < Minitest::Test
  ROOT = File.expand_path('..', __dir__)
  HOME_SELECTION = %w[webber2026flow_mpc webber2025distributional_consistency_loss webber2025likelihood_scheduled webber2025supervised_diffusion].freeze

  def setup
    @source = File.read(File.join(ROOT, '_bibliography/papers.bib'), encoding: 'utf-8')
    @entries = BibTeX.parse(@source).entries
    @records = PublicationManifest.records
  end

  def test_keys_are_unique_and_all_records_have_explicit_filter_metadata
    keys = @source.scan(/^@(?:article|inproceedings|misc|mastersthesis)\{([^,]+),/).flatten
    assert_equal keys.length, keys.uniq.length, 'Duplicate BibTeX key'
    assert_equal keys.sort, @records.map { |record| record[:key] }.sort
    @entries.each_value do |entry|
      assert_includes %w[journal conference workshop abstract], entry[:publication_type].to_s, entry.key
      assert_includes %w[true false], entry[:first_author].to_s, entry.key
      %i[title author year abstract tldr].each { |field| refute_empty entry[field].to_s, "#{entry.key}: missing #{field}" }
      assert_match(/\A10\./, entry[:doi].to_s, "#{entry.key}: DOI must be an identifier") if entry[:doi]
    end
  end

  def test_homepage_selection_is_explicit_and_curated
    selected = @records.select { |record| record[:selected] }.sort_by { |record| record[:selected_order] }
    assert_equal HOME_SELECTION, selected.map { |record| record[:key] }
    assert_equal [1, 2, 3, 4], selected.map { |record| record[:selected_order] }
  end

  def test_thumbnails_exist_and_keep_attribution
    @records.reject { |record| record[:preview].empty? }.each do |record|
      image = File.expand_path(record[:preview], File.join(ROOT, 'assets/img/publication_preview'))
      assert File.file?(image), "#{record[:key]}: missing thumbnail"
      assert_operator record[:preview_alt].length, :>, 20, "#{record[:key]}: descriptive alt text required"
      refute_empty @entries[record[:key]][:preview_source].to_s unless record[:preview_credit].empty?
    end
  end

  def test_equal_contribution_is_documented_and_collaborators_are_not_inferred_as_first_authors
    mpc = @entries['webber2026flow_mpc']
    assert_equal 'true', mpc[:cofirst_author].to_s
    assert_equal 'true', mpc[:equal_contribution].to_s
    assert_equal 2, mpc.author.count { |author| author.last.to_s.include?('*') }
    %w[bell2026cardiac_motion dassanayake2026total_body barbano2026coordinated_diffusion chandrasekaran2026plug_and_play wei2026spect_diffusion poveda2026domain_randomization].each do |key|
      assert_equal 'false', @entries[key][:first_author].to_s, key
      refute_equal 'true', @entries[key][:cofirst_author].to_s, key
    end
  end

  def test_template_includes_cofirst_authorship_even_without_conventional_first_authorship
    prefix = File.read(File.join(ROOT, '_layouts/bib.liquid')).split('<div class="row"').first
    template = Liquid::Template.parse(prefix + '{{ principal_author }}')
    [
      [{ 'first_author' => 'true' }, 'true'],
      [{ 'first_author' => 'false', 'cofirst_author' => 'true' }, 'true'],
      [{ 'first_author' => 'false', 'cofirst_author' => 'false' }, 'false'],
      [{}, 'false']
    ].each { |entry, expected| assert_equal expected, template.render('entry' => entry).split.last }
  end

  def test_verified_citation_corrections_are_preserved
    assert_includes @entries['webber2025distributional_consistency_loss'][:title].to_s, 'Beyond Pointwise'
    assert_equal '133377--133402', @entries['webber2026flow_mpc'][:pages].to_s
    assert_equal '2026', @entries['webber2025personalized_mr_informed'][:year].to_s
    assert_equal '333--343', @entries['webber2025personalized_mr_informed'][:pages].to_s
    assert_equal '10.1007/978-3-032-04965-0_53', @entries['webber2025supervised_diffusion'][:doi].to_s
    refute_equal @entries['webber2024generative_pet'][:doi].to_s, @entries['webber2024multi_subject'][:doi].to_s
    assert_includes @source, 'J. Poveda-Martínez'
    assert_includes @source, 'Ž. Kereta'
    assert_equal %w[Bell Webber Petersen King Nazir Young], @entries['bell2026cardiac_motion'].author.map { |author| author.last.to_s }
  end

  def test_cv_selection_has_unique_order_and_no_duplicate_source_publications
    resume = JSON.parse(File.read(File.join(ROOT, 'assets/json/resume.json')))
    refute resume.key?('publications'), 'Generate publications from papers.bib instead of duplicating them'
    assert_includes resume['basics']['summary'], 'Fourth-year'
    refute_includes resume['basics']['summary'], 'Seeking a research internship'
    cv = @records.select { |record| record[:cv_selected] }
    refute_empty cv
    assert_equal (1..cv.length).to_a, cv.map { |record| record[:cv_order] }.sort
    pdf = File.binread(File.join(ROOT, 'assets/pdf/CV.pdf'))
    assert pdf.start_with?('%PDF-'), 'The CV must remain a real PDF'
  end
end
