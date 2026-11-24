# Local preview and regression tests

Use the production repository, `C:\Users\gw23\git\georgewebber.github.io`, whose origin is `https://github.com/GeorgeWebber/georgewebber.github.io.git`.

## Windows: one command

Docker Desktop is the only host dependency. From the repository directory:

```powershell
.\site.cmd start
```

Open <http://localhost:8080>. The command starts Docker Desktop if needed, builds the image, starts Jekyll and waits for a healthy preview. Content changes rebuild automatically; `_config.yml` changes restart Jekyll automatically.

```powershell
.\site.cmd test
.\site.cmd status
.\site.cmd logs
.\site.cmd stop
```

`test` builds a separate production site, prunes CSS as deployment does, runs metadata tests and exercises the built pages in Chromium. A failure returns a nonzero exit code. Testing can run while the preview stays open. Dependencies and browser binaries are installed inside the image from the checked-in lockfiles; no Ruby, Node or browser installation is needed on Windows.

## VS Code dev container (optional)

Open this repository in VS Code. With the Dev Containers extension installed, choose **Dev Containers: Reopen in Container** from the command palette. The same Compose service starts the preview automatically. Run `npm test` in its terminal. After dependency or Dockerfile changes, choose **Dev Containers: Rebuild Container**.

## Other systems and CI

With Docker and Compose installed:

```sh
docker compose up --build --wait site
docker compose --profile test run --build --rm tests
docker compose stop site
```

The deployment workflow requires this regression suite to pass before its deployment job runs. Pull requests build and test without publishing. The regression workflow can also be run manually from GitHub Actions. Nothing is published by the local commands.

## What is checked

- Canonical BibTeX keys, citation fields, explicit publication categories, first/co-first authorship and image credits.
- The four curated homepage papers, their order and initially open summaries.
- All ten combinations of publication type and authorship, combined search, empty states, year headings, fragment links, keyboard controls and preservation of expanded summaries.
- Desktop and mobile layouts in light and dark themes, working thumbnails, author highlighting and JavaScript errors.
- The complete bibliography with JavaScript disabled, retained news and presentations, generated CV publications and the exact downloadable PDF bytes.
- Internal page, fragment, image, script, stylesheet and supplementary links. Test tools must not be published as site content.

Expected bibliography membership is read from `_bibliography/papers.bib`, rather than a duplicated list. Add future papers there with `publication_type`, `first_author` and `cofirst_author`. Use `selected`/`selected_order` for the intentionally fixed homepage selection and `cv_selected`/`cv_order` for the generated CV. Put images under `assets/img/publication_preview/` and supply meaningful alt text and attribution for reused figures.

## Results and targeted debugging

Generated files are ignored by Git under `.test-artifacts/`: `build.log`, `publications.json`, the production `site/`, HTML `report/`, and failure screenshots and traces under `test-results/`. Homepage and publications screenshots are attached even when their tests pass. GitHub Actions uploads the report and failure artifacts for 14 days.

After a full test run, use a dev-container terminal to rerun a focused browser test against the existing test build:

```sh
npm run test:browser -- --project=desktop-light --grep "authorship combinations"
npm run test:report -- --host 0.0.0.0
```

The report server prints its port; VS Code can forward it. The test server is started and stopped automatically. Re-run `npm test` after source changes so the browser tests see a fresh production build.

External publisher availability is kept outside the deterministic regression suite: a publisher's rate limit or login requirement should not block a valid site build. The internal audit checks that links to this site's own files and pages resolve.
