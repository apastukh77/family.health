import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const PublicLayout = ({ children }) => (
  <div className="App flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const Marquee = ({ text }) => (
  <div className="bg-[#F0EBE1] border-y border-[#E2DACD] py-4 overflow-hidden whitespace-nowrap">
    <div className="marquee-track inline-flex">
      {[0, 1].map((i) => (
        <span key={i} className="font-serif text-xl text-[#4A5D4E] tracking-wide px-4">
          {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp;
        </span>
      ))}
    </div>
  </div>
);