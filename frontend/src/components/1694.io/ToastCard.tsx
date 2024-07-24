import React from 'react';
interface ToastCardProps {
  type: 'warning' | 'info';
  text: string;
}
const ToastCard = ({ type, text }: ToastCardProps) => {
  return (
    <div
      className={`w-inherit flex flex-row items-center gap-10 border-l-8 py-3 ${type === 'warning' ? 'border-l-orange-300' : 'border-l-green-300'}  bg-white`}
    >
      <img
        className="mx-3 lg:mx-7"
        src={`/svgs/toastsvgs/${type === 'warning' ? 'alert-triangle.svg' : 'notes.svg'}`}
        alt="Alert icon"
      />
      <div className="flex flex-col gap-2 text-black">
        <p className="text-xl font-black">
          {type === 'warning' ? 'Warning' : 'Note'}
        </p>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default ToastCard;
