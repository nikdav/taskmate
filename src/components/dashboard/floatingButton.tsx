import { faBars, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FloatingButtonProps = {
  setSmallWidth: (smallWidth: boolean) => void;
  smallWidth: boolean;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  setSmallWidth,
  smallWidth,
}) => {
  return (
    <div className="fixed right-5 bottom-5 rounded-full bg-daccent p-2 shadow-xl">
      <button
        className="h-10 w-10 p-2"
        onClick={() => setSmallWidth(!smallWidth)}
      >
        <FontAwesomeIcon
          icon={smallWidth ? faTableCellsLarge : faBars}
          size="lg"
        />
      </button>
    </div>
  );
};

export default FloatingButton;