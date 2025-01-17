'''
/*
 * @Author: KingSkyLi (15566300566@163.com)
 * @File Created: 2025-01-17
 * @Modified By: KingSkyLi (15566300566@163.com)
 * @Last Modified: 2025-01-17
 * @Description: 
 * @Copyright: 2023 - 2025 TuGraph, Ant Group
 */
'''


# server.py
import os

import flask
from dotenv import load_dotenv

from app import create_app
from config import DevelopmentConfig, ProductionConfig

flask.cli.show_server_banner = lambda *args: None

load_dotenv()

config_mapping = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}

config_name = os.getenv("FLASK_ENV", "production")

config_class = config_mapping.get(config_name.lower(), ProductionConfig)

app = create_app(config_class=config_class)

port = os.getenv('FLASK_PORT')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=app.config.get("DEBUG", False))
