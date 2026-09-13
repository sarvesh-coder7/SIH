import React from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import assemblyHeroImg from '../../assets/images/jharkhand_assembly_1788342750288.jpg';

import {
  Lightbulb,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const handleEnterPortal = () => {
    setCurrentView('role-selection');
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 text-white font-sans-body selection:bg-amber-500 selection:text-slate-950">

      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}

      <section className="relative w-full h-screen flex flex-col overflow-hidden bg-slate-950">

        {/* ============================================================ */}
        {/* BACKGROUND IMAGE                                              */}
        {/* ============================================================ */}

        <div className="absolute inset-0 z-0">

          <img
            src={assemblyHeroImg}
            alt="Jharkhand State Legislative Assembly"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* Main cinematic dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85 pointer-events-none" />

          {/* Warm cinematic overlay */}
          <div className="absolute inset-0 bg-amber-950/10 mix-blend-color-burn pointer-events-none" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

        </div>


        {/* ============================================================ */}
        {/* TOP NAVBAR                                                     */}
        {/* ============================================================ */}

        <header
          className="
            relative
            z-30
            w-full
            px-6
            sm:px-10
            lg:px-16
            py-4
            sm:py-5
            flex
            items-center
            justify-between

            bg-slate-950/20
            backdrop-blur-md

            border-b
            border-white/20

            shadow-[0_1px_15px_rgba(0,0,0,0.15)]
          "
        >

          {/* ======================================================== */}
          {/* BRAND                                                      */}
          {/* ======================================================== */}

          <button
            type="button"
            onClick={() => setCurrentView('landing')}
            className="
              flex
              items-center
              gap-3
              cursor-pointer
              select-none
              group
              text-left
            "
          >

            {/* Emblem */}
            <JharkhandEmblem
              size={48}
              className="
                ring-2
                ring-amber-400/50
                shadow-xl
                shrink-0
              "
            />

            {/* Brand text */}
            <div>

              <span
                className="
                  block
                  text-lg
                  sm:text-xl
                  md:text-2xl
                  font-bold
                  tracking-tight
                  text-white
                  leading-tight
                  font-sans-body
                  group-hover:text-amber-300
                  transition-colors
                "
              >
                JH Innovation Connect
              </span>

              <span
                className="
                  block
                  mt-0.5
                  text-[9px]
                  sm:text-xs
                  text-amber-200/90
                  font-medium
                  tracking-wide
                "
              >
                Govt. of Jharkhand &bull; Higher & Technical Education
              </span>

            </div>

          </button>

        </header>


        {/* ============================================================ */}
        {/* HERO CENTER CONTENT                                            */}
        {/* ============================================================ */}

        <main
          className="
            relative
            z-10
            flex-1
            flex
            items-center
            justify-center
            text-center
            px-5
            sm:px-8
            pb-24
          "
        >

          <div
            className="
              w-full
              max-w-5xl
              mx-auto
              flex
              flex-col
              items-center
              justify-center
              space-y-5
              sm:space-y-6
            "
          >

            {/* ====================================================== */}
            {/* MAIN HEADING                                              */}
            {/* ====================================================== */}

            <div className="space-y-1">

              <h1
                className="
                  text-3xl
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-serif-display
                  font-normal
                  tracking-tight
                  text-white
                  leading-tight
                  drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]
                "
              >
                Where Jharkhand&apos;s
              </h1>

              <h2
                className="
                  text-3xl
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  font-serif-display
                  font-medium
                  tracking-tight
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-amber-200
                  via-amber-300
                  to-yellow-400
                  drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]
                  leading-tight
                "
              >
                Challenges Meet Innovation
              </h2>

            </div>


            {/* ====================================================== */}
            {/* DESCRIPTION                                              */}
            {/* ====================================================== */}

            <p
              className="
                text-sm
                sm:text-lg
                md:text-xl
                text-white/90
                font-normal
                max-w-2xl
                mx-auto
                leading-relaxed
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
              "
            >
              A collaborative platform for solving societal challenges
              through knowledge, technology and partnership.
            </p>


            {/* ====================================================== */}
            {/* ENTER PORTAL BUTTON                                       */}
            {/* ====================================================== */}

            <div className="pt-2 sm:pt-3">

              <button
                type="button"
                onClick={handleEnterPortal}
                className="
                  px-8
                  sm:px-10
                  py-3.5
                  sm:py-4

                  bg-gradient-to-r
                  from-amber-400
                  via-amber-500
                  to-amber-600

                  hover:from-amber-300
                  hover:to-amber-500

                  text-slate-950
                  font-bold
                  text-sm
                  sm:text-base

                  rounded-xl

                  shadow-2xl
                  shadow-black/40

                  hover:shadow-amber-500/50

                  transition-all
                  duration-300

                  hover:scale-105
                  active:scale-95

                  cursor-pointer

                  flex
                  items-center
                  gap-2.5

                  group
                "
              >

                <ArrowRight
                  className="
                    w-5
                    h-5
                    transition-transform
                    group-hover:translate-x-1
                  "
                />

                <span>
                  Enter Portal
                </span>

              </button>

            </div>

          </div>

        </main>


        {/* ============================================================ */}
        {/* BOTTOM FEATURE BOX                                             */}
        {/* ============================================================ */}

        <div
          className="
            relative
            z-20

            w-full

            bg-slate-950/90
            backdrop-blur-md

            border-t
            border-white/15

            px-5
            sm:px-8
            lg:px-12

            py-5
            sm:py-6

            shadow-[0_-10px_35px_rgba(0,0,0,0.25)]
          "
        >

          {/* ======================================================== */}
          {/* THREE FEATURE COLUMNS                                     */}
          {/* ======================================================== */}

          <div
            className="
              w-full
              max-w-7xl
              mx-auto

              grid
              grid-cols-1
              md:grid-cols-3

              gap-4
              md:gap-0

              divide-y
              md:divide-y-0
              md:divide-x

              divide-white/10
            "
          >

            {/* ==================================================== */}
            {/* FEATURE 1                                             */}
            {/* ==================================================== */}

            <div
              className="
                flex
                items-center
                gap-4

                py-3
                md:py-1

                md:px-8
              "
            >

              <div
                className="
                  w-11
                  h-11

                  rounded-xl

                  bg-amber-500/15

                  border
                  border-amber-400/40

                  flex
                  items-center
                  justify-center

                  shrink-0

                  text-amber-400
                "
              >

                <Lightbulb className="w-6 h-6" />

              </div>

              <div>

                <h3
                  className="
                    text-sm
                    sm:text-base

                    font-serif-quote
                    italic
                    font-semibold

                    text-amber-300
                  "
                >
                  Together We Innovate
                </h3>

                <p className="text-xs text-slate-300">
                  Ideas for Impact
                </p>

              </div>

            </div>


            {/* ==================================================== */}
            {/* FEATURE 2                                             */}
            {/* ==================================================== */}

            <div
              className="
                flex
                items-center
                gap-4

                py-3
                md:py-1

                md:px-8
              "
            >

              <div
                className="
                  w-11
                  h-11

                  rounded-xl

                  bg-emerald-500/15

                  border
                  border-emerald-400/40

                  flex
                  items-center
                  justify-center

                  shrink-0

                  text-emerald-400
                "
              >

                <Users className="w-6 h-6" />

              </div>

              <div>

                <h3
                  className="
                    text-sm
                    sm:text-base

                    font-serif-quote
                    italic
                    font-semibold

                    text-amber-300
                  "
                >
                  Together We Transform
                </h3>

                <p className="text-xs text-slate-300">
                  Collaboration for Change
                </p>

              </div>

            </div>


            {/* ==================================================== */}
            {/* FEATURE 3                                             */}
            {/* ==================================================== */}

            <div
              className="
                flex
                items-center
                gap-4

                py-3
                md:py-1

                md:px-8
              "
            >

              <div
                className="
                  w-11
                  h-11

                  rounded-xl

                  bg-amber-500/15

                  border
                  border-amber-400/40

                  flex
                  items-center
                  justify-center

                  shrink-0

                  text-amber-400
                "
              >

                <TrendingUp className="w-6 h-6" />

              </div>

              <div>

                <h3
                  className="
                    text-sm
                    sm:text-base

                    font-serif-quote
                    italic
                    font-semibold

                    text-amber-300
                  "
                >
                  Together We Build a Better Jharkhand
                </h3>

                <p className="text-xs text-slate-300">
                  Solutions for Tomorrow
                </p>

              </div>

            </div>

          </div>


          {/* ======================================================== */}
          {/* QUOTE                                                     */}
          {/* ======================================================== */}

          <div
            className="
              pt-4
              sm:pt-5

              flex
              items-center
              justify-center

              gap-3
              sm:gap-4

              w-full
              max-w-4xl
              mx-auto

              text-center
            "
          >

            <div
              className="
                flex-1
                h-px
                bg-gradient-to-r
                from-transparent
                via-amber-400/40
                to-amber-400/80
              "
            />

            <p
              className="
                text-[11px]
                sm:text-sm
                md:text-base

                font-serif-quote
                italic

                text-amber-200/90

                whitespace-nowrap
              "
            >
              &ldquo;Every challenge is an opportunity to build a better tomorrow.&rdquo;
            </p>

            <div
              className="
                flex-1
                h-px
                bg-gradient-to-l
                from-transparent
                via-amber-400/40
                to-amber-400/80
              "
            />

          </div>

        </div>

      </section>

    </div>
  );
};