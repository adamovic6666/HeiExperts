// @ts-ignore
import { ContentState, EditorState, convertFromHTML, convertToRaw } from "draft-js";
// @ts-ignore
import draftToHtml from "draftjs-to-html";
// @ts-ignore
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useTranslation } from "react-i18next";
import styles from "../../styles/components/editCKEditorModal.module.scss";
// @ts-ignore
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });

type Data = {
  data: any;
  onUpdate: (data: any) => void;
  updateClient?: (data: any) => void;
  label?: string;
};

const EditApproachableFor = ({ data, onUpdate, updateClient, label }: Data) => {
  const blocksFromHTML = convertFromHTML(data ?? "");
  const { t } = useTranslation("common");

  const [text, setText] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap),
    ),
  );

  const onEditorStateChange = (content: any) => {
    setText(content);
    onUpdate(draftToHtml(convertToRaw(content.getCurrentContent())));
    updateClient && updateClient(draftToHtml(convertToRaw(content.getCurrentContent())));
  };

  return (
    <div className={styles.editCKEditorModal}>
      <span>{t("Approachable for")}</span>
      <Editor
        // @ts-ignore
        editorState={text}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
};

export default EditApproachableFor;
