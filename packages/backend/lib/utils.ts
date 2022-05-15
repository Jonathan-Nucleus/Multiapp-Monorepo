interface SearchStage {
  autocomplete: {
    path: string;
    query: string;
  };
  index?: string;
}

export const createSearchStage = (
  field: string,
  search: string,
  index?: string
): SearchStage | null => {
  const query = search.trim().replace(/\s\s+/g, " ");
  if (!query) {
    return null;
  }

  const stage: SearchStage = {
    autocomplete: {
      path: field,
      query,
    },
  };

  if (index) {
    stage.index = index;
  }

  return stage;
};
