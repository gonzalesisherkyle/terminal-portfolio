import { useMemo, useState } from 'react';
import { paginate } from '../utils/pagination';

export function usePagination(items, perPage = 6) {
  const [page, setPage] = useState(1);
  const result = useMemo(() => paginate(items, page, perPage), [items, page, perPage]);

  const goToPage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, result.totalPages)));
  };

  const nextPage = () => {
    setPage((current) => Math.min(current + 1, result.totalPages));
  };

  const prevPage = () => {
    setPage((current) => Math.max(current - 1, 1));
  };

  return {
    ...result,
    goToPage,
    nextPage,
    prevPage
  };
}
