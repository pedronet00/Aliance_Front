import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col, i) => (
                <TableHead
                  key={col.key ? String(col.key) : `col-${i}`}
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {(col.label ?? (col.key ? String(col.key) : "")).toUpperCase()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, i) => (
                  <TableCell
                    key={col.key ? String(col.key) : `cell-${i}`}
                    className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    {col.render
                      ? col.render(row)
                      : col.key
                      ? String(row[col.key])
                      : null}
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
