"""Per-client sliding-window rate limiter (in memory)."""

import time
from collections import defaultdict, deque


class SlidingWindowLimiter:
    MAX_CLIENTS = 10_000  # sweep idle clients beyond this so memory stays bounded

    def __init__(self, limit: int, window: float) -> None:
        self._limit = limit
        self._window = window
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def allow(self, client: str) -> bool:
        """Record a request from `client`; False if it is over the limit."""
        now = time.monotonic()
        hits = self._hits[client]
        while hits and now - hits[0] > self._window:
            hits.popleft()
        if len(hits) >= self._limit:
            return False
        hits.append(now)
        if len(self._hits) > self.MAX_CLIENTS:
            self._forget_idle(now)
        return True

    def _forget_idle(self, now: float) -> None:
        idle = [c for c, hits in self._hits.items() if not hits or now - hits[-1] > self._window]
        for client in idle:
            del self._hits[client]
