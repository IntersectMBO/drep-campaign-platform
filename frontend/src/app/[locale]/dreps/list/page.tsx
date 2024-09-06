import DRepTableSearch from '@/components/atoms/DRepTableSearch';
import DRepsTable from '@/components/molecules/DRepsTable';
import React from 'react';

type PageProps = {
  searchParams?: {
    s?: string;
    page?: string;
    sortBy?: string;
    order?: string;
  };
};
const page = ({ searchParams }: PageProps) => {
  const query = searchParams?.s || '';
  const page = Number(searchParams?.page) || 1;
  const sortBy = searchParams?.sortBy || null;
  const order = searchParams?.order || null;

  return (
    <div className="base_container py-10">
      <section className="mb-12">
        <h2 className="text-7xl font-black">Available DReps</h2>
      </section>
      <section className="mb-10 flex justify-end">
        <DRepTableSearch />
      </section>

      <section className="rounded-md bg-white p-5 shadow">
        <DRepsTable query={query} page={page} sortBy={sortBy} order={order} />
      </section>
    </div>
  );
};

export default page;
