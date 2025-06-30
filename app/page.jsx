"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeToggle from "@/components/themeToggler";
import FaQ from "@/components/faQ";
import Footer from "@/components/footer";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Import the BoxReveal component
import { BoxReveal } from "@/components/magicui/box-reveal"; // Adjust the path as needed

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="w-full px-6 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto relative">
        <div className="flex items-center gap-2"> 
          <Image src="/logo.svg" alt="MoneyMate Logo" height={60} width={60} />
          <span className="text-xl font-bold text-orange-500">MoneyMate</span> 
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <ThemeToggle />
        </div>

        <Link href="/Signin">
          <Button className="flex gap-2">Sign in</Button>
        </Link>
      </div>

      {/* Tagline block */}
      <div className="w-full max-w-4xl mx-auto mt-18 text-center px-4">

      
        <h2 className="text-3xl font-semibold text-orange-500">
          <b><TypingAnimation
              as="span"
              duration={70} 
              delay={500} 
              startOnView={true} 
            >Your personal finance sidekick</TypingAnimation></b>
        </h2>
        


        <p className="mt-2 text-gray-600 dark:text-gray-300">
          <i>
            Manage expenses, stay within budget, and grow your savings —
            effortlessly.
          </i>
        </p>

      </div>
      <span className="flex items-center pt-15"></span>

      {/* Hero section with main call to action */}
      <section className="lg:grid lg:place-content-center bg-white dark:bg-gray-900">
        <div className="mx-auto w-screen max-w-screen-xl px-4 pt-4 pb-16 sm:px-6 sm:pt-4 sm:pb-20 lg:px-5 lg:pt-0 lg:pb-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"> {/* Added grid for two columns */}
            <div className="max-w-prose lg:max-w-none"> {/* Text content - removed fixed max-w for smaller screens, adjusted for large */}
              <BoxReveal boxColor="#5046e6" duration={0.9}>
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
                  Track your expenses.
                  <strong className="text-indigo-600"> Take control </strong>
                  of your money.
                </h1>
              </BoxReveal>
              <BoxReveal boxColor="#5046e6" duration={1.1}>
                <p className="mt-4 text-base text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
                  MoneyMate helps you understand your spending, set saving goals,
                  and build healthy financial habits — all in one place.
                </p>
              </BoxReveal>
              <BoxReveal boxColor="#5046e6" duration={1.3}>
                <div className="mt-4 flex gap-4 sm:mt-6">
                  <Link
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                    href={"/SignUp"}
                  >
                    Get Started Free
                  </Link>
                  <a
                    className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                    href="#"
                  >
                    View Demo
                  </a>
                </div>
              </BoxReveal>
            </div>

            {/* Right side content */}
            <div className="mt-12 lg:mt-0 lg:ml-auto"> {/* Adjust margin-top for smaller screens, remove for large */}
              <BoxReveal boxColor="#5046e6" duration={1.5}>
                <div className="relative"> {/* Added relative for absolute positioning of overlay */}
                  <Image
                    src="/hero.png"
                    alt="MoneyMate Dashboard Illustration"
                    width={700} // Increased width for better visual
                    height={500} // Adjusted height to maintain aspect ratio with width increase
                    className="rounded-lg shadow-xl"
                  />
                  {/* Gradient overlay for blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent rounded-lg"></div>
                </div>
              </BoxReveal>
            </div>
          </div>
        </div>
      </section>

      {/* New section for screenshots */}
      <section className="mt-10 mx-auto max-w-8xl px-4">
        <BoxReveal boxColor="#5046e6" duration={0.7}>
          <h2 className="text-3xl font-bold text-center text-blue-500 mb-12">
            <TypingAnimation
              as="span"
              duration={50} 
              delay={500} 
              startOnView={true} 
            >A glimpse inside MoneyMate</TypingAnimation>
          </h2>
        </BoxReveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Screenshot 1 */}
          <BoxReveal boxColor="#5046e6" duration={0.9}>
            <div className="relative rounded-lg overflow-hidden shadow-2xl transition-transform transform hover:scale-105">
              <Image
                src="/screenshot-1.png"
                alt="Dashboard showing an overview of expenses and budget."
                width={800}
                height={600}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </BoxReveal>
          {/* Screenshot 2 */}
          <BoxReveal boxColor="#5046e6" duration={1.1}>
            <div className="relative rounded-lg overflow-hidden shadow-2xl transition-transform transform hover:scale-105">
              <Image
                src="/screenshot-2.png"
                alt="Detailed view of transaction history with categories."
                width={800}
                height={600}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </BoxReveal>
          {/* Screenshot 3 */}
          <BoxReveal boxColor="#5046e6" duration={1.3}>
            <div className="relative rounded-lg overflow-hidden shadow-2xl transition-transform transform hover:scale-105">
              <Image
                src="/screenshot-3.png"
                alt="Charts and graphs visualizing spending habits over time."
                width={800}
                height={600}
                layout="responsive"
                objectFit="cover"
              />
            </div>
          </BoxReveal>
          {/* Add more screenshots here if needed */}
        </div>
      </section>

      <span className="flex items-center pt-15">
        <FaQ className="mt-30" />
      </span>
      <Footer />
    </div>
  );
}