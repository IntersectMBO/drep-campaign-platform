import { Box, Skeleton } from '@mui/material';
import React from 'react';
import ChevronsRightIcon from '../atoms/svgs/ChevronsRightIcon';
import ChevronRightIcon from '../atoms/svgs/ChevronRightIcon';
import ChevronLeftIcon from '../atoms/svgs/ChevronLeftIcon';
import ChevronsLeftIcon from '../atoms/svgs/ChevronsLeftIcon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  dataType: string;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  dataType
}: PaginationProps) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;

  function moveToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams);

    if (currentPage !== targetPage) {
      params.set('page', targetPage.toString());
    }
    replace(`${pathName}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function moveToFirstPage(firstPage: number) {
    moveToPage(firstPage);
  }

  function moveToLastPage(lastPage: number) {
    moveToPage(lastPage);
  }

  function moveToPreviousPage(previousPage: number) {
    moveToPage(previousPage);
  }

  function moveToNextPage(nextPage: number) {
    moveToPage(nextPage);
  }

  return (
    <>
      {!totalItems && totalPages && currentPage ? (
        <Box className="flex flex-col gap-1">
          <Skeleton variant="rounded" height={45} width={290} />
          <Box className="flex justify-end">
            <Skeleton variant="rounded" height={20} width={80} />
          </Box>
        </Box>
      ) : (
        <Box className="flex flex-col items-end space-y-2">
          <Box className="flex items-center rounded-lg bg-gray-800 px-1 py-1">
            <Box
              className={`flex items-center space-x-1 rounded-lg px-2 py-1 ${isFirstPage ? 'pointer-events-none text-destructive-300' : 'cursor-pointer text-bar_back hover:bg-primary-300'}`}
              onClick={() => moveToFirstPage(1)}
            >
              <ChevronsLeftIcon
                color={isFirstPage ? '#73828c' : 'white'}
                width={22}
              />
              <span className="text-xs font-medium">First</span>
            </Box>
            <Box
              className={`flex items-center rounded-lg px-2 py-1 ${isFirstPage ? 'pointer-events-none' : 'cursor-pointer hover:bg-primary-300'}`}
              onClick={() =>
                currentPage > 1 && moveToPreviousPage(currentPage - 1)
              }
            >
              <ChevronLeftIcon
                color={isFirstPage ? '#73828c' : 'white'}
                width={22}
                height={23}
              />
            </Box>
            <Box className="cursor-default rounded-lg bg-primary-300 px-3  py-2 text-xs font-medium text-bar_back sm:mx-3">
              <span>Page {currentPage}</span>
            </Box>
            <Box
              className={`flex items-center rounded-lg px-2 py-1 ${isLastPage ? 'pointer-events-none' : 'cursor-pointer hover:bg-primary-300'}`}
              onClick={() =>
                currentPage < totalPages && moveToNextPage(currentPage + 1)
              }
            >
              <ChevronRightIcon
                color={isLastPage ? '#73828c' : 'white'}
                width={22}
                height={23}
              />
            </Box>
            <Box
              className={`flex items-center space-x-1 rounded-lg px-2 py-1 ${
                isLastPage
                  ? 'pointer-events-none text-destructive-300'
                  : 'cursor-pointer text-bar_back hover:bg-primary-300'
              }`}
              onClick={() => moveToLastPage(totalPages)}
            >
              <span className="text-xs font-medium">Last</span>
              <ChevronsRightIcon
                color={isLastPage ? '#73828c' : 'white'}
                width={22}
              />
            </Box>
          </Box>
          <span className="textColor2 mr-2 text-sm">
            Total {dataType}: {totalItems}
          </span>
        </Box>
      )}
    </>
  );
};

export default Pagination;
