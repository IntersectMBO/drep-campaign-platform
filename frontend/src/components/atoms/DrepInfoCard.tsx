import React from 'react';
import Button from "@/components/atoms/Button";
import Link from "next/link";

interface  DrepInfoCardProps {
    img: string;
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
    };
}

const DrepInfoCard = ({img, title, description, action = null}: DrepInfoCardProps) => {
    return (
        <div
            className="flex h-full flex-1 w-full flex-col items-start rounded-lg bg-blue-800 p-5 shadow-lg">
            <img src={img} alt={title} width={'60px'} className="mb-3"/>
            <p className="mb-3 text-lg font-extrabold">{title}</p>
            <p className="text-sm font-extralight">{description}</p>

            {!!action &&
                <div className="mt-auto pt-4">
                    <Button sx={{width: 'fit-content'}} variant="contained">
                        <Link href={action.href}>
                            {action.label}
                        </Link>
                    </Button>
                </div>
            }
        </div>
    );
};

export default DrepInfoCard;
