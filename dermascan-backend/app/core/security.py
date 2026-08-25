"""
Basic request safety helpers.

Not needed to get a working demo — but worth adding before you
share a public URL (Hugging Face Spaces / Render) with judges,
since anyone with the link can otherwise hit /screen freely.
"""

MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024  # 8 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_upload(content_type: str, size_bytes: int) -> tuple[bool, str]:
    """Returns (is_valid, reason_if_invalid)."""
    if content_type not in ALLOWED_CONTENT_TYPES:
        return False, f"Unsupported content type: {content_type}"
    if size_bytes > MAX_IMAGE_SIZE_BYTES:
        return False, "Image exceeds maximum allowed size (8MB)"
    return True, ""


# TODO: add simple rate limiting (e.g. slowapi) before any public demo deploy.
