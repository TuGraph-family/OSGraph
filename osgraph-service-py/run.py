# run.py
import os
from app import create_app
from dotenv import load_dotenv
from config import DevelopmentConfig, ProductionConfig

load_dotenv()

config_mapping = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

config_name = os.getenv('FLASK_CONFIG', 'production')
config_class = config_mapping.get(config_name.lower(), ProductionConfig)

app = create_app(config_class=config_class)

if __name__ == '__main__':
    app.run(port=8000, debug=app.config.get('DEBUG', False))
