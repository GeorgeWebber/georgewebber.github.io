# Contributing to al-folio

Thank you for considering contributing to al-folio!

## Pull Requests

We welcome your pull requests (PRs).
For minor fixes (e.g., documentation improvements), feel free to submit a PR directly.
If you would like to implement a new feature or a bug, please make sure you (or someone else) has opened an appropriate issue first; in your PR, please mention the issue it addresses.

Note that since [#2048](https://github.com/alshedivat/al-folio/pull/2048) al-folio uses the [prettier formatter](https://prettier.io/) for its code, meaning all new submitted code must conform to its standard. If you don't have `prettier` installed for your setup and the `prettier` code check fails when submitting a PR, you can check the referred failed action in our repo. In that action there will be an artifact with an HTML diff showing the needed changes.

### Adding new social media information

To add new social media information, there are a few places you might need to modify. Currently, the template supports icons from [Academicons](https://jpswalsh.github.io/academicons/), [Font Awesome](https://fontawesome.com/), and [Tabler Icons](https://tabler.io/icons). For an example PR, check [Add HAL id to socials](https://github.com/alshedivat/al-folio/pull/3206/files). Note that the information in all these files are alphabetically sorted.

- \_data/socials.yml - your social media information
- \_includes/metadata.liquid - add social media information to site metadata
- \_includes/social.liquid - where the social media icon will be displayed
- \_scripts/search.liquid.js - make the social media information appear in search

## Issues

We use GitHub issues to track bugs and feature requests.
Before submitting an issue, please make sure:

1. You have read [the FAQ section](FAQ.md) of the README and your question is NOT addressed there.
2. You have done your best to ensure that your issue is NOT a duplicate of one of [the previous issues](https://github.com/alshedivat/al-folio/issues).
3. Your issue is either a bug (unexpected/undesirable behavior) or a feature request.
   If it is just a question, please ask it in the [Discussions](https://github.com/alshedivat/al-folio/discussions) forum.

When submitting an issue, please make sure to use the appropriate template.

## License

By contributing to al-folio, you agree that your contributions will be licensed
under the LICENSE file in the root directory of the source tree.
