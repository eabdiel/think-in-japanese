"""=============================================================================
Think in Japanese application factory
=============================================================================
Purpose:
    Builds the Flask application, registers modular blueprints, and keeps
    application startup independent from feature implementation.
============================================================================="""

from flask import Flask

from app.routes.core import core_bp
from app.routes.reports import reports_bp
from app.config import Config


def create_app(config_object: type[Config] = Config) -> Flask:
    """Create and configure the Flask application instance."""
    application = Flask(__name__)
    application.config.from_object(config_object)
    application.register_blueprint(core_bp)
    application.register_blueprint(reports_bp)

    @application.context_processor
    def shared_runtime_settings() -> dict[str, object]:
        """Expose shared hosted-service settings to every Jinja template."""
        return {
            "ai_companion_enabled": application.config.get("AI_COMPANION_ENABLED", False),
            "ai_companion_bot_id": application.config.get("AI_COMPANION_BOT_ID", ""),
        }

    return application
