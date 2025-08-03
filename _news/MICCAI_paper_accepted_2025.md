---
layout: post
title: First-author MICCAI paper accepted
date: 2025-10-29 16:00:00-0000
inline: false
related_posts: false
---

🧠🖼️ "Measurement-Conditioned Diffusion Models for PET Image Reconstruction" is now available on [arXiv](https://lnkd.in/e8Td65KE).
In my previous work, I’ve been exploring how pre-trained diffusion models (trained on images) can be used for PET image reconstruction. This work instead explores the benefits and limitations of training diffusion models on raw PET data directly.

🚀 Key highlights:
- We introduce PET-DEFT, a novel training methodology for conditioning a diffusion model on raw PET measurements that builds on the DEFT framework (proposed by Alexander Denker and others).
- Our results show more faithful sampling from the high-quality PET image manifold—compared to unsupervised diffusion model approaches.
- We match the performance (NRMSE/SSIM) of supervised unrolling networks, with much reduced training costs (for memory in particular) and the ability to perform posterior sampling.
- We also present promising anecdotal results on real FDG PET data.

While this work is exciting, it should also be noted that our approach is less flexible than unsupervised approaches with pre-trained models. An important next step will be combining the flexibility of unsupervised approaches and the performance of our supervised approach – a topic we’re looking into with test-time adaptation…

Huge thanks to my co-authors Alexander Hammers, Andrew King and Andrew Reader, and to the MICCAI community—see you in South Korea!

---