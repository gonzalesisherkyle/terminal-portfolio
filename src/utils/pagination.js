export function paginate(items, page = 1, perPage = 6) {
  const safeItems = Array.isArray(items) ? items : [];
  const totalPages = Math.max(1, Math.ceil(safeItems.length / perPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;

  return {
    items: safeItems.slice(start, start + perPage),
    currentPage,
    totalPages
  };
}
