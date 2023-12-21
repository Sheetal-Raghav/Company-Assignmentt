import { useEffect, useState } from "react";

const Popup = (props) => {
  const [show, setShow] = useState(false);

  const closeHandler = (e) => {
    setShow(false);
    props.onClose(false);
  };

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  return (
    <div
      className={`overlay ${show ? "visible opacity-100" : "invisible opacity-0"}`}
      onClick={closeHandler}
    >
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeHandler}>
          &times;
        </span>
        <div className="content">{props.children}</div>
      </div>
    </div>
  );
};

export default Popup;
