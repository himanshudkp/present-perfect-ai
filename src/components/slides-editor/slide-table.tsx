"use client";

import { Fragment, memo, useCallback, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { useSlideStore } from "@/store/use-slide-store";
import { cn } from "@/utils";

interface SlideTableProps {
  content: string[][];
  onChange: (newContent: string[][]) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  initialRowSize?: number;
  initialColumnSize?: number;
}

const createEmptyTable = (rows = 2, cols = 2): string[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));

const SlideTable = ({
  content,
  onChange,
  isPreview = false,
  isEditable = true,
  initialRowSize = 2,
  initialColumnSize = 2,
}: SlideTableProps) => {
  const { currentTheme } = useSlideStore();

  const tableData = useMemo(
    () =>
      content.length && content[0]?.length
        ? content
        : createEmptyTable(initialRowSize, initialColumnSize),
    [content, initialRowSize, initialColumnSize]
  );

  const [rowSizes, setRowSizes] = useState<number[]>(() =>
    Array(tableData.length).fill(100 / tableData.length)
  );

  const [columnSizes, setColumnSizes] = useState<number[]>(() =>
    Array(tableData[0].length).fill(100 / tableData[0].length)
  );

  const updateCell = useCallback(
    (row: number, col: number, value: string) => {
      if (!isEditable) return;

      const next = tableData.map((r, rIdx) =>
        rIdx === row ? r.map((c, cIdx) => (cIdx === col ? value : c)) : r
      );

      onChange(next);
    },
    [tableData, onChange, isEditable]
  );

  if (isPreview) {
    return (
      <div className="w-full overflow-auto text-xs">
        <table className="w-full">
          <thead>
            <tr>
              {tableData[0].map((cell, i) => (
                <th
                  key={i}
                  className="p-2 border"
                  style={{ width: `${columnSizes[i]}%` }}
                >
                  {cell || "Type here"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rIdx) => (
              <tr key={rIdx} style={{ height: `${rowSizes[rIdx + 1]}%` }}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 border">
                    {cell || "Type here"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full relative rounded-lg"
      style={{
        background: currentTheme.gradientBgColor || currentTheme.bgColor,
      }}
    >
      <ResizablePanelGroup
        direction="vertical"
        className={cn("h-full w-full border rounded-lg")}
        onLayout={setRowSizes}
      >
        {tableData.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {rowIndex > 0 && <ResizableHandle />}
            <ResizablePanel defaultSize={rowSizes[rowIndex]}>
              <ResizablePanelGroup
                direction="horizontal"
                onLayout={setColumnSizes}
                className="w-full h-full"
              >
                {row.map((cell, colIndex) => (
                  <Fragment key={colIndex}>
                    {colIndex > 0 && <ResizableHandle />}
                    <ResizablePanel
                      defaultSize={columnSizes[colIndex]}
                      className="min-h-9"
                    >
                      <input
                        value={cell}
                        onChange={(e) =>
                          updateCell(rowIndex, colIndex, e.target.value)
                        }
                        readOnly={!isEditable}
                        placeholder="Type here..."
                        className="w-full h-full bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                        style={{ color: currentTheme.fontColor }}
                      />
                    </ResizablePanel>
                  </Fragment>
                ))}
              </ResizablePanelGroup>
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default memo(SlideTable);
