# Cream Deck Character SOP

Use this guide for the website, releases, and promotional artwork. Poses may change. Shape, color, and material must stay consistent.

## References

- Face and overall style: `assets/app-icon.png`
- Seated pose and console: `assets/mascot-hero-v3.webp`
- Standing pose and pairing card: `assets/mascot-pairing-v2.webp`

Check all three references before creating a new image.

## Fixed details

- Use a large, warm ivory head with round black ears. Keep the body narrower than the head.
- Use matte black oval eye patches. The left side of the image contains a white `>` eye. The right side contains a white `<` eye.
- Use a small black `w` mouth, no nose, and light pink cheeks.
- Keep one continuous warm ivory area from the chin to the lower belly.
- Use black only on the shoulders, arms, body sides, legs, and outer paws.
- Do not add a black chest band, belt, vest, or white arms.
- Use warm ivory paw pads.
- Never draw a tail or place a tail-like round object behind the body.
- Use a soft plastic or ceramic surface. Do not use fur.

## Poses and props

- Vary the pose: turn a knob, hold a pairing card, lean forward, peek, or wave.
- Keep the body ratio, face, chest color, and limb colors unchanged.
- Use a cream console with a black panel, one blue switch, and a small green status light.
- A pairing card may contain a QR code. It must not cover the face or chest.

## Workflow

1. Choose a pose that differs from the previous image.
2. Lock the face, ivory chest, black limbs, no-tail rule, and soft material in the prompt.
3. Generate a transparent background when possible. Otherwise, use a solid key color and remove it afterward.
4. Confirm the background has real alpha and the subject is complete.
5. Preview the result on cream and dark backgrounds.
6. Check the tail, chest, eyes, mouth, pose, edges, and crop.
7. Keep the original aspect ratio on the website with `height: auto` and `object-fit: contain`.
8. Save approved artwork with a versioned filename. Do not overwrite a published asset.

## Release check

- [ ] No tail or tail-like shape
- [ ] Continuous warm ivory chest and belly
- [ ] No black chest band, belt, or vest
- [ ] Correct eye patches, eye directions, mouth, and cheeks
- [ ] A different pose from other page artwork
- [ ] Real alpha with no rectangular background
- [ ] Clean edges on light and dark backgrounds
- [ ] Original aspect ratio preserved
