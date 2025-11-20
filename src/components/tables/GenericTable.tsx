import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type SortDirection = "asc" | "desc" | null;

type Column<T> = {
  key?: keyof T;
  label?: string;
  render?: (row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

function GenericTable<T extends object>({ columns, data }: GenericTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: keyof T | undefined) => {
    if (!key) return;

    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col, i) => {
                const label = col.label ?? (col.key ? String(col.key) : "");
                const isSorted = sortKey === col.key;

                return (
                  <TableHead
                    key={col.key ? String(col.key) : `col-${i}`}
                    className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${
                      col.key ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={() => handleSort(col.key)}
                  >
                    {label.toUpperCase()}

                    {col.key && (
                      <span className="ml-1 inline-block text-gray-400">
                        {isSorted ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {sortedData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="even:bg-muted/50 dark:even:bg-white/5">
                {columns.map((col, i) => (
                  <TableCell
                    key={col.key ? String(col.key) : `cell-${i}`}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {col.render ? col.render(row) : col.key ? String(row[col.key]) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default GenericTable;
