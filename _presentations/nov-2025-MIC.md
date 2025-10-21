---
title: "Steerable Conditional Diffusion for Domain Adaptation in PET Image Reconstruction* & *Redefining the Data Fidelity Objective for PET Image Reconstruction"
date: 2025-11-04
venue: "IEEE NSS MIC 2025"
location: "Yokohama, Japan"
type: "Talk"        # Talk | Poster | Tutorial | Invited, etc.
slides: #/assets/slides/mic-2025-talk.pdf
poster:
video:
paper:
#links:
#  - text: "Conference program"
#    url: https://example.org/program
#tags: [topic-1, topic-2]
---

I gave an oral talk at the IEEE NSS-MIC (Nuclear Science Symposium-Medical Imaging Conference) covering the broad topic of resolving conflict between data fidelity and regularization (prior) terms in unsupervised PET image reconstruction.

In the first section of the talk, I demonstrated Steerable Conditional Diffusion for PET Image Reconstruction ([paper link and details here](/publications/#webber2025supervised_diffusion)). This work demonstrates initial results suggesting that the diffusion prior can be adapted to new domains during reconstruction (at inference-time).

In the second section of the talk, I introduced the Distributional Consistency (DC) loss, a new data fidelity objective for noisy inverse problems. In the PET image reconstruction context, DC loss has a number of advantages over traditional likelihood maximization:
- DC loss avoids overfitting to noisy measurement data,
- DC loss specifies an "ideal" level of data consistency (i.e. DC loss = 0).

The DC loss can be viewed as generalizing likelihood-maximization from a pointwise process to a distributional process. Correspondingly, it only works when we have many independent measurements and know the noise distribution on each of them. These assumptions are met in PET image reconstruction, as we have large sinograms of independently noisy measurements and the Poisson noise model on each measurement.

This work is currently under review, and is available as a preprint ([paper link and details here](/publications/#webber2025distributional_consistency_loss)).
