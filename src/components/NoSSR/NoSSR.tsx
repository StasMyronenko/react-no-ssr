import React, { useEffect, useState } from "react";
import { useNoSSRContext } from "../../contexts/NoSSRContext";

interface INoSsr {
  children: React.JSX.Element;
  fallback?: any;
  shouldShow?: () => boolean;
  id?: number | string;
  weight?: number | null;
  priority?: number;
}

const NoSsr: React.FC<INoSsr> = ({
  children,
  fallback = <></>,
  shouldShow = () => true,
  id,
  weight = null,
  priority,
}) => {
  const [show, setShow] = useState(false);
  const { addTask } = useNoSSRContext();

  useEffect(() => {
    if (!shouldShow()) {
      return;
    }
    addTask({
      action: () => {
        setShow(true);
      },
      id,
      weight,
      priority,
    });
  }, [children]);

  return show ? children : fallback;
};

export default NoSsr;
