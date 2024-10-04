import DRepTableSearch from '@/components/atoms/DRepTableSearch';
import DRepsTable from '@/components/molecules/DRepsTable';
import React from 'react';

type PageProps = {
  searchParams?: {
    s?: string;
    page?: string;
    sort?: string;
    order?: string;
    on_chain?: string;
    include_retired?: string;
    campaign?: string;
    type?: string;
  };
};
const page = ({ searchParams }: PageProps) => {
  const query = searchParams?.s || '';
  const page = Number(searchParams?.page) || 1;
  const sort = searchParams?.sort || null;
  const order = searchParams?.order || null;
  const onChainStatus = searchParams?.on_chain || null;
  const includeRetired = searchParams?.include_retired || null;
  const campaignStatus = searchParams?.campaign || null;
  const type = searchParams?.type || null;

  return (
    <div className="base_container min-h-screen py-10">
      <section className="mb-12">
        <h2 className="text-7xl font-black">Available DReps</h2>
      </section>
      <section className="mb-10 flex justify-end">
        <DRepTableSearch />
      </section>

      <section className="rounded-md bg-white p-5 shadow">
        <DRepsTable
          query={query}
          page={page}
          sort={sort}
          order={order}
          onChainStatus={onChainStatus}
          campaignStatus={campaignStatus}
          includeRetired={includeRetired}
          type={type}
        />
      </section>
    </div>
  );
};

export default page;
