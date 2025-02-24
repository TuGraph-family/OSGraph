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
import logging
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ConnectionError, NotFoundError, RequestError

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ElasticsearchClient:
    def __init__(
        self,
    ):
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
        self, index: str, query: Dict[str, Any], size: int = 10, sort: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        try:
            search_params = {
                "index":index,
                "query":query,
                "size":size
            }
            if sort:
                field, order = sort.split(":")
                search_params["sort"] = [{field:{"order":order}}]

            print(query)
            response = self.es.search(**search_params)
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
