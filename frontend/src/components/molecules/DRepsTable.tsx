'use client';

import React from 'react';
import StatusChip from '../atoms/StatusChip';
import { useGetDRepsQuery } from '@/hooks/useGetDRepsQuery';
import { convertString, formatAsCurrency, shortNumber } from '@/lib';
import { useScreenDimension } from '@/hooks';
import { Box, IconButton, Skeleton, Tooltip } from '@mui/material';
import Button from '../atoms/Button';
import Link from 'next/link';
import HoverText from '../atoms/HoverText';
import Pagination from './Pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CopyToClipBoard from '../atoms/svgs/CopyToClipBoard';

type DRepsTableProps = {
  query?: string;
  page?: number;
  sortBy?: string;
  order?: string;
};

const DRepsTable = ({ query, page, sortBy, order }: DRepsTableProps) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();
  const { isMobile } = useScreenDimension();

  const { DReps, isDRepsLoading } = useGetDRepsQuery(
    query,
    page,
    sortBy,
    order,
  );

  function isActive(epoch_no: number, active_until: number) {
    return active_until > epoch_no;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Handle table pagination
  function moveToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams);

    if (page !== targetPage) {
      params.set('page', targetPage.toString());
    }
    replace(`${pathName}?${params.toString()}`);
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
    <div className="flex flex-col overflow-x-auto">
      <table className="min-w-full">
        <thead className="mb-2">
          <tr className="overflow-x-auto text-nowrap bg-white text-left text-xl font-black">
            <th className="px-4 py-2">Campaign</th>

            <th className="px-4 py-2">Drep Id</th>
            {/*<th className="px-4 py-2">Epoch</th>*/}

            <th className="px-4 py-2">Live Power</th>
            {/*<th className="px-4 py-2">Live Power</th>*/}
            <th className="px-4 py-2 text-center">Delegators</th>
            <th className="px-4 py-2 text-center">Status</th>
            {/*<th colSpan={3} className="px-4 py-2">*/}
            {/*  Actions*/}
            {/*</th>*/}
          </tr>
        </thead>
        <tbody>
          {isDRepsLoading ? (
            <tr>
              <td colSpan={24} className="text-center">
                {Array.from({ length: 24 }).map((_, index) => (
                  <Skeleton height={40} key={index} />
                ))}
              </td>
            </tr>
          ) : DReps.data && DReps.data.length > 0 ? (
            DReps.data.map((drep) => (
              <tr
                key={drep.drep_hash_id}
                data-testid={`drep-id-${drep.view}`}
                className="text-nowrap text-left text-sm"
              >
                <td className="px-4 py-2">
                  {!!drep.drep_id ? (
                    <Box className="flex items-center gap-4">
                      <Link href={`/dreps/${drep.view}`}>
                        <Button size="extraSmall" width={4}>
                          View
                        </Button>
                      </Link>
                      <p className="font-medium">{drep.drep_name}</p>
                    </Box>
                  ) : (
                    <Box className="flex items-center gap-4">
                      <Link href={`/dreps/workflow/profile/new`}>
                        <Button size="extraSmall" width={4}>
                          Claim
                        </Button>
                      </Link>
                      <p className="font-medium">unclaimed</p>
                    </Box>
                  )}
                </td>

                <td className="flex items-center justify-between px-4 py-2">
                  <Link href={`/dreps/${drep.view}`}>
                    <p className="hover:font-semibold">
                      {convertString(drep.view, isMobile)}
                    </p>
                  </Link>
                  <Box className="flex w-full justify-end pr-6">
                    <Tooltip title="Copy DRep ID">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(drep.view)}
                      >
                        <CopyToClipBoard width={22} height={22} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </td>

                {/*epoch_no*/}
                {/*<td className="px-4 py-2">{drep.epoch_no}</td>*/}

                {/*Campaign Status*/}
                {/*<td className="px-4 py-2">*/}
                {/*  <StatusChip status={statusChecker(drep.deposit)} />*/}
                {/*</td>*/}

                {/*active voting power*/}
                <td className="max-w-11 overflow-auto px-4 py-2">
                  <HoverText
                    shortText={shortNumber(drep.amount, 2)}
                    longText={formatAsCurrency(drep.amount)}
                  />
                </td>

                {/*upcoming voting power*/}
                {/*<td className="px-4 py-2">₳ {drep.amount}</td>*/}

                {/*delegators*/}
                <td className="px-4 py-2">
                  <p className="text-center">{drep.delegation_vote_count}</p>
                </td>

                {/*Drep status*/}
                <td className="px-4 py-2">
                  <StatusChip
                    status={
                      isActive(drep.epoch_no, drep.active_until)
                        ? 'Active'
                        : 'Inactive'
                    }
                  />
                </td>

                {/*actions*/}
                {/*<td className="px-4 py-2">*/}
                {/*  <div className="flex space-x-2">*/}
                {/*    <HoverChip*/}
                {/*      text="View Profile"*/}
                {/*      handleClick={() => router.push(`/dreps/${drep.view}`)}*/}
                {/*    >*/}
                {/*      <img src="/svgs/link.svg" alt="" />*/}
                {/*    </HoverChip>*/}
                {/*    <HoverChip*/}
                {/*      text="Link DRep"*/}
                {/*      handleClick={*/}
                {/*        () => console.log('linking drep', drep.view)*/}
                {/*        // router.push(`/drep/${drep.id}`)*/}
                {/*      }*/}
                {/*    >*/}
                {/*      <img src="/svgs/user-circle.svg" alt="" />*/}
                {/*    </HoverChip>*/}
                {/*    <HoverChip*/}
                {/*      text="Claim DRep Profile"*/}
                {/*      handleClick={() => router.push(`/dreps/${drep.view}`)}*/}
                {/*    >*/}
                {/*      <img src="/svgs/medal.svg" alt="" />*/}
                {/*    </HoverChip>*/}
                {/*  </div>*/}
                {/*</td>*/}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">
                No DReps to show for now...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!isDRepsLoading && (
        <Box className="mt-6 flex justify-end">
          <Pagination
            currentPage={DReps.currentPage}
            totalPages={DReps.totalPages}
            totalItems={DReps.totalItems}
            moveToFirstPage={moveToFirstPage}
            moveToLastPage={moveToLastPage}
            moveToPreviousPage={moveToPreviousPage}
            moveToNextPage={moveToNextPage}
          />
        </Box>
      )}
    </div>
  );
};

export default DRepsTable;
