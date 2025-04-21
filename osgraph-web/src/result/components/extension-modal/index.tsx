import { Modal } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { CHROME_ICON, EDGE_ICON, PLUGIN_CHROME, PLUGIN_GITHUB, PLUGIN_ICON, PlUGIN_EDGE } from "../../../constants/links";
import styles from "./index.module.less";


interface IProps {
    open: boolean;
    onClose: () => void;
}

const ExtensionModal: React.FC<IProps> = ({
    open,
    onClose
}) => {
    const { t } = useTranslation();
    return <Modal
        open={open}
        title={
            <div className={styles.title}>
                <img src={PLUGIN_ICON} className={styles.icon} alt="" />
                {t('graph.extension')}
            </div>
        }
        footer={null}
        onCancel={onClose}
        className={styles["extension-modal"]}
    >
        <p className={styles['extension_desc']}>{t('graph.extension_desc')}</p>
        <div className={styles['extension_item']}>
            <img src={CHROME_ICON} className={styles.logo} alt="" />
            <a href={PLUGIN_CHROME} target="_blank" rel="noreferrer">
                {t('graph.extension_chrome')}
            </a>
        </div>
        <div className={styles['extension_item']}>
            <img src={EDGE_ICON} className={styles.logo} alt="" />
            <a href={PlUGIN_EDGE} target="_blank" rel="noreferrer">
                {t('graph.extension_edge')}
            </a>
        </div>
        <p>{t('graph.visit')} <a href={PLUGIN_GITHUB} target="_blank">Github:Hypercrx</a> {t('graph.detail')}</p>
    </Modal>
}

export default ExtensionModal;