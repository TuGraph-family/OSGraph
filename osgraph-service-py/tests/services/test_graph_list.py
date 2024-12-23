import os
import pytest
from unittest.mock import patch
from app.services.graph_list import GraphListService
from app.utils.custom_exceptions import InvalidUsage


@pytest.fixture(autouse=True)
def setup_and_teardown():
    os.environ["TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME"] = "test_graph"
    yield
    del os.environ["TUGRAPHDB_OSGRAPH_SYSTEM_GRAPH_NAME"]


def test_graph_client_is_called():
    with patch("app.services.graph_list.GraphClient") as MockGraphClient:
        mock_client_instance = MockGraphClient.return_value
        mock_client_instance.run.return_value = []

        service = GraphListService()
        result = service.execute()

        MockGraphClient.assert_called_once_with(graph_name="test_graph")
        mock_client_instance.run.assert_called_once_with("MATCH (n:graph_service) RETURN n")
        assert result == []


def test_execute_returns_data():
    with patch("app.services.graph_list.GraphClient") as MockGraphClient:
        mock_client_instance = MockGraphClient.return_value
        mock_client_instance.run.return_value = [
            {"identity": 1, "label": "graph_service", "properties": {"name": "Test Graph"}}
        ]

        service = GraphListService()
        result = service.execute()

        MockGraphClient.assert_called_once_with(graph_name="test_graph")
        mock_client_instance.run.assert_called_once_with("MATCH (n:graph_service) RETURN n")
        assert result == [
            {"identity": 1, "label": "graph_service", "properties": {"name": "Test Graph"}}
        ]


def test_execute_raises_graph_client_error():
    with patch("app.services.graph_list.GraphClient") as MockGraphClient:
        mock_client_instance = MockGraphClient.return_value
        mock_client_instance.run.side_effect = Exception("Mocked Exception")

        service = GraphListService()
        with pytest.raises(InvalidUsage, match="GraphClient error: Mocked Exception"):
            service.execute()


def test_execute_handles_empty_result():
    with patch("app.services.graph_list.GraphClient") as MockGraphClient:
        mock_client_instance = MockGraphClient.return_value
        mock_client_instance.run.return_value = []

        service = GraphListService()
        result = service.execute()

        MockGraphClient.assert_called_once_with(graph_name="test_graph")
        mock_client_instance.run.assert_called_once_with("MATCH (n:graph_service) RETURN n")
        assert result == []
