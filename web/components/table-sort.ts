export type TableSortDirection = "asc" | "desc";

export type TableSortState<Key extends string> = {
  key: Key;
  direction: TableSortDirection;
};

export function toggleTableSort<Key extends string>(
  current: TableSortState<Key>,
  key: Key,
): TableSortState<Key> {
  if (current.key === key) {
    return {
      key,
      direction: current.direction === "asc" ? "desc" : "asc",
    };
  }

  return {
    key,
    direction: "asc",
  };
}

function comparePrimitive(left: string | number, right: string | number) {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortTableRows<Row, Key extends string>(
  rows: Row[],
  sort: TableSortState<Key>,
  getValue: (row: Row, key: Key) => string | number,
) {
  return [...rows].sort((left, right) => {
    const primary = comparePrimitive(getValue(left, sort.key), getValue(right, sort.key));
    if (primary !== 0) {
      return sort.direction === "asc" ? primary : -primary;
    }

    const fallback = comparePrimitive(getValue(left, "name" as Key), getValue(right, "name" as Key));
    return sort.direction === "asc" ? fallback : -fallback;
  });
}
