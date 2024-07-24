import React from 'react';
import MenuDropDown from '../atoms/MenuDropDown';

export default function DRepMenu() {
  const menuItems = [
    {
      label: 'DReps',
      text: 'Learn about Cardano’s revised on-chain governance system.',
      to: '/dreps',
    },
    {
      label: 'DRep List',
      text: 'Delegate your voting power or become a DRep.',
      to: '/dreps/list',
    },
    // {
    //   label: 'DRep Notes',
    //   text: 'Check out notes written by DReps in the Cardano community.',
    //   to: '/dreps/notes',
    // },
  ];

  return <MenuDropDown title="DReps" menuItems={menuItems} />;
}
