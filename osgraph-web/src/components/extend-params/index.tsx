import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, InputNumber, Popover } from "antd";
import style from "./index.module.less";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { TooltipPlacement } from "antd/es/tooltip";
import { ITemplateParameterItem } from "../../interfaces";

const { Item } = Form;

interface Props {
  templateId: string;
  onChangeParams: (params: any) => void;
  placement?: TooltipPlacement;
  popupContainer?: HTMLElement;
  isCall?: boolean;
  templateParameterList?: ITemplateParameterItem[];
  path: string;
}
const ExtendParams: React.FC<Props> = ({
  templateId,
  onChangeParams,
  placement = "bottom",
  popupContainer = document.body,
  isCall = true,
  templateParameterList,
  path,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const renderItem = (option: any) => {
    switch (option.valueType) {
      case "int":
        return (
          <Item
            key={option.parameterName + templateId}
            name={option.parameterName}
            label={t(`${path}.${option.parameterName}`)}
            initialValue={option?.parameterValue}
            required={false}
            rules={[{ required: true, message: "请输入" }]}
          >
            <InputNumber style={{ width: "auto" }} min={3} max={50} />
          </Item>
        );
      case "str":
        return (
          <Item
            key={option.parameterName + templateId}
            name={option.parameterName}
            label={t(`${path}.${option.parameterName}`)}
            required={false}
            rules={[{ required: true, message: "请选择" }]}
            initialValue={
              dayjs(option?.parameterValue)
            }
          >
            <DatePicker format={"YYYY-MM-DD"} />
          </Item>
        );
      default:
        return null;
    }
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = Object.keys(values).reduce((acc, key) => {
        if (key.includes('time')) {
          acc[key] = dayjs(values[key]).format('YYYY-MM-DD');
        } else {
          acc[key] = values[key];
        }
        return acc;
      }, {} as Record<string, any>);
      if (isCall) {
        window?.Tracert?.call?.("click", 'a4378.b118751.c400429.d533730');
      }
      setOpen(false);
      onChangeParams(formattedValues);
    });
  };

  useEffect(() => {
    form?.resetFields();
  }, [templateId]);

  const onReset = () => {
    form.resetFields();
  };

  const stopPropagation = (event: React.MouseEvent) => {
    // Prevent events from bubbling up
    event.stopPropagation();
  };

  return (
    <div onClick={stopPropagation}>
      <Popover
        trigger={"click"}
        placement={placement}
        open={open}
        content={
          <div className={style.paramsForm}>
            <div className={style.headerBtn}>
              <CloseOutlined onClick={() => setOpen(false)} />
            </div>
            <Form form={form}>
              {templateParameterList?.map((item: any) => renderItem(item))}
            </Form>
            <div className={style.footerBtn}>
              <Button onClick={onReset}>{t("reset")}</Button>
              <Button type="primary" onClick={onSubmit}>
                {t("sure")}
              </Button>
            </div>
          </div>
        }
        onOpenChange={(val) => setOpen(val)}
        getPopupContainer={() => popupContainer}
      >
        <Button onClick={() => setOpen(true)} type="text">
          <SettingOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default ExtendParams;
