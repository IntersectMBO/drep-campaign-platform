import { useScreenDimension } from '@/hooks';
import {
  convertString,
  formatAsCurrency,
  formattedAda,
  handleCopyText,
  lovelaceToAda,
} from '@/lib';
import React, { useEffect, useState } from 'react';
import HoverText from './HoverText';
import { useGetDrepDelegators } from '@/hooks/useGetDrepDelegatorsQuery';
import { Box, IconButton, Skeleton, Tooltip } from '@mui/material';
import Pagination from '../molecules/Pagination';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ListSort from '../molecules/ListSort';
import CopyToClipBoardIcon from './svgs/CopyToClipBoardIcon';
import ArrowDownIcon from './svgs/ArrowDownIcon';
import ArrowUpIcon from './svgs/ArrowUpIcon';

const ViewProfileAction = ({ toStakeKey }: { toStakeKey: string }) => {
  return (
    <Link prefetch={false} href={toStakeKey ? `/voters/${toStakeKey}` : '#'}>
      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm">
        <img src="/svgs/eye.svg" alt="View Profile" />
        <p>View Profile</p>
      </div>
    </Link>
  );
};

const DrepDelegatorslist = ({ voterId }: { voterId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(undefined);
  const [order, setOrder] = useState(undefined);
  const { isMobile, screenWidth } = useScreenDimension();
  const searchParams = useSearchParams();

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('page') || 1));
    setSort(searchParams.get('sort') || null);
    setOrder(searchParams.get('order') || null);
  }, [searchParams]);

  const { Delegators, isDelegatorsLoading } = useGetDrepDelegators(
    voterId,
    currentPage,
    null,
    sort,
    order,
  );

  return (
    <div className="flex flex-col overflow-x-auto">
      <div className="mb-4 flex items-center">
        <p className="text-3xl font-bold">Delegators</p>
        <div className="flex w-full justify-end">
          <ListSort
            tableType="Delegators"
            sortOptions={[
              {
                category: 'Voting Power',
                options: [
                  { label: 'Highest to Lowest', value: 'power-desc' },
                  { label: 'Lowest to Highest', value: 'power-asc' },
                ],
              },
              {
                category: 'Epoch',
                options: [
                  { label: 'Highest to Lowest', value: 'epoch-desc' },
                  { label: 'Lowest to Highest', value: 'epoch-asc' },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded">
        <table className="w-full text-left rtl:text-right">
          <thead className="mb-2 whitespace-nowrap bg-gray-50 text-xl">
            <tr>
              <th scope="col" className="px-6 py-3">
                Stake Address
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  <span>Voting Power</span>
                  {sort === 'power' &&
                    (order === 'desc' ? (
                      <ArrowDownIcon width={20} height={20} color="black" />
                    ) : (
                      order === 'asc' && (
                        <ArrowUpIcon width={20} height={20} color="black" />
                      )
                    ))}
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  <span>Epoch</span>
                  {sort === 'epoch' &&
                    (order === 'desc' ? (
                      <ArrowDownIcon width={20} height={20} color="black" />
                    ) : (
                      order === 'asc' && (
                        <ArrowUpIcon width={20} height={20} color="black" />
                      )
                    ))}
                </div>
              </th>
              <th scope="col" className="py-3 pl-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isDelegatorsLoading && (
              <tr>
                <td colSpan={24}>
                  {Array.from({ length: 24 }).map((_, index) => (
                    <Skeleton height={60} key={index} />
                  ))}
                </td>
              </tr>
            )}
            {!isDelegatorsLoading &&
              Delegators?.data?.length > 0 &&
              Delegators?.data.map((delegator) => (
                <tr
                  key={delegator.stakeAddress}
                  className="text-nowrap border-b-2 bg-white hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    <div className="group flex items-center">
                      <Link
                        prefetch={false}
                        href={
                          delegator?.stakeAddress
                            ? `/voters/${delegator?.stakeAddress}`
                            : '#'
                        }
                        className="shrink-0"
                      >
                        {convertString(
                          delegator?.stakeAddress,
                          isMobile || screenWidth < 1024,
                        )}
                      </Link>
                      <div className="invisible group-hover:visible">
                        <Tooltip title="Copy stake address">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCopyText(delegator?.stakeAddress)
                            }
                          >
                            <CopyToClipBoardIcon width={17} height={17} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <HoverText
                      shortText={formattedAda(delegator?.votingPower, 2)}
                      longText={formatAsCurrency(
                        lovelaceToAda(delegator?.votingPower),
                      )}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {' '}
                    <p> {delegator?.delegationEpoch}</p>
                  </td>
                  <td className="min-w-44 py-4 pl-6">
                    <ViewProfileAction toStakeKey={delegator.stakeAddress} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!isDelegatorsLoading &&
        Delegators?.data &&
        Delegators?.data.length > 0 && (
          <Box className="mt-6 flex justify-end">
            <Pagination
              currentPage={Delegators.currentPage}
              totalPages={Delegators.totalPages}
              totalItems={Delegators.totalItems}
              dataType="Delegators"
            />
          </Box>
        )}
    </div>
  );
};

export default DrepDelegatorslist;
