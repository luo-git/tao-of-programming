import * as React from 'react';
import { trpc } from '../utils/trpc';
import './home.css';
import Quote from '../components/Quote';
import NavBar from '../components/NavBar';

export default function Home() {
  const latestQuote = trpc.quotes.getFirst.useQuery();
  const setting = trpc.setting.get.useQuery();
  const createQuote = trpc.generator.create.useMutation();

  async function handleCreateNew() {
    await createQuote.mutate(undefined, {
      onSuccess: () => {
        setting.refetch();
        latestQuote.refetch();
      },
    });
  }

  return (
    <div>
      {/* Nav Bar */}
      <NavBar>
        <button
          disabled={createQuote.isLoading || latestQuote.isLoading}
          className="navbar-button"
          onClick={handleCreateNew}
        >
          Generate New (Limit: {setting.data?.currentCount} /{' '}
          {setting.data?.dailyLimit})
        </button>
      </NavBar>

      {/* Main content */}
      <section className="main-content rounded-font">
        <div className="main-content-background" />
        {!createQuote.isLoading &&
        !latestQuote.isLoading &&
        latestQuote.data ? (
          <Quote
            quote={latestQuote.data.content}
            tags={latestQuote.data.tags}
          />
        ) : (
          <div className="quote-loading">
            Retrieving teaching from master programmer
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </section>
    </div>
  );
}
