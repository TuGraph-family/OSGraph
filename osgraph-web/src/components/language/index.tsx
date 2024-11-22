/**
 * file: switch components of language
 * author: Allen
*/

import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const Language: React.FC = () => {

  const { i18n } = useTranslation();

  return (
    <Select
      defaultValue="zh"
      style={{ width: 120 }}
      onChange={value => i18n.changeLanguage(value)}
      options={[
        { value: 'zh', label: '中文（简）' },
        { value: 'en', label: 'English(US)' },

      ]}
    />
  );
};

export default Language;