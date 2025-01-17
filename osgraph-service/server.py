#
# Copyright 2025 AntGroup CO., Ltd.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#

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
