import type { MetaFunction } from 'remix';

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: 'Guitar Tuner',
    description: 'Tune your guitar, in the browser.',
  };
};

export default function Index() {
  return (
    <div className="remix__page">
      <main></main>
    </div>
  );
}
