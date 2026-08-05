"""=============================================================================
Think in Japanese V2 - Local and hosted application entry point
=============================================================================
Purpose:
    Provides the single executable file used by PyCharm, local Python runs,
    and future WSGI hosting platforms.
============================================================================="""

from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
