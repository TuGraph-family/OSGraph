from werkzeug.routing import BaseConverter

class UsernameRepoConverter(BaseConverter):
    def to_python(self, value):
        if '/' in value:
            username, repo = value.split('/', 1)
            return {'username': username, 'repo': repo}
        else:
            return {'username': value, 'repo': None}

    def to_url(self, values):
        if values['repo']:
            return f"{values['username']}/{values['repo']}"
        else:
            return values['username']