type CategoryWithChildren = {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  children: { id: string; name: string; order: number }[];
};

export type CategoryOption = {
  id: string;
  label: string;
};

export function buildCategoryOptions(categories: CategoryWithChildren[]): CategoryOption[] {
  const topLevel = categories
    .filter((category) => category.parentId === null)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const options: CategoryOption[] = [];
  for (const parent of topLevel) {
    options.push({ id: parent.id, label: parent.name });
    const children = [...parent.children].sort(
      (a, b) => a.order - b.order || a.name.localeCompare(b.name)
    );
    for (const child of children) {
      options.push({ id: child.id, label: `${parent.name} / ${child.name}` });
    }
  }

  return options;
}
