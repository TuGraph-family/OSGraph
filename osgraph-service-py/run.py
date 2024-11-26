# run.py
import os

from dotenv import load_dotenv

from app import create_app
from config import DevelopmentConfig, ProductionConfig

load_dotenv()

config_mapping = {"development": DevelopmentConfig, "production": ProductionConfig}

config_name = os.getenv("FLASK_CONFIG", "production")
config_class = config_mapping.get(config_name.lower(), ProductionConfig)

app = create_app(config_class=config_class)

if __name__ == "__main__":
    app.run(port=80, debug=app.config.get("DEBUG", False))

# if __name__ == "__main__":
#     base_dir = os.path.dirname(os.path.abspath(__file__))
#     cert_path = os.path.join(base_dir, "certs/cert.pem")
#     key_path = os.path.join(base_dir, "certs/key.pem")
#     app.run(host="0.0.0.0",port=8000, ssl_context=(cert_path, key_path))
