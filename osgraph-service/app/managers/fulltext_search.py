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
# app/manager/fulltext_search.py
from typing import List, Union

from app.services.fulltext_search import FulltextSearchService


class FulltextSearchManager:
    def __init__(self) -> None:
        pass

    def search(self, data) -> Union[List, None]:
        service = FulltextSearchService()
        result = service.execute(data=data)
        if result:
            return result
        return None
