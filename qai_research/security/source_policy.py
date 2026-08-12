from dataclasses import dataclass
from typing import List, Optional
from urllib.parse import urlparse


@dataclass
class SourceDecision:
    """
    قرار أمني مستقل حول مصدر خارجي.
    """

    allowed: bool
    reason: str = ""
    domain: str = ""


class SourcePolicy:
    """
    سياسة قبول مصادر البحث الخارجي.

    هذه الطبقة لا تتصل بـ QAI.
    ولا تقرر صحة محتوى الصفحة.
    مهمتها فقط التحكم في المصدر نفسه.
    """

    BLOCKED_SCHEMES = {
        "file",
        "javascript",
        "data",
        "blob",
    }

    BLOCKED_HOSTS = {
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "::1",
    }

    BLOCKED_SUFFIXES = (
        ".local",
        ".internal",
        ".localhost",
    )

    def __init__(
        self,
        allowed_domains: Optional[List[str]] = None,
        blocked_domains: Optional[List[str]] = None,
    ):
        self.allowed_domains = {
            self._normalize_domain(domain)
            for domain in (
                allowed_domains or []
            )
            if domain
        }

        self.blocked_domains = {
            self._normalize_domain(domain)
            for domain in (
                blocked_domains or []
            )
            if domain
        }

    def evaluate(
        self,
        url: str,
    ) -> SourceDecision:

        url = str(url or "").strip()

        if not url:
            return SourceDecision(
                allowed=False,
                reason="empty_url",
            )

        try:
            parsed = urlparse(url)
        except ValueError:
            return SourceDecision(
                allowed=False,
                reason="invalid_url",
            )

        scheme = (
            parsed.scheme or ""
        ).lower()

        hostname = (
            parsed.hostname or ""
        ).lower().strip()

        if scheme not in {
            "http",
            "https",
        }:
            return SourceDecision(
                allowed=False,
                reason="unsupported_scheme",
                domain=hostname,
            )

        if not hostname:
            return SourceDecision(
                allowed=False,
                reason="missing_hostname",
            )

        if scheme in self.BLOCKED_SCHEMES:
            return SourceDecision(
                allowed=False,
                reason="blocked_scheme",
                domain=hostname,
            )

        if hostname in self.BLOCKED_HOSTS:
            return SourceDecision(
                allowed=False,
                reason="local_host",
                domain=hostname,
            )

        if hostname.endswith(
            self.BLOCKED_SUFFIXES
        ):
            return SourceDecision(
                allowed=False,
                reason="internal_domain",
                domain=hostname,
            )

        if self._matches_domain(
            hostname,
            self.blocked_domains,
        ):
            return SourceDecision(
                allowed=False,
                reason="blocked_domain",
                domain=hostname,
            )

        if self.allowed_domains:
            if not self._matches_domain(
                hostname,
                self.allowed_domains,
            ):
                return SourceDecision(
                    allowed=False,
                    reason="domain_not_allowed",
                    domain=hostname,
                )

        return SourceDecision(
            allowed=True,
            reason="allowed",
            domain=hostname,
        )

    @staticmethod
    def _normalize_domain(
        domain: str,
    ) -> str:

        domain = str(domain).strip().lower()

        if "://" in domain:
            domain = urlparse(
                domain
            ).hostname or ""

        return domain.strip(".")

    @staticmethod
    def _matches_domain(
        hostname: str,
        domains: set,
    ) -> bool:

        for domain in domains:
            if (
                hostname == domain
                or hostname.endswith(
                    "." + domain
                )
            ):
                return True

        return False
