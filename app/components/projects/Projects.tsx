import { useTranslation } from "next-i18next";
import Image from "next/image";
import { PROFILE_TYPES } from "../../constants/index";
import styles from "../../styles/components/projects.module.scss";
import icons from "../../styles/src/index";
import { ProjectType, ProjectsType } from "../../types/index";

export const Project = ({ toDeleteTag, project, onClick }: ProjectType) => {
  const checkUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  const isFullUrl = checkUrl(project?.link);

  return (
    <div className={styles.projects__project}>
      {toDeleteTag && (
        <span onClick={() => onClick?.(project.label)}>
          <Image src={icons.remove} alt="remove" />
        </span>
      )}
      <a href={isFullUrl ? project?.link : "https://" + project?.link} target="_blank" rel="noreferrer">
        <span className={styles.projects__sym}>@</span>
        {project?.label}
      </a>
    </div>
  );
};

const Projects = ({ onEdit, projects, onClick, expertCanEdit }: ProjectsType) => {
  const { t } = useTranslation("common");
  return (
    <div className={`card ${styles.projects}  step-7`}>
      <div className={` title--with-icon  ${styles.projects__title}`}>
        <Image src={icons.projects} alt="project" />
        <h3>{t("Research projects and knowledge transfer")}</h3>
      </div>
      <div className={styles.projects__content}>
        {projects?.map((project, key) => (
          <Project key={key} project={project} onClick={onClick} />
        ))}
      </div>
      {expertCanEdit && (
        <button
          className={`editPen ${styles.projects__edit}`}
          onClickCapture={onEdit?.bind(this, PROFILE_TYPES.PROJECTS, projects)}
        >
          <Image src={icons.edit} alt="edit-image" />
          <Image className={`editPen__hover`} src={icons.editHover} alt="edit-image" />
        </button>
      )}
    </div>
  );
};

export default Projects;
