---
title: "Supervised Diffusion-Model-based PET Image Reconstruction @ MICCAI 2025"
date: 2025-09-26
venue: "MICCAI 2025"
location: "Daejeon, South Korea"
type: "Poster"        # Talk | Poster | Tutorial | Invited, etc.
slides: #/assets/slides/mic-2025-talk.pdf
poster:
video:
paper:
#links:
#  - text: "Conference program"
#    url: https://example.org/program
#tags: [topic-1, topic-2]
---

I gave a poster talk on how we can train a diffusion model with high-quality PET images and low-quality PET measurement data to reconstruction new PET images from a low-quality acquired dataset.

The key takeaways were:
- Image reconstruction algorithms that train on measured data perform better (in-distribution) that those that just use images.
  - My personal hypothesis is that this is because the training process allows them to reconcile the noisy gradient updates from increasing the data likelihood together with the cleaner information learnt from high-quality images.
- Our PET-DEFT approach, using a diffusion model directly conditioned on measurement data, matched the previous state-of-the-art (non-diffusion approach) on quantitative reconstruction and accuracy whilst also enabling uncertainty estimatation via sampling from the generative model.
- Our approach scales to 3D and can be performed with real data.

Find the paper details [here](/publications/#webber2025supervised_diffusion).