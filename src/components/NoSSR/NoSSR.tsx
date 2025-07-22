import React, { useEffect, useState } from "react";
import { useNoSSRContext } from "../../contexts/NoSSRContext";

interface INoSsr {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** additional checker if needed */
  shouldShow?: () => boolean;
  /** task id */
  id?: number | string;
  /** task weight */
  weight?: number | null;
  /** task priority level. min - __0__, max - __priorityLevels - 1__  */
  priority?: number;
}

export const NoSSR: React.FC<INoSsr> = ({
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
