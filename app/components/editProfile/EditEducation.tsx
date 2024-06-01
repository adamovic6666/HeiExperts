// @ts-ignore
import { ContentState, EditorState, convertFromHTML, convertToRaw } from "draft-js";
// @ts-ignore
import draftToHtml from "draftjs-to-html";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from "../../styles/components/editCKEditorModal.module.scss";
// @ts-ignore
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });

type Data = {
  data: any;
  onUpdate: (data: any) => void;
  updateClient: (data: any) => void;
};

const EditEducation = ({ data, onUpdate, updateClient }: Data) => {
  const { t } = useTranslation("common");
  const blocksFromHTML = convertFromHTML(data ?? "");

  const [text, setText] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap),
    ),
  );

  const onEditorStateChange = (content: any) => {
    setText(content);
    onUpdate(draftToHtml(convertToRaw(content.getCurrentContent())));
    updateClient(draftToHtml(convertToRaw(content.getCurrentContent())));
  };

  return (
    <div className={`${styles.editCKEditorModal} editEducation`}>
      <div>
        {t("Education edit1")}
        <ul>
          <li> {t("Education edit2")}</li>
          <li> {t("Education edit3")}</li>
          <li> {t("Education edit4")}</li>
        </ul>
        <p>{t("Maximum characters: {{number}}", { number: 1000 })}</p>
        <span className={styles.editCKEditorModal__textAbs}>{t("The text")}</span>
      </div>
      <Editor
        // @ts-ignore
        editorState={text}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        handleBeforeInput={(val: string) => {
          const textLength = text.getCurrentContent().getPlainText().length;
          if (val && textLength >= 1000) {
            return "handled";
          }
          return "not-handled";
        }}
        handlePastedText={(val: string) => {
          const textLength = text.getCurrentContent().getPlainText().length;
          return val.length + textLength >= 1000;
        }}
      />
    </div>
  );
};

export default EditEducation;
