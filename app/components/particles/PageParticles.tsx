import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const PageParticles = ({ className, id }: any) => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const isMobile = () => {
    return typeof window !== "undefined" && window.innerWidth < 1024;
  };

  return (
    <Particles
      className={className}
      id={id}
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: {
            value: isMobile() ? 10 : 40,
            density: {
              enable: false,
              value_area: isMobile() ? 1000 : 1200,
            },
          },
          color: {
            value: "#ffffff",
          },
          shape: {
            type: "dot",
          },
          opacity: {
            value: 0.8,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: isMobile() ? 3 : 4,
            random: false,
            anim: {
              enable: false,
              speed: isMobile() ? 20 : 40,
              size_min: 0.1,
              sync: false,
            },
          },
          rotate: {
            value: 0,
            random: true,
            direction: "clockwise",
            animation: {
              enable: true,
              speed: 5,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 600,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: ["grab"],
            },
            onclick: {
              enable: false,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: false,
        background: {
          image: "",
          position: "50% 50%",
          repeat: "no-repeat",
          size: "cover",
        },
      }}
    />
  );
};

export default PageParticles;
