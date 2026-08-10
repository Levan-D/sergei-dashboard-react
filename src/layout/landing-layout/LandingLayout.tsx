import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function LandingLayout() {
  return (
    <div className="landing relative flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
