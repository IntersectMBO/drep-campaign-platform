'use client';

import React from 'react';
import StatusChip from '../atoms/StatusChip';
import {useGetDRepsQuery} from '@/hooks/useGetDRepsQuery';
import {
    convertString,
    formatAsCurrency,
    handleCopyText,
    shortNumber,
} from '@/lib';
import {useScreenDimension} from '@/hooks';
import {Box, IconButton, Skeleton, Tooltip} from '@mui/material';
import Button from '../atoms/Button';
import Link from 'next/link';
import HoverText from '../atoms/HoverText';
import Pagination from './Pagination';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import CopyToClipBoard from '../atoms/svgs/CopyToClipBoardIcon';
import ArrowDownIcon from '../atoms/svgs/ArrowDownIcon';
import ArrowUpIcon from '../atoms/svgs/ArrowUpIcon';
import DatabaseNullIcon from '../atoms/svgs/DatabaseNullIcon';
import CrossIcon from '../atoms/svgs/CrossIcon';

type DRepsTableProps = {
    query?: string;
    page?: number;
    sort?: string;
    order?: string;
    onChainStatus?: string;
    campaignStatus?: string;
    type?: string;
};

export function isActive(latest_epoch_no: number, active_until: number) {
    if (
        typeof latest_epoch_no !== 'number' ||
        typeof active_until !== 'number'
    ) {
        return false;
    }
    return active_until > latest_epoch_no;
}

