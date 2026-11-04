---
position: 4
surface: prose
release: draft
authorship: Claude draft
firstLine: This line must never reach the built site.
placeholder: true
---

CANARY_UNRELEASED_TEXT_MUST_NOT_SHIP

This chapter is marked draft, so it is absent from the build: not in the HTML,
not in the JavaScript, not in the feed. The string above is a canary.
scripts/check-unreleased.mjs greps the built output for it, and the build fails
if it appears anywhere.

Position 4 is also the noise slot on the contents page. The noise there is
random base64, drawn fresh at build time. It is not this text encrypted, and
its length says nothing about this text's length.
