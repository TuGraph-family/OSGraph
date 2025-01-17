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


from flask import current_app

from app.services.graph_services.develop_activity import (
    DevelopActivityServiceConfig,
)
from app.services.graph_services.os_interest import OSInterestServiceConfig
from app.services.graph_services.os_partner import OSPartnerServiceConfig
from app.services.graph_services.project_community import ProjectCommunityServiceConfig
from app.services.graph_services.project_contribution import (
    ProjectContributionServiceConfig,
)
from app.services.graph_services.project_ecosystem import ProjectEcosystemServiceConfig

SERVICE_CONFIGS = [
    ProjectContributionServiceConfig(),
    DevelopActivityServiceConfig(),
    ProjectCommunityServiceConfig(),
    ProjectEcosystemServiceConfig(),
    OSPartnerServiceConfig(),
    OSInterestServiceConfig(),
]


def register_all_services():
    """
    遍历所有的服务配置，并在应用启动时自动注册。
    """
    with current_app.app_context():
        for config in SERVICE_CONFIGS:
            config.register_service()
