import logging
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

from app.api.routes import analytics, auth, categories, health, transactions
from app.config import settings
from app.core.database import init_database
from app.core.metrics import setup_metrics

# … cut: logging setup

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")

    # Initialize Sentry if DSN is provided
    if settings.sentry_dsn:
        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            integrations=[
                FastApiIntegration(auto_enabling_instrumentations=False),
                LoggingIntegration(level=logging.INFO),
            ],
            traces_sample_rate=0.1,
            environment=settings.environment,
        )
        logger.info("Sentry initialized")

    # Initialize database
    await init_database()

    logger.info("Application startup complete")

    yield

    # Shutdown
    logger.info("Shutting down application")


# … cut: app creation, CORS and request logging

# Setup metrics
setup_metrics(app)
logger.info("Prometheus metrics enabled")

# … cut: routers
