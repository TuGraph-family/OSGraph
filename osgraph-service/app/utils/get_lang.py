from flask import request
from urllib.parse import urlparse, parse_qs
SUPPORTED_LANGUAGES = ['zh-CN','en-US']
def get_language():
    lang = request.args.get('lang')
    if lang and lang in SUPPORTED_LANGUAGES:
        return lang
    referer = request.headers.get('Referer')
    if referer:
        parsed_url = urlparse(referer)
        query_params = parse_qs(parsed_url.query)
        lang = query_params.get('lang', [None])[0]
        if lang and lang in SUPPORTED_LANGUAGES:
            return lang
    return 'zh-CN'  


