export default function Pagination({ currentPage, totalPages, onPrev, onNext, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center gap-2 mt-4 font-mono text-xs" aria-label="Pagination">
      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-term-border px-3 py-2 text-term-cyan hover:border-term-green hover:text-term-green disabled:text-term-dim disabled:hover:border-term-border"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        :prev
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border px-3 py-2 ${
            page === currentPage
              ? 'border-term-green text-term-green bg-term-green/[0.06]'
              : 'border-term-border text-term-dim hover:border-term-green hover:text-term-green'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border border-term-border px-3 py-2 text-term-cyan hover:border-term-green hover:text-term-green disabled:text-term-dim disabled:hover:border-term-border"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        :next
      </button>
    </nav>
  );
}
