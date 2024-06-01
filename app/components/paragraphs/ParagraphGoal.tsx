import Image from "next/image";
import styles from "../../styles/components/paragraphs.module.scss";

const ParagraphGoal = ({ commonGoal }: any) => {
  const { items, title } = commonGoal;
  return (
    <div className={styles.paragraphGoal}>
      <div>
        <h2>{title}</h2>
        <div>
          {items.map(({ title, body, logo }: any) => {
            return (
              <div key={`COMMONGOAL_ITEMS_${title}`}>
                <div>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${logo.url}`}
                    alt={logo.name}
                    width={40}
                    height={40}
                  />
                </div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            );
          })}
        </div>
        <div className={styles.paragraphGoal__corner}></div>
      </div>
    </div>
  );
};

export default ParagraphGoal;
