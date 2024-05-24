import React from 'react';
import Button from '../atoms/Button';
import Link from 'next/link';
interface ConversationsCardProps {
  conversations?: GithubComment[];
}
interface GithubComment {
  url: string;
  html_url: string;
  issue_url: string;
  id: number;
  created_at: string;
  updated_at: string;
  body: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
  };
}

const ConversationsCard = ({ conversations }: ConversationsCardProps) => {
  const parseTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="base_container py-20">
      <p className="text-4xl lg:text-6xl font-bold text-zinc-800">Conversations</p>
      <div className="flex flex-col lg:grid grid-cols-3 lg:gap-4 gap-6">
        {/* Only the first six for now. */}
        {conversations &&
          conversations.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className={`grid-item-${index + 1} flex max-h-fit flex-col gap-3`}
            >
              <div className="flex flex-row items-center justify-start gap-5 rounded-full">
                <img
                  src={item.user.avatar_url}
                  alt={item.user.login}
                  width={'25%'}
                  className="rounded-full"
                />
                <p className="text-2xl font-bold">{item.user.login}</p>
              </div>
              <p>{item.body}</p>
              <div>
                <p>{parseTimestamp(item.created_at)}</p>
                <a href={item.html_url} className="font-semibold underline">
                  View on Github
                </a>
              </div>
            </div>
          ))}
      </div>
      <div className="mt-5 flex flex-row items-center justify-center">
        <Button>
          {conversations ? (
            <Link href={conversations[0].html_url}>
              Join The Conversation on Github
            </Link>
          ) : (
            'Loading conversations...'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConversationsCard;
