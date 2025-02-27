import styles from "./Button.module.css";

type TButtonProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Button({ children, onClick }: TButtonProps) {
  return (
    <button className={styles.btn} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