const DRepsTable = ({
                        query,
                        page,
                        sort,
                        order,
                        onChainStatus,
                        campaignStatus,
                        type,
                    }: DRepsTableProps) => {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const {replace} = useRouter();
    const {isMobile} = useScreenDimension();

    const {DReps, isDRepsLoading, isError} = useGetDRepsQuery(
        query,
        page,
        sort,
        order,
        onChainStatus,
        campaignStatus,
        type,
    );

    // Handle table pagination
    function moveToPage(targetPage: number) {
        const params = new URLSearchParams(searchParams);

        if (page !== targetPage) {
            params.set('page', targetPage.toString());
        }
        replace(`${pathName}?${params.toString()}`);
        window.scrollTo({top: 0, behavior: 'smooth'});
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
                <tr className="overflow-x-auto text-xl font-black text-left bg-white text-nowrap">
                    <th className="px-4 py-2">DRep</th>
                    {/* <th className="px-4 py-2">Drep Id</th> */}
                    <th className="px-4 py-2">
                        <div className="flex items-center">
                            <span>Voting Power</span>
                            {sort === 'voting_power' &&
                                (order === 'desc' ? (
                                    <ArrowDownIcon width={20} height={20} color="black"/>
                                ) : (
                                    order === 'asc' && (
                                        <ArrowUpIcon width={20} height={20} color="black"/>
                                    )
                                ))}
                        </div>
                    </th>
                    {/* <th className="px-4 py-2">
              <div className="flex items-center">
                <span>Live Stake</span>
                {sort === 'live_power' &&
                  (order === 'desc' ? (
                    <ArrowDownIcon width={20} height={20} color="black" />
                  ) : (
                    order === 'asc' && (
                      <ArrowUpIcon width={20} height={20} color="black" />
                    )
                  ))}
              </div>
            </th> */}
                    <th className="px-4 py-2">
                        <div className="flex items-center">
                            <span>Delegators</span>
                            {sort === 'delegators' &&
                                (order === 'desc' ? (
                                    <ArrowDownIcon width={20} height={20} color="black"/>
                                ) : (
                                    order === 'asc' && (
                                        <ArrowUpIcon width={20} height={20} color="black"/>
                                    )
                                ))}
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {isDRepsLoading ? (
                    <tr>
                        <td colSpan={24} className="px-4 py-2 text-center">
                            {Array.from({length: 24}).map((_, index) => (
                                <Skeleton height={45} key={index}/>
                            ))}
                        </td>
                    </tr>
                ) : DReps?.data && DReps?.data.length > 0 ? (
                    DReps.data.map((drep) => (
                        <tr
                            key={drep.drep_hash_id}
                            data-testid={`drep-id-${drep.view}`}
                            className="text-sm text-left text-nowrap"
                        >
                            <td className="px-4 py-2">
                                <Box className='flex flex-row items-center gap-3'>
                                    {drep?.type === 'voting_option' ||
                                    drep?.type === 'scripted' ? (
                                        <Link
                                            className="flex items-center gap-4"
                                            href={`/dreps/${drep?.view}`}
                                            prefetch={false}
                                        >
                                            <p className="font-medium uppercase hover:font-semibold">
                                                {drep?.type === 'scripted'
                                                    ? ''
                                                    : drep?.view.replace('drep_', '')}
                                            </p>
                                        </Link>
                                    ) : drep?.drep_id ? (
                                        <Link
                                            className="flex items-center gap-4"
                                            href={`/dreps/${drep?.view}`}
                                            prefetch={false}
                                        >
                                            <Button size="extraSmall" width={4}>
                                                View
                                            </Button>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={`/dreps/workflow/profile/new`}
                                                prefetch={false}
                                            >
                                                <Button size="extraSmall" width={4}>
                                                    Claim
                                                </Button>
                                            </Link>
                                        </div>
                                    )}

                                    <Box className='flex items-center flex-nowrap'>
                                        <Tooltip title="Copy DRep ID">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCopyText(drep.view)}
                                            >
                                                <CopyToClipBoard width={18} height={18}/>
                                            </IconButton>
                                        </Tooltip>

                                        <Link href={`/dreps/${drep.view}`} prefetch={false}>
                                            <p className="hover:font-semibold">
                                                {convertString(drep.view, isMobile)}
                                            </p>
                                        </Link>
                                    </Box>

                                    <Box className='w-30 flex flex-row items-center gap-1.5'>
                                        {drep.given_name !== null && <Tooltip title="DRep given name">
                                            <Link
                                                className='inline-flex'
                                                href={`/dreps/${drep?.view}`}
                                                prefetch={false}
                                            >
                                                <span className='border text-xs border-black rounded-xl font-black inline-block px-1.5 py-0.5 text-black text-ellipsis overflow-hidden'>
                                                    {drep.given_name}
                                                </span>
                                            </Link>
                                        </Tooltip>}

                                        <Tooltip title="DRep onchain status" disableFocusListener>
                                            <button className='hover:cursor-default'>
                                                <StatusChip
                                                    status={
                                                        drep.active ? 'Active' : 'Inactive'
                                                    }
                                                />
                                            </button>
                                        </Tooltip>
                                    </Box>

                                    <Box className='w-30 flex flex-row gap-1 text-ellipsis overflow-hidden'>
                                        {drep.type === 'scripted' && (
                                            <StatusChip status='Scripted' />
                                        )}
                                    </Box>
                                </Box>
                            </td>

                            <td className="px-4 py-2 overflow-auto max-w-11">
                                {drep.voting_power !== null ? (
                                    <HoverText
                                        shortText={shortNumber(drep.voting_power, 2)}
                                        longText={formatAsCurrency(drep.voting_power)}
                                    />
                                ) : (
                                    <p>-</p>
                                )}
                            </td>

                            {/* <td className="px-4 py-2 overflow-auto max-w-11">
                  {drep.live_power !== null ? (
                    <HoverText
                      shortText={shortNumber(drep.live_power, 2)}
                      longText={formatAsCurrency(drep.live_power)}
                    />
                  ) : (
                    <p>-</p>
                  )}
                </td> */}

                            <td className="px-4 py-2">
                                <p className="text-center">{drep.delegation_vote_count}</p>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={10} className="px-4 py-6 text-center">
                            {!isError && (
                                <div className="flex flex-col items-center justify-center">
                                    <div
                                        className="flex flex-col items-center w-full p-12 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
                                        <DatabaseNullIcon width={60} height={50}/>
                                        <span className="block mt-2 text-sm font-semibold text-gray-500">
                                            No DReps to show for now...
                                        </span>
                                    </div>
                                </div>
                            )}
                            {isError && (
                                <div className="mx-auto">
                                    <div className="border-l-8 border-red-700 bg-red-50">
                                        <div className="flex items-center">
                                            <div className="p-2">
                                                <div className="flex items-center">
                                                    <div className="ml-2">
                                                        <CrossIcon
                                                            color="#b91c1c"
                                                            width={30}
                                                            height={30}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col py-4">
                                                        <p className="px-3 text-lg font-bold text-left text-red-700">
                                                            Opps!!!
                                                        </p>
                                                        <p className="px-3 text-sm font-semibold text-red-700">
                                                            An error occurred while fetching the data.
                                                            Please refresh the page or try again later
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {!isDRepsLoading && DReps?.data && DReps?.data.length > 0 && (
                <Box className="flex justify-end mt-6">
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
