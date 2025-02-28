import styles from "./Button.module.css";

type TButtonProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Button({ children, style, onClick }: TButtonProps) {
  return (
    <button style={style} className={styles.btn} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
