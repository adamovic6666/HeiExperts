import { useQuery } from "@apollo/client";
import Filters, { toggleFilters } from "../../components/filters/Filters";
import ProfileTeaser from "../../components/profileTeaser/ProfileTeaser";
import { SEARCH } from "../../graphql/schemas/queries";
import styles from "../../styles/components/editConnectedProfiles.module.scss";
import { debounce, getRestOfExperts } from "../../utils/index";
import Input from "../input/Input";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import Slider from "../../components/slider/Slider";
import icons from "../../styles/src";

type Data = {
  data: any[];
  onUpdate: (ev: any) => void;
  updateClient: (ev: any) => void;
  filters: any[];
  loading: boolean;
  onClose?: () => void;
};

const EditConnectedProfiles = ({ data, onUpdate, filters, loading, updateClient, onClose }: Data) => {
  const { data: sessionData }: any = useSession();
  const filteredData = data.filter(profile => profile.id != sessionData?.user.user.id);
  const [connectedProfiles, setConnectedProfiles] = useState<any[]>(filteredData);
  const [isOpen, setIsOpen] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);
  const { refetch } = useQuery(SEARCH);

  const onUpdateConnectedProfilesHandler = (action: string, profile: any) => {
    if (action === "remove") {
      let modifiedProfiles = connectedProfiles.filter(
        e => e.firstName !== profile.firstName || e.lastName !== profile.lastName,
      );
      setConnectedProfiles(prev =>
        prev.filter(e => e.firstName !== profile.firstName || e.lastName !== profile.lastName),
      );
      updateClient(modifiedProfiles);
      setExperts(prev => prev.concat(profile));
      onUpdate(modifiedProfiles.map(p => p.id));
      return;
    }

    let modifiedProfiles = connectedProfiles.concat(profile);
    updateClient(modifiedProfiles);
    setConnectedProfiles(modifiedProfiles);
    setExperts(prev => prev.filter(e => e.firstName !== profile.firstName || e.lastName !== profile.lastName));
    onUpdate(modifiedProfiles.map(p => p.id));
  };

  const handleFilters = () => {
    toggleFilters();
  };

  return (
    <div
      className={`${loading && styles.editConnectedProfiles__wrapper__loading} ${
        styles.editConnectedProfiles__wrapper
      }`}
    >
      <div className={styles.editConnectedProfiles__profiles}>
        <ul className={styles.editConnectedProfiles__profiles__mobile}>
          <Slider
            slides={connectedProfiles}
            toRemoveProfile={true}
            onUpdateConnectedProfiles={onUpdateConnectedProfilesHandler}
          />
        </ul>
        {connectedProfiles.length > 0 && (
          <ul className={styles.editConnectedProfiles__profiles__desktop}>
            {connectedProfiles.map((profile, idx) => {
              return (
                <ProfileTeaser
                  toUnfollow
                  profile={profile}
                  key={idx}
                  toRemove={true}
                  onUpdateConnectedProfiles={onUpdateConnectedProfilesHandler}
                  onClose={onClose}
                />
              );
            })}
          </ul>
        )}
      </div>
      {!loading && (
        <Filters
          loading={loading}
          filters={filters}
          reset={() => {
            setExperts([]);
          }}
          update={data => {
            const rest = getRestOfExperts(data.experts, connectedProfiles);
            const excludeMyProfile = rest.filter(p => p.id != sessionData?.user.user.id);
            setExperts(excludeMyProfile);
            setIsOpen(true);
          }}
          setFilterIds={ids => {
            // setActiveFilters([...ids]);
          }}
        />
      )}
      <div className={styles.editConnectedProfiles__search}>
        <button className={`button buttonImage ${styles.search__filters}`} onClick={handleFilters}>
          <Image src={icons.filters} alt="filters" id="connected-profile-id" />
        </button>
        <Input
          label="Neues Profil hinzufügen"
          name=""
          id="tags"
          type="text"
          onClick={() => setIsOpen(true)}
          onChange={e =>
            debounce(async () => {
              const { data: responseData } = await refetch({ search: e.target.value });
              const rest = getRestOfExperts(responseData.experts.experts, connectedProfiles);
              const excludeMyProfile = rest.filter(p => p.id != sessionData?.user.user.id);
              if (e.target.value.trim() === "") {
                setExperts([]);
                return;
              }
              setExperts(excludeMyProfile);
            }, 500)
          }
        />
        {isOpen && experts.length > 0 && (
          <div className={styles.editConnectedProfiles__search__dropdown}>
            <ul>
              {experts.map((expert, idx) => {
                return (
                  <ProfileTeaser
                    key={idx}
                    profile={expert}
                    toUnfollow
                    toAdd={true}
                    onUpdateConnectedProfiles={onUpdateConnectedProfilesHandler}
                    onClose={onClose}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditConnectedProfiles;
