import { SortOrder } from "../../models/models";

export function clone<T>(obj: T): T {
  let cloned: T = JSON.parse(JSON.stringify(obj));
  return cloned;
}

export function ifContainsList<T>(toVerify: T[], list: T[]): boolean {
  if (!list.length) {
    if (!toVerify.length) {
      return true;
    } else {
      return false;
    }
  }
  for (let obj of list) {
    if (!toVerify.includes(obj)) {
      return false;
    }
  }
  return true;
}

export function sortByField<T>(sortBy: keyof T, sortOrder: SortOrder): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    var result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;
    return result * sortOrder;
  };
}
