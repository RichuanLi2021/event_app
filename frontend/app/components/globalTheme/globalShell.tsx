import GlobalNavigationBar from './globalNavBar';
import GlobalFooter from './globalFooter';
import Chatbox from '../Chatbox';
import { Outlet } from 'react-router';
import NavBar from './toolBar';

export default function GlobalShell() {
  return (
    <>
      <GlobalNavigationBar/>
      {/* <NavBar/> */}
        <main className="flex-grow-1">
          <Outlet/>
        </main>
      <GlobalFooter/>
      <Chatbox />
    </>
  );
}