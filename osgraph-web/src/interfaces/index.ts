interface IOptions {
  key: string;
  label: string;
  type: string;
  defaultValue?: any;
}

interface ITemplateParameterItem {
  parameterValue: string;
  parameterName: string;
  type: string
}

export type { IOptions, ITemplateParameterItem };
