import GlobalNavBar from './globalNavBar';
import GlobalFooter from './globalFooter';
import Chatbox from '../Chatbox';
import { Outlet } from 'react-router';
import { Suspense } from 'react';

export default function GlobalShell() {
  return (
    // Optimization1: Added Suspense 
    <>
      <GlobalNavBar />
      <main className="flex-grow-1">
        <Suspense fallback={<div className="text-center py-5">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <GlobalFooter />
      <Chatbox />
    </>
  );
}