import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, InputNumber, Popover } from "antd";
import style from "./index.module.less";
import { useState } from "react";
import { GRAPH_EXTEND_PARAMS_FORM } from "../../constants";
import { useTranslation } from "react-i18next";
import { getLast10YearsTimestampsInSeconds } from "../../utils/date";
import dayjs from "dayjs";
import { TooltipPlacement } from "antd/es/tooltip";

const { Item } = Form;

interface Props {
  templateId: any;
  onChangeParams: (params: any) => void;
  placement?: TooltipPlacement;
}
const ExtendParams: React.FC<Props> = ({
  templateId,
  onChangeParams,
  placement = "bottom",
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { startTimestamp } = getLast10YearsTimestampsInSeconds();
  const renderItem = (option) => {
    switch (option.type) {
      case "inputNumber":
        return (
          <Item
            key={option.key}
            name={option.key}
            label={t(option.label)}
            initialValue={option?.defaultValue}
            required={false}
            rules={[{ required: true, message: "请输入" }]}
          >
            <InputNumber min={0} />
          </Item>
        );
      case "date":
        return (
          <Item
            key={option.key}
            name={option.key}
            label={t(option.label)}
            required={false}
            rules={[{ required: true, message: "请选择" }]}
            initialValue={
              option.key === "start" ? dayjs(startTimestamp * 1000) : dayjs()
            }
          >
            <DatePicker />
          </Item>
        );
      default:
        return null;
    }
  };

  const onSubmit = () => {
    form.validateFields().then((values) => {
      setOpen(false);
      if (templateId === 1) {
        onChangeParams({
          ...values,
          start: values?.start ? dayjs(values.start).valueOf() : undefined,
          end: values?.end ? dayjs(values.end).valueOf() : undefined,
        });
        return;
      }
      onChangeParams(values);
    });
  };

  const onReset = () => {
    form.resetFields();
    onSubmit();
  };

  const stopPropagation = (event: React.MouseEvent) => {
    // 阻止事件冒泡
    event.stopPropagation();
  };

  return (
    <div onClick={stopPropagation}>
      <Popover
        placement={placement}
        open={open}
        content={
          <div className={style.paramsForm}>
            <div className={style.headerBtn}>
              <CloseOutlined onClick={() => setOpen(false)} />
            </div>
            <Form form={form}>
              {GRAPH_EXTEND_PARAMS_FORM?.[templateId]?.map((item) =>
                renderItem(item)
              )}
            </Form>
            <div className={style.footerBtn}>
              <Button onClick={onReset}>重置</Button>
              <Button type="primary" onClick={onSubmit}>
                确定
              </Button>
            </div>
          </div>
        }
      >
        <Button onClick={(e) => setOpen(true)} type="text">
          <SettingOutlined />
        </Button>
      </Popover>
    </div>
  );
};

export default ExtendParams;
