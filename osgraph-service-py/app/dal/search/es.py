# # app/dal/graph/es.py
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError, ConnectionError, RequestError
from typing import Dict, List, Optional, Any
import logging
from dotenv import load_dotenv
import os

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ElasticsearchClient:
    def __init__(
        self,
    ):
        """初始化 Elasticsearch 连接"""
        ES_HOST = os.getenv("ES_HOST")
        ES_PORT = os.getenv("ES_PORT")
        ES_USERNAME = os.getenv("ES_USERNAME")
        ES_PASSWORD = os.getenv("ES_PASSWORD")
        try:
            self.es = Elasticsearch(
                hosts=[f"http://{ES_HOST}:{ES_PORT}"],
                basic_auth=(
                    (ES_USERNAME, ES_PASSWORD) if ES_USERNAME and ES_PASSWORD else None
                ),
                verify_certs=False,
            )
            if self.es.ping():
                logger.info("Connected to Elasticsearch successfully.")
            else:
                logger.error("Failed to connect to Elasticsearch.")
        except ConnectionError as e:
            logger.error(f"Error connecting to Elasticsearch: {e}")
            raise

    def search(
        self, index: str, query: Dict[str, Any], size: int = 10
    ) -> List[Dict[str, Any]]:
        try:
            response = self.es.search(index=index, query=query, size=size)
            return [hit["_source"] for hit in response["hits"]["hits"]]
        except NotFoundError:
            logger.error(f"Index '{index}' not found.")
            return []
        except RequestError as e:
            logger.error(f"Search error: {e}")
            return []

    def insert(self, index: str, document: Dict[str, Any]) -> Optional[str]:
        try:
            response = self.es.index(index=index, document=document)
            return response["_id"]
        except RequestError as e:
            logger.error(f"Insert error: {e}")
            return None

    def update(self, index: str, doc_id: str, update_fields: Dict[str, Any]) -> bool:
        try:
            self.es.update(index=index, id=doc_id, body={"doc": update_fields})
            return True
        except NotFoundError:
            logger.error(f"Document '{doc_id}' not found in index '{index}'.")
            return False
        except RequestError as e:
            logger.error(f"Update error: {e}")
            return False

    def delete(self, index: str, doc_id: str) -> bool:
        try:
            self.es.delete(index=index, id=doc_id)
            return True
        except NotFoundError:
            logger.error(f"Document '{doc_id}' not found in index '{index}'.")
            return False
        except RequestError as e:
            logger.error(f"Delete error: {e}")
            return False

    def close(self):
        self.es.close()
        logger.info("Elasticsearch connection closed.")
