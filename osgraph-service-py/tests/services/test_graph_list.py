import os
from unittest.mock import patch
import pytest
from app.services.graph_list import GraphListService

@pytest.fixture
def set_env():
    os.environ["TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME"] = "test_graph"

# Mock 数据
mock_graph_service_data = [
    {
        "identity": 3,
        "label": "graph_service",
        "properties": {
            "comment": "这是一个开发活动图谱",
            "filter_keys": "topn:50",
            "input_types": "GitHubUser",
            "name": "开发活动"
        }
    },
    {
        "identity": 4,
        "label": "graph_service",
        "properties": {
            "comment": "这是一个获取开源伙伴的图谱",
            "filter_keys": "topn:50",
            "input_types": "GitHubUser",
            "name": "开源伙伴"
        }
    }
]

# 测试方法
def test_execute_returns_expected_data(set_env):
    with patch("app.services.graph_list.GraphClient") as MockGraphClient:
        mock_client_instance = MockGraphClient.return_value
        mock_client_instance.run.return_value = mock_graph_service_data
        service = GraphListService()
        result = service.execute()
        assert result == mock_graph_service_data
        MockGraphClient.assert_called_once_with("test_graph")
        mock_client_instance.run.assert_called_once_with("MATCH (n:graph_service) RETURN n")
