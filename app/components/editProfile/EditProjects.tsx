import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useState } from "react";
import Input from "../../components/input/Input";
import { Project } from "../../components/projects/Projects";
import styles from "../../styles/components/editProjects.module.scss";
import icons from "../../styles/src";

type Data = {
  data: [any];
  onUpdate: (data: any) => void;
  updateClient: (data: any) => void;
};

const EditProjects = ({ data, onUpdate, updateClient }: Data) => {
  const { t } = useTranslation("common");
  const [expertProjects, setExpertProjects] = useState<any[]>(data);
  const [projectValue, setProjectValue] = useState<any>("");
  const [linkValue, setLinkValue] = useState<any>("");
  const [project, setProject] = useState({ label: "", link: "", __typename: "ProjectsResponse" });

  const onAddProject = (ev: any) => {
    setProject({ ...project, label: ev.target.value });
    setProjectValue(ev.target.value);
  };

  const onAddLink = (ev: any) => {
    setProject({ ...project, link: ev.target.value });
    setLinkValue(ev.target.value);
  };

  const onDeleteHandler = (label: string) => {
    const modifiefProjects = expertProjects.filter(p => p.label !== label);
    setExpertProjects(modifiefProjects);
    onUpdate(
      modifiefProjects.map(p => {
        return {
          label: p.label,
          link: p.link,
        };
      }),
    );
    updateClient(
      modifiefProjects.map(p => {
        return {
          label: p.label,
          link: p.link,
        };
      }),
    );
  };

  const onAddProjectHandler = () => {
    const modifiefProjects = expertProjects.concat(project);
    setExpertProjects(modifiefProjects);
    onUpdate(
      modifiefProjects.map(p => {
        return {
          label: p.label,
          link: p.link,
        };
      }),
    );
    updateClient(
      modifiefProjects.map(p => {
        return {
          label: p.label,
          link: p.link,
        };
      }),
    );
  };

  return (
    <div className={styles.editProjects}>
      <p>{t("Erklärung zu den Forschungsprojekten")}</p>
      {!!expertProjects.length && (
        <div className={styles.editProjects__projects}>
          {expertProjects.map((project, idx) => {
            return <Project toDeleteTag={true} key={idx} project={project} onClick={onDeleteHandler} />;
          })}
        </div>
      )}
      <div>
        {project.label && <span className={styles.editProjects__symbol}>@</span>}
        <Input
          onChange={onAddProject}
          value={projectValue}
          label="New project"
          id="name"
          type="text"
          name=""
          maxLength={50}
        />
        <Input onChange={onAddLink} value={linkValue} label="Link" id="name" type="text" name="" />
        {!!linkValue.trim() && !!projectValue.trim() && (
          <button type="button" className={styles.editProjects__add__button} onClickCapture={onAddProjectHandler}>
            <Image src={icons.addIcon} alt="add-icon" />
            {t("Add")}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditProjects;
