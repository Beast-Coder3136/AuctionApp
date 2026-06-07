import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { getPageNumbers } from "@/lib/helperFunction";

export default function PaginationComponent({totalPages,currentPage, setCurrentPage }){
  return(
          <Pagination className="mt-8">
        <PaginationContent>
          {getPageNumbers(totalPages,currentPage).map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

        </PaginationContent>
      </Pagination>
  )
} 