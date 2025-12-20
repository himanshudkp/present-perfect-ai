"use client";

import {
  type ChangeEvent,
  type KeyboardEvent,
  memo,
  useCallback,
  useMemo,
} from "react";
import { Input } from "../ui/input";

interface ListItemProps {
  item: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
  isEditable: boolean | undefined;
  fontColor: string;
}

export const ListItem = memo(
  ({
    fontColor,
    index,
    isEditable,
    item,
    onChange,
    onKeyDown,
  }: ListItemProps) => {
    const style = useMemo(() => {
      return { color: fontColor };
    }, [fontColor]);

    const handleOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => onChange(index, e.target.value),
      [onChange]
    );

    const handleOnKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => onKeyDown(e, index),
      [onKeyDown]
    );

    return (
      <Input
        type="text"
        value={item}
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        className="bg-transparent outline-none py-"
        style={style}
        readOnly={!isEditable}
      ></Input>
    );
  }
);
