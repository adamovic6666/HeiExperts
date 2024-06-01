import { useMutation } from "@apollo/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import PageParticles from "../components/particles/PageParticles";
import { UPDATE_USER } from "../graphql/schemas/mutations";

export const FavoritesContext = createContext({
  favorites: [],
  updateFavorites: (id: number) => {},
});

const FavoritesContextProvider = ({ children }: any) => {
  const session: any = useSession();
  const [updateUser] = useMutation(UPDATE_USER);
  const [favorites, setFavorites] = useState<any>(null);
  const [userId, setUserId] = useState<any>();
  const { locale, pathname } = useRouter();

  const animationSession = typeof window !== "undefined" && sessionStorage.getItem("animation");

  const authenticated = session.status !== "unauthenticated";
  const leftParticles = pathname === "/";
  const rightParticles = ["/", "/[slug]", "/[slug]/favorites"].includes(pathname);

  useEffect(() => {
    sessionStorage.removeItem("animation");
  }, []);

  useEffect(() => {
    if (session.data) {
      setFavorites(JSON.parse(session.data?.user?.user?.favorites));
      setUserId(session.data?.user?.user.id);
    }
  }, [session.data]);

  useEffect(() => {
    const id = setTimeout(() => {
      sessionStorage.setItem("animation", "isRemoved");
    }, 2000);

    return () => clearTimeout(id);
  }, []);

  const updateFavorites = (profileId: number) => {
    let modifiedIds;
    if (favorites.includes(profileId)) {
      modifiedIds = favorites.filter((id: number) => id !== profileId);
    } else {
      modifiedIds = favorites.concat(profileId);
    }
    setFavorites(modifiedIds);
    axios.get("/api/auth/session?update=true", {
      params: { favorites: JSON.stringify(modifiedIds) },
    });
    updateUser({
      variables: { data: { favorites: modifiedIds }, id: userId.toString(), locale: locale },
    });

    return modifiedIds;
  };

  const value = {
    favorites,
    updateFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {!authenticated && session.status !== "loading" && leftParticles && animationSession && (
        <div className="redBackgroundCornerWrapper">
          <div className="redBackgroundCorner ">
            <div></div>
            <PageParticles className="page-particles" />
          </div>
        </div>
      )}
      {authenticated && session.status !== "loading" && rightParticles && animationSession && (
        <div className="redBackgroundCornerWrapper">
          <div className={`right redBackgroundCorner`}>
            <div></div>
            <PageParticles className="page-particles" />
          </div>
        </div>
      )}
      {authenticated && session.status !== "loading" && rightParticles && !animationSession && (
        <div className="redBackgroundCornerWrapper animated-redBackgroundCorner">
          <div className={`right redBackgroundCorner`}>
            <div></div>
            <PageParticles className="page-particles" />
          </div>
        </div>
      )}
      {!authenticated && session.status !== "loading" && leftParticles && !animationSession && (
        <div className="redBackgroundCornerWrapper animated-redBackgroundCorner">
          <div className={`redBackgroundCorner`}>
            <div></div>
            <PageParticles className="page-particles" />
          </div>
        </div>
      )}
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContextProvider;
