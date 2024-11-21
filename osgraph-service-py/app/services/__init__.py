# app/services/__init__.py

from flask import current_app

from app.services.graph_services.develop_activities import (
    DevelopActivitiesServiceConfig,
)
from app.services.graph_services.os_interest import OSInterestServiceConfig
from app.services.graph_services.os_partner import OSPartnerServiceConfig
from app.services.graph_services.project_community import ProjectCommunityServiceConfig
from app.services.graph_services.project_contribution import (
    ProjectContributionServiceConfig,
)
from app.services.graph_services.project_ecology import ProjectEcologyServiceConfig

SERVICE_CONFIGS = [
    ProjectContributionServiceConfig(),
    ProjectEcologyServiceConfig(),
    ProjectCommunityServiceConfig(),
    DevelopActivitiesServiceConfig(),
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
