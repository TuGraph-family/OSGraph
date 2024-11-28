import { message } from "antd";
import { template } from "lodash";
import request from "umi-request";

function parseStringToObjects(inputStr:string) {
  if (typeof inputStr !== 'string') {
      throw new TypeError('输入必须是一个字符串');
  }

  const parts = inputStr.split(';').filter(part => part.trim() !== '');

  const result = parts.map(part => {
      const obj:any = {};
      const keyValuePairs = part.split(',').filter(pair => pair.trim() !== '');

      keyValuePairs.forEach(pair => {
          const [key, value] = pair.split(':').map(str => str.trim());
          let parsedValue;
          if (/^-?\d+(\.\d+)?$/.test(value)) {
              parsedValue = Number(value);
          } else if (/^(true|false)$/i.test(value)) {
              parsedValue = value.toLowerCase() === 'true';
          } else {
              parsedValue = value.replace(/^"(.+)"$/, '$1');
          }
          obj[key] = parsedValue;
      });

      return obj;
  });

  return result;
}


export const getListQueryTemplate = async () => {
  const response = await request(`/api/graph/list`, {
    method: "get"
  });

  if (response?.status === 1) {
    return [];
  }
  let data = response?.data?.map((item:any)=>{
    item.templateName = item.name
    item.templateParameterList = parseStringToObjects(item.filter_keys).map((item:any)=>{
      return {
        "parameterName": item.key,
        "parameterValue": item.default,
        "valueType": item.type
      }
    })
    item.templateId = item.name
    item.id = item.name
    switch(item.name) {
      case '项目贡献':
        item.templateType = 'REPO_CONTRIBUTE'
        break;
      case '项目生态':
         item.templateType = 'REPO_ECOLOGY'
        break;
      case '项目社区':
        item.templateType = 'REPO_COMMUNITY'
        break;
      case '开发活动':
         item.templateType = 'ACCT_ACTIVITY'
        break;
      case '开源伙伴':
        item.templateType = 'ACCT_PARTNER'
        break;
      case '开源兴趣':
        item.templateType = 'ACCT_INTEREST'
        break;  
      default:
        item.templateType = ''
    }
    return item
  })
  return data
};

export const getExecuteFullTextQuery = async (params: {
  keyword: string;
  indexName: string;
}) => {
  const response = await request(`/api/graph/fulltext-search`, {
    method: "get",
    params: params
  });

  if (response?.status === 1) {
    return [];
  }
  let data = response?.data || []
  const uniqueDataForOf = [];
  const seenIdsForOf = new Set();

  for (const item of data) {
    item.id = item.name
    if (!seenIdsForOf.has(item.id)) {
      seenIdsForOf.add(item.id);
      uniqueDataForOf.push(item);
    }
  }
  
  return uniqueDataForOf
};


export const getExecuteQueryTemplate = async (params: {
  templateId: string;
  value: any;
  templateParameterList:any;
}) => {
  let url = ''
  let args:any = {}
  if(params.templateId === "项目贡献"){
    url = '/api/graph/project-contribution'
    args = {
      'GitHubRepo':params.value
    }
    params.templateParameterList.forEach((item:any)=>{
      if(item.parameterName === 'start-time'){
        item.parameterValue = 1
      }
      args[item.parameterName] = item.parameterValue
    })
  }
  const response = await request(url, {
    method: "get",
    params: args
  });
  response.data.vertices.forEach((item:any)=>{
    item.properties = item
  })
  response.data.edges.forEach((item:any)=>{
    item.properties = item
  })
  let res:any = {
    data:{
      nodes:response.data.vertices,
      edges:response.data.edges,
    },
    message:response.message,
  }
  if(response.status === 0){
    res.success = true
  }
  return res;
};
