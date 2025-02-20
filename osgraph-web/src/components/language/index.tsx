/**
 * file: switch components of language
 * author: Allen
 */

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getUrlParams } from "../../utils";
import { IconFont } from "../icon-font";
import style from "./index.module.less";

const Language: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = getUrlParams("lang") || "zh-CN";

  useEffect(() => {
    i18n.changeLanguage(lang === "en-US" ? "en" : "zh");
  }, []);

  const onChangeLang = () => {
    const url = new URL(window.location.href);
    const newLang = lang === "en-US" ? "zh-CN" : "en-US";
    i18n.changeLanguage(newLang === "en-US" ? "en" : "zh");
    url.searchParams.set("lang", newLang);
    window.location.href = url.toString()
  };

  return (
    <div className={style["language"]} onClick={onChangeLang}>
      <IconFont type="os-icon-country" className={style["language-icon"]} />
      <div>{lang === "zh-CN" ? "中" : "EN"}</div>
    </div>
  );
};

export default Language;
