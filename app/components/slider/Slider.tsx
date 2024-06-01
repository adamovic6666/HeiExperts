import { useRef } from "react";

// Import Swiper React components
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions, PaginationOptions } from "swiper/types";
// import useWindowDimensions from "../../utils/useWindowDimensions";
import "swiper/css";

// Import Swiper styles
import ProfileTeaser from "../../components/profileTeaser/ProfileTeaser";
import styles from "../../styles/components/connectedProfiles.module.scss";

import Image from "next/image";
import "swiper/css";
import icons from "../../styles/src";

const Slider = ({ slides, onFollow, favoritesIds, toRemoveProfile, onUpdateConnectedProfiles }: any) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const paginationRef = useRef(null);

  return (
    <div>
      <Swiper
        speed={500}
        breakpoints={{
          320: {
            slidesPerView: 1.1,
          },
          768: {
            slidesPerView: 2.1,
          },
          1024: {
            slidesPerView: 2,
          },
        }}
        spaceBetween={24}
        pagination={{
          el: paginationRef.current,
          clickable: true,
          renderBullet: (_, className) => `<span class='${className}'></span>`,
        }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
          disabledClass: `${styles.paragraphSlider__arrowPrev_Disabled} disabled`,
        }}
        onInit={({ params, navigation, pagination }) => {
          (params.navigation as NavigationOptions).prevEl = navigationPrevRef.current;
          (params.navigation as NavigationOptions).nextEl = navigationNextRef.current;
          (params.pagination as PaginationOptions).el = paginationRef.current;
          navigation.init();
          pagination.init();
          pagination.render();
          pagination.update();
          navigation.update();
        }}
      >
        {slides.map((profile: any, key: number) => (
          <SwiperSlide key={key}>
            <ProfileTeaser
              toRemove={toRemoveProfile}
              onUpdateConnectedProfiles={onUpdateConnectedProfiles}
              profile={profile}
              onFollow={onFollow}
              favoritesIds={favoritesIds}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 2 && (
        <div className="arrow-prev" ref={navigationPrevRef}>
          <Image src={icons.arrowLeft} alt="arrow-left" />
        </div>
      )}
      {slides.length > 2 && (
        <div className="arrow-next" ref={navigationNextRef}>
          <Image src={icons.arrowRight} alt="arrow-right" />
        </div>
      )}
      <div className="pagination" ref={paginationRef} />
    </div>
  );
};

export default Slider;
