import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import { Steps } from "intro.js-react";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Backdrop from "../components/backdrop/Backdrop";
import ProfileCard from "../components/cards/ProfileCard";
import ProfileCardFixed from "../components/cards/ProfileCardFixed";
import ConnectedProfiles from "../components/connectedProfiles/ConnectedProfiles";
import EditProfile from "../components/editProfile/EditProfile";
import Student from "../components/editProfile/student/Student";
import EducationBlock from "../components/educationBlock/EducationBlock";
import Expertise from "../components/expertise/Expertise";
import { updateUserDetails } from "../components/header/Header";
import NetworkBlock from "../components/networkBlock/NetworkBlock";
import Portal from "../components/portal/Portal";
import Projects from "../components/projects/Projects";
import SkillsBlock from "../components/skillsBlock/SkillsBlock";
import Spinner from "../components/spinner/Spinner";
import Tags from "../components/tags/Tags";
import { createToast } from "../components/toast/Toast";
import { getClient } from "../graphql/client";
import { UPDATE_USER } from "../graphql/schemas/mutations";
import {
  GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS,
  GET_CATEGORY_ITEMS,
  GET_EXPERT,
  SOCIAL_ICONS,
  TAGS,
} from "../graphql/schemas/queries";

const Profile = ({ data: { expert } }: any) => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  const tourSteps = [
    {
      element: ".step-1",
      intro: t("Step One Text"),
      position: "bottom",
    },
    {
      element: ".step-2",
      intro: t("Step Two Text"),
      position: "bottom",
    },
    {
      element: ".step-3",
      intro: t("Step Three Text"),
      position: "right",
      tooltipClass: "tooltip-custom-width",
    },
    {
      element: ".step-4",
      intro: t("Step Four Text"),
      position: "left",
      tooltipClass: "tooltip-custom-width",
    },
    {
      element: ".step-5",
      intro: t("Step Five Text"),
      position: "right",
      tooltipClass: "tooltip-custom-width",
    },
    {
      element: ".step-6",
      intro: t("Step Six Text"),

      position: "left",
      tooltipClass: "tooltip-custom-width",
    },
    {
      element: ".step-7",
      intro: t("Step Seven Text"),
      position: "top",
    },
    {
      element: ".step-8",
      intro: t("Step Eight Text"),
      position: "top",
    },
  ];

  const { data: sessionData, update }: any = useSession();
  const {
    id,
    email,
    wikipediaLink,
    shortIntro,
    languages,
    publishing,
    translatableFields,
    tags,
    firstName,
    lastName,
    avatar,
    projects,
    linktree,
    connectedTo,
    slug,
    gender,
    categoryItems,
    title,
    instituteType,
  } = expert;

  const translatableField = translatableFields?.find((field: any) => field.locale === locale);

  const [userDetails, setUserDetails] = useState<any>({
    avatar: avatar,
    email: email,
    languages: languages,
    categoryItems: categoryItems,
    gender: gender,
    title: title,
    firstName,
    lastName,
    linktree: linktree,
    approachableFor: translatableFields.setUserApprochableFor,
    instituteType: instituteType,
  });

  const [userTags, setUserTags] = useState(tags);
  const [userExpertise, setUserExpertise] = useState(translatableField?.experties ?? null);
  const [userNetwork, setUserNetwork] = useState(translatableField?.network ?? null);
  const [userEducation, setUserEducation] = useState(translatableField?.education ?? null);
  const [userSkills, setUserSkills] = useState(translatableField?.skills ?? null);
  const [userProjects, setUserProjects] = useState(projects);
  const [userConnectedTo, setUserConnectedTo] = useState(connectedTo);
  const [profileCardFixed, setProfileCardFixed] = useState(false);
  const [updateClient, setUpdateClient] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [tourIsOpen, setTourIsOpen] = useState<boolean>(false);
  const profileCardRef = useRef<any>(null);
  const [edit, setEdit] = useState({ isEditing: false, editComponentType: "", data: {} });
  const [isLoading, setIsLoading] = useState(false);
  // const session: any = useSession();
  // ALL QUERIES
  const { data: allCategories } = useQuery(GET_CATEGORY_ITEMS);
  const { data: allCategoriesWithFirstLevelSubs } = useQuery(GET_CATEGORIES_WITH_FIRST_LEVEL_ITEMS);
  const { data: allTags } = useQuery(TAGS);
  //
  const { isEditing, editComponentType, data } = edit;
  const [updateUser, { data: responseData, loading: responseLoading }] = useMutation(UPDATE_USER);

  const expertCanEdit = sessionData?.user?.user?.role?.type === "expert" && sessionData?.user.user.slug === slug;
  const expertCanRepeatWalktour =
    sessionData?.user?.user?.role?.type === "expert" && !sessionData?.user.user.firstTimeLogin;

  const onEditHandler = (editType: string, data: any) => {
    const modifiedEditdata = { ...edit, data, isEditing: true, editComponentType: editType };
    setEdit(modifiedEditdata);
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  useEffect(() => {
    const onCloseModalHandler = (e: any) => {
      if (e.keyCode === 27) {
        setEdit({ ...edit, isEditing: false });
      }
    };
    window.addEventListener("keydown", onCloseModalHandler);
    return () => window.removeEventListener("keydown", onCloseModalHandler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setProfileCardFixed(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (responseData?.updateUser !== null) {
      setUpdateClient(true);
    } else {
      setUpdateClient(false);
      createToast({ message: t("Please, try another email address"), type: "error" });
    }
  }, [responseData?.updateUser]);

  // set new user Data
  useEffect(() => {
    const translatableField = translatableFields?.find((field: any) => field.locale === locale);

    setUserDetails({
      avatar: avatar,
      email: email,
      languages: languages,
      categoryItems: categoryItems,
      gender: gender,
      title: title,
      firstName,
      lastName,
      linktree: linktree,
      approachableFor: translatableField?.approachableFor,
      instituteType: instituteType,
    });
    setUserTags(tags);
    setUserExpertise(translatableField?.experties);
    setUserNetwork(translatableField?.network);
    setUserEducation(translatableField?.education);
    setUserSkills(translatableField?.skills);
    setUserProjects(projects);
    setUserConnectedTo(connectedTo);
  }, [
    categoryItems,
    connectedTo,
    translatableField,
    email,
    firstName,
    gender,
    languages,
    lastName,
    linktree,
    projects,
    tags,
    title,
    avatar,
    locale,
    translatableFields,
    instituteType,
  ]);

  useEffect(() => {
    document.body.style.overflow = edit.isEditing && !isMobile() ? "hidden" : "auto";
  }, [edit.isEditing]);

  useEffect(() => {
    if (sessionData?.user?.user?.firstTimeLogin) {
      setTourIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!tourIsOpen) return;
    const handleClick = (ev: any) => {
      if (ev.target.className === "introjs-overlay") {
        updateUser({
          variables: { data: { firstTimeLogin: false }, id: id.toString(), locale: locale },
        });
        update({ firstTimeLogin: false });
        axios.get("/api/auth/session?update=true", {
          params: { editedData: JSON.stringify({ changeFirstTimeLogin: true }) },
        });
        setTourIsOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    //eslint-disable-next-line
  }, [tourIsOpen]);

  useEffect(() => {
    if (sessionData?.user?.user?.role?.type === "authenticated") return;

    const id = setTimeout(() => {
      if (!tourIsOpen || isMobile()) return;

      let tooltip = document.querySelector(".introjs-tooltip")! as HTMLElement;
      let arrow = document.querySelector(".introjs-arrow")! as HTMLElement;

      tooltip.style.left = "unset";

      if (currentStepIndex === 0) {
        tooltip.style.transform = `translateX(calc(960px - 290px))`;
        arrow.style.left = "50%";
      }
      if (currentStepIndex === 1) {
        tooltip.style.transform = `translateX(calc(50% + 175px))`;
        tooltip.style.left = "unset";
        arrow.style.left = "50%";
        arrow.style.bottom = "unset";
      }
      if (currentStepIndex === 2) {
        tooltip.style.transform = "unset";
        arrow.style.left = "-10px";
        arrow.style.bottom = "calc(100% - 20px)";
        arrow.style.right = "unset";
      }
      if (currentStepIndex === 3) {
        tooltip.style.transform = "unset";
        arrow.style.bottom = "calc(100% - 20px)";
        arrow.style.right = "-10px";
        arrow.style.left = "unset";
      }
      if (currentStepIndex === 4) {
        tooltip.style.transform = "unset";
        arrow.style.left = "-10px";
        arrow.style.bottom = "calc(100% - 20px)";
        arrow.style.right = "unset";
      }
      if (currentStepIndex === 5) {
        tooltip.style.left = "50%";
        tooltip.style.transform = "unset";
        arrow.style.right = "-10px";
        arrow.style.left = "unset";
        arrow.style.bottom = "calc(100% - 20px)";
      }
      if (currentStepIndex === 6) {
        tooltip.style.transform = `translateX(calc(50% + 175px))`;
        arrow.style.left = "50%";
        arrow.style.bottom = "-10px";
        arrow.style.right = "unset";
      }
      if (currentStepIndex === 7) {
        tooltip.style.transform = `translateX(calc(50% + 175px))`;
        arrow.style.left = "50%";
        arrow.style.bottom = "-10px";
      }
    }, 300);

    return () => clearTimeout(id);
  }, [tourIsOpen, currentStepIndex, sessionData]);

  const updateClientHandler = (data: any) => {
    const keys = Object.keys(data);
    if (keys[0] in userDetails) {
      if (data.firstName || data.lastName || data.title || data.avatar) {
        updateUserDetails({ ...userDetails, ...data });
      }
      const modifyUserDetails = { ...userDetails, ...data, email: !updateClient ? data.email : userDetails.email };
      setUserDetails({ ...modifyUserDetails });
    }

    if (data.tags) setUserTags([...data.tags]);
    if (data.expertise) setUserExpertise(data.expertise);
    if (data.network) setUserNetwork(data.network);
    if (data.education) setUserEducation(data.education);
    if (data.skills) setUserSkills(data.skills);
    if (data.connectedTo) setUserConnectedTo(data.connectedTo);
    if (data.projects) setUserProjects(data.projects);
  };

  const onUpdateProfileHandler = (data: any) => {
    setIsLoading(true);
    setUpdateClient(true);
    let modifiedData = {};
    if (data.avatar) {
      // let id = data.avatar.id;
      // data.avatar = id;
      modifiedData = { ...data, avatar: data.avatar.id };
    } else {
      modifiedData = { ...data };
    }

    updateUser({ variables: { data: modifiedData, id: id, locale: locale } });
    if (data.firstName || data.lastName || data.title || data.avatar) {
      axios.get("/api/auth/session?update=true", {
        params: { editedData: JSON.stringify(data) },
      });
    }
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <Portal>
        <Backdrop background>
          <Spinner />
        </Backdrop>
      </Portal>
    );

  return sessionData?.user?.user?.role?.type === "authenticated" && +sessionData.user.user.id === +id ? (
    <>
      <NextSeo title={sessionData?.user?.user?.firstName} description="HeiExpert" />

      <Student
        email={expert.email}
        gender={expert.gender}
        firstName={expert.firstName}
        lastName={expert.lastName}
        id={id}
      />
    </>
  ) : (
    <>
      <NextSeo title={sessionData?.user?.user?.firstName} description="HeiExpert" />
      <div className={edit.isEditing ? "editExpertWrapper" : ""}>
        {!expertCanEdit && (
          <ProfileCardFixed
            email={email}
            firstName={firstName}
            lastName={lastName}
            avatar={avatar}
            id={id}
            userDetails={userDetails}
            profileCardFixed={profileCardFixed}
          />
        )}
        <div ref={profileCardRef}>
          <ProfileCard
            userDetails={userDetails}
            onEdit={onEditHandler}
            wikipediaLink={wikipediaLink}
            avatar={avatar}
            publishing={publishing}
            shortIntro={shortIntro}
            expertCanEdit={expertCanEdit}
            id={id}
            expertCanRepeatWalktour={expertCanRepeatWalktour}
            onOpenTour={() => {
              setCurrentStepIndex(0);
              setTourIsOpen(true);
            }}
          />
        </div>
        <div className="breakLine" />
        {(expertCanEdit || (!expertCanEdit && tags.length > 0)) && (
          <Tags onEdit={onEditHandler} tags={userTags} expertCanEdit={expertCanEdit} />
        )}

        <div className="profile-experience">
          <div className="step-3">
            {(expertCanEdit || (!expertCanEdit && userExpertise)) && (
              <Expertise onEdit={onEditHandler} experties={userExpertise} expertCanEdit={expertCanEdit} />
            )}
          </div>
          <div className="step-4">
            {(expertCanEdit || (!expertCanEdit && userNetwork)) && (
              <NetworkBlock onEdit={onEditHandler} network={userNetwork} expertCanEdit={expertCanEdit} />
            )}
          </div>
          <div className="step-5">
            {(expertCanEdit || (!expertCanEdit && userEducation)) && (
              <EducationBlock onEdit={onEditHandler} education={userEducation} expertCanEdit={expertCanEdit} />
            )}
          </div>
          <div className="step-6">
            {(expertCanEdit || (!expertCanEdit && userSkills)) && (
              <SkillsBlock onEdit={onEditHandler} skills={userSkills} expertCanEdit={expertCanEdit} />
            )}
          </div>
        </div>

        {(expertCanEdit || (!expertCanEdit && projects.length > 0)) && (
          <Projects onEdit={onEditHandler} projects={userProjects} expertCanEdit={expertCanEdit} />
        )}
        <div className="breakLine" />
        {(expertCanEdit || (!expertCanEdit && connectedTo.length > 0)) && (
          <ConnectedProfiles onEdit={onEditHandler} connectedTo={userConnectedTo} expertCanEdit={expertCanEdit} />
        )}
      </div>

      {isEditing && (
        <EditProfile
          data={data}
          editComponentType={editComponentType}
          onClose={() => setEdit({ ...edit, isEditing: false })}
          onUpdateProfile={onUpdateProfileHandler}
          allCategories={allCategories}
          allCategoriesWithFirstLevelSubs={allCategoriesWithFirstLevelSubs}
          allTags={allTags}
          onUpdateClient={updateClientHandler}
        />
      )}
      {!isMobile() && (
        <Steps
          enabled={tourIsOpen}
          steps={tourSteps}
          initialStep={0}
          onExit={() => {}}
          onChange={i => {
            setCurrentStepIndex(i);
          }}
          onComplete={() => {
            updateUser({
              variables: { data: { firstTimeLogin: false }, id: id.toString(), locale: locale },
            });
            update({ firstTimeLogin: false });
            axios.get("/api/auth/session?update=true", {
              params: { editedData: JSON.stringify({ changeFirstTimeLogin: true }) },
            });
            setTourIsOpen(false);
          }}
          options={{
            hideNext: false,
            exitOnEsc: false,
            nextLabel: t("Next"),
            prevLabel: t("Back"),
            doneLabel: t("Done"),
          }}
        />
      )}
    </>
  );
};

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  // const page = "/" + ctx.params.page;
  // if user has no session then redirect to login page
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data } = await getClient().query({
    query: GET_EXPERT,
    variables: {
      slug: ctx.params.slug,
    },
    fetchPolicy: "no-cache",
  });

  if (data.expert === null) {
    return {
      notFound: true,
    };
  }

  const { data: socialIcons } = await getClient().query({
    query: SOCIAL_ICONS,
    variables: {
      locale: ctx.locale,
    },
    fetchPolicy: "no-cache",
  });

  const icons = socialIcons.socialIcons;

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ["common"])),
      data,
      icons,
    },
  };
}

export default Profile;
