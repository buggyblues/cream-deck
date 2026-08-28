# Cream Deck Character SOP

Use this guide for the website, releases, and promotional artwork. Poses may change. Shape, color, and material must stay consistent.

## References

- Face and overall style: `assets/app-icon.png`
- Seated pose and console: `assets/mascot-hero-v3.webp`
- Standing pose and pairing card: `assets/mascot-pairing-v2.webp`
- Mouse-following pose: `assets/mascot-look-v2.webp`
- Inline paw glyph: `assets/panda-paw-glyph-v1.webp`
- Action sequence: `assets/mascot-action-v6-frame-01.webp` through `assets/mascot-action-v6-frame-08.webp`
- Pairing sequence: `assets/mascot-pairing-v4-frame-01.webp` through `assets/mascot-pairing-v4-frame-08.webp`
- Download sequence: `assets/mascot-download-v2-frame-01.webp` through `assets/mascot-download-v2-frame-08.webp`

Check every reference before creating a new image.

## Fixed details

- Use a large, warm ivory head with round black ears. Keep the body narrower than the head.
- Use matte black oval eye patches. The left side of the image contains a white `>` eye. The right side contains a white `<` eye.
- Use a small black `w` mouth, no nose, and light pink cheeks.
- Keep one continuous warm ivory area from the chin to the lower belly.
- Use black only on the shoulders, arms, body sides, legs, and outer paws.
- Do not add a black chest band, belt, vest, or white arms.
- Use warm ivory paw pads.
- Keep the mouse-following base eyes warm ivory and add only round black pupils in the page layer. Pupils may move or blink, but the eye patches, mouth, cheeks, and head shape must not change.
- The inline paw uses a black outer paw with warm ivory pads. Do not substitute an emoji or a mismatched paw illustration.
- Never draw a tail or place a tail-like round object behind the body.
- Use a soft plastic or ceramic surface. Do not use fur.

## Poses and props

- Vary the pose: turn a knob, hold a pairing card, lean forward, peek, or wave.
- Keep the body ratio, face, chest color, and limb colors unchanged.
- Use a cream console with a black panel, one blue switch, and a small green status light.
- A pairing card may contain a QR code. It must not cover the face or chest.
- Keep animation frames on the same canvas, at the same scale, with unchanged props and colors.
- Generate the action as one strict `4 × 2` sheet, then split it left to right across the top row and left to right across the bottom row.
- Use the action sequence in order: sneak, squash, star jump, dive, splat, spring, celebrate, and wobble landing.
- Favor exaggerated squash-and-stretch silhouettes over small pose changes. The action must still read when displayed around `16–19rem` wide.
- Keep the render crisp with no depth of field, motion blur, bloom, or soft-focus treatment.
- Keep every frame visually distinct. Do not mirror, duplicate, or reverse a small set of poses to imitate extra frames.
- Pairing cards stay beside the body and never cover the face or warm ivory chest.
- Wide poses use the compact grid safe area. Leave at least 98 source pixels horizontally and 92 source pixels vertically between the full silhouette and every cell edge.
- Website animation frames are exported at `768 × 768` and displayed no larger than `20rem` so Retina screens do not upscale the artwork.
- Reject magenta or purple spill on any transparent edge. Chroma cleanup must use boundary-connected background removal, edge color decontamination, and premultiplied-alpha resizing.
- Every eight-frame loop follows one action arc: anticipation, acceleration, peak, squash or impact, rebound, settle, and a final pose that connects back to frame one.

## Workflow

1. Choose a pose that differs from the previous image.
2. Lock the face, ivory chest, black limbs, no-tail rule, and soft material in the prompt.
3. Generate a transparent background when possible. Otherwise, use a solid key color and remove it afterward.
4. Confirm the background has real alpha and the subject is complete.
5. Preview the result on cream and dark backgrounds.
6. Check the tail, chest, eyes, mouth, pose, edges, and crop.
7. Keep the original aspect ratio on the website with `height: auto` and `object-fit: contain`.
8. Save approved artwork with a versioned filename. Do not overwrite a published asset.
9. Reuse approved iOS character assets when they already match the website pose. Generate a new pose only when the page interaction requires it.
10. Inspect the transparent 4 × 2 contact sheet before export. Any straight cut through a face, ear, limb, prop, or shadow rejects the whole sheet.

## Release check

- [ ] No tail or tail-like shape
- [ ] Continuous warm ivory chest and belly
- [ ] No black chest band, belt, or vest
- [ ] Correct eye patches, eye directions, mouth, and cheeks
- [ ] A different pose from other page artwork
- [ ] Real alpha with no rectangular background
- [ ] Clean edges on light and dark backgrounds
- [ ] Original aspect ratio preserved
- [ ] Animation frames share one canvas, scale, prop design, and character identity
- [ ] The full sequence contains eight distinct poses with readable motion between adjacent frames
- [ ] No straight cell-edge cuts or neighboring-frame pixels remain after splitting
- [ ] No purple, magenta, or dark shadow fringe remains on transparent edges
- [ ] The final frame returns naturally to the first frame without a pose jump
- [ ] Website frame files are `768 × 768` and rendered at no more than `20rem`
- [ ] Mouse-following pupils stay inside the generated eye whites at every viewport edge
- [ ] Inline paw shape and pad colors match the approved character
