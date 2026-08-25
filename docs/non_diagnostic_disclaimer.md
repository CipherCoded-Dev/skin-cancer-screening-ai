# Non-Diagnostic Disclaimer

DermaScan AI is an **assistive screening tool**, not a diagnostic
device. It does not replace a licensed dermatologist or medical
professional.

Every result returned by the API and shown in the mobile app must
display, at minimum:

> "This is an assistive screening tool, not a medical diagnosis.
> Consult a dermatologist for any concerning result."

This text is already included in `ScreenResponse.disclaimer` — make
sure the mobile UI renders it visibly alongside every result, not
just in fine print.
