"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";

const KpiGrid = dynamic(() => import("./components/KpiGrid"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 sm:px-8">
        <section className="w-full max-w-5xl bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center mt-8">
          <div className="w-full flex flex-col items-center mb-6">
            <h2 className="text-2xl font-extrabold text-black mb-2">KPI Cards</h2>
            <p className="text-gray-400 text-base">Add, view, and manage your key performance indicators</p>
          </div>
          <KpiGrid />
        </section>
      </main>
      <footer className="w-full text-center text-gray-400 py-4 text-xs mt-8">
        &copy; {new Date().getFullYear()} Steel Plant Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
