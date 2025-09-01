---
layout: post
title: Published first-author IEEE TRPMS paper
date: 2025-09-01 16:00:00-0000
inline: false
related_posts: false
---

🚀 I've got some early-access news from my PhD: a new first-authored paper is now live in IEEE Transactions on Radiation and Plasma Medical Sciences! 🎉

Title: Personalized MR-Informed Diffusion Models for 3D PET Image Reconstruction
🔍 What’s the idea?
 When someone has a PET brain scan, we often also have their MRI. Instead of training one “generic” AI model for everyone, we build a personalized prior:
 • We warp PET–MR data from many subjects onto the person’s own MRI to create subject-specific “pseudo-PET” examples that match their anatomy.
 • We pre-train a diffusion model on these personalized examples, so the model “expects” the right anatomy for that individual before we ever reconstruct their PET.
 • During reconstruction, this MR-informed prior nudges the result toward realistic anatomy while still letting PET-unique uptake patterns show through (i.e. it avoids just copying MR).
 • On low-count [18F]FDG data (both simulated and real), this personalized approach improves reconstruction accuracy versus non-personalized diffusion models, which is especially helpful when dose (and noise) are limiting factors.

👥 Big thanks to Alexander Hammers, Andrew King & Andrew Reader for their guidance and collaboration.

📄 Read it here:
 • IEEE Early Access: https://ieeexplore.ieee.org/document/11138025
 • Author’s accepted manuscript (arXiv): https://arxiv.org/abs/2506.03804
 * [Bibliographic details](/publications/#webber2025personalized_mr_informed)

---
