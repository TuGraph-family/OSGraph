/** @jsxImportSource @emotion/react */
import { useTranslation } from "react-i18next";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC<{ source?: string }> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { source = "404" } = props;
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="404"
        title={t(source === "404" ? "页面未找到" : "参数错误")}
        subTitle={t(source === "404" ? "Page Not Found" : "Parameter Error")}
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            {t("goHome")}
          </Button>
        }
      />
    </div>
  );
};

export default PageNotFound;
