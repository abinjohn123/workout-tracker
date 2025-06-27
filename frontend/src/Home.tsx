import Header from './components/Header';
import { getGreeting } from './utils';
import DatePill from './components/DatePill';
import { Link } from 'react-router-dom';
import { ROUTES } from './routes';

function App() {
  return (
    <div className="flex grow flex-col gap-4 ">
      <Header title={getGreeting()}>
        <DatePill />
      </Header>

      <div className="-mx-4 mt-auto flex flex-col place-content-center gap-2 border-t border-solid border-slate-200 px-4 py-4">
        <Link
          to={ROUTES.NEW_WORKOUT}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-slate-700 p-4 text-center text-base font-bold text-white"
        >
          <span className="material-symbols-rounded text-xl leading-none text-white">
            add_circle
          </span>
          Log New Workout
        </Link>
      </div>
    </div>
  );
}

export default App;
