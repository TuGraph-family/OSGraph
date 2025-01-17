# OSGraph API Reference

OSGraph provides unique URL identifiers for basic open source graphs, making it convenient for sharing, referencing, and modification, while also supporting Markdown embedding.

Currently, the following open URLs are available:

| Type       | Function         | Note          |
|------------|------------------|---------------|
| **API**    | Backend Integration |             | 
| **HTML**   | Frontend Embedding  |             | 
| **PNG**    | Markdown Embedding  |             |
| **SVG**    | Markdown Embedding  | Coming Soon |

## Design

Open source graph URLs follow unified design specifications, distinguishing specific functions through URL prefixes.

| Type      | URL Prefix | Project URL Suffix                            | User URL Suffix                           |
|-----------|------------|----------------------------------------------|------------------------------------------|
| **API**   | /api      | /graphs/:graph/:platform/:org/:repo?:param*  | /graphs/:graph/:platform/:user?:param*   | 
| **HTML**  | -         | /graphs/:graph/:platform/:org/:repo?:param*  | /graphs/:graph/:platform/:user?:param*   | 
| **PNG**   | /png      | /graphs/:graph/:platform/:org/:repo?:param*  | /graphs/:graph/:platform/:user?:param*   |
| **SVG**   | /svg      | /graphs/:graph/:platform/:org/:repo?:param*  | /graphs/:graph/:platform/:user?:param*   |

Taking the API URL as an example, its standardized format is:
![](../img/api-fmt.jpg)

For example, TuGraph DB "Project Contribution" graph URL:
```
https://osgraph.com/api/graphs/project-contribution/github/TuGraph-family/tugraph-db?lang=en-US&repo-limit=10&start-time=2015-01-17&end-time=2025-01-17
```


## Variables

The specific meanings of variables in URLs are as follows:

| Variable    | Meaning              | Note                                  |
|------------|----------------------|---------------------------------------|
| `graph`    | Graph Type          | Currently supports 6 basic graph types | 
| `platform` | Data Platform Source | Currently only supports `github`      | 
| `org`      | Organization        |                                       |
| `repo`     | Repository          |                                       |
| `user`     | User                |                                       |
| `param`    | Parameters          | Parameter list relates to `graph` type |

The supported parameter lists for different graph types are:

| Graph Type           | Meaning                    | `lang` | `start-time` | `end-time` | `repo-limit` | `user-limit` | `country-limit` | `company-limit` | `topic-limit` |
|---------------------|----------------------------|--------|--------------|------------|--------------|--------------|-----------------|-----------------|---------------|
| `project-contribution` | Project Contribution Graph | Y      | Y            | Y          | Y            |              |                 |                 |               |
| `project-ecosystem`    | Project Ecosystem Graph    | Y      | -            | -          | Y            |              |                 |                 |               | 
| `project-community`    | Project Community Graph    | Y      | -            | -          |              | Y            | Y               | Y               |               |
| `developer-activity`   | Developer Activity Graph   | Y      | -            | -          |              | Y            |                 |                 |               |
| `os-partner`          | OS Partner Graph          | Y      | -            | -          |              | Y            |                 |                 |               |
| `os-interest`         | OS Interest Graph         | Y      | -            | -          | Y            |              |                 |                 | Y             |

Note:
* `Y`: Supported
* `-`: To be supported
* Not supported by default

