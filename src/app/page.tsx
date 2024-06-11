import { Announcement } from "@/components/announcement";
import Footer from "@/components/footer";
import Header from "@/components/header";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow container flex flex-col justify-center relative">
          <PageHeader>
            <Announcement />
            <PageHeaderHeading className="hidden md:block">
              Discover Our Platform&apos;s Potential
            </PageHeaderHeading>
            <PageHeaderHeading className="md:hidden">
              Welcome!
            </PageHeaderHeading>
            <PageHeaderDescription>
              Explore a world of possibilities with BlackPepper. From
              beautifully crafted dashboards to seamless authentication, our
              platform offers a wealth of examples to ignite your creativity and
              guide your journey towards building exceptional applications.
            </PageHeaderDescription>
            <PageActions>
              <Link href="#" className={cn(buttonVariants(), "rounded-[6px]")}>
                Get Started
              </Link>
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-[6px]"
                )}
              >
                Explore Components
              </Link>
            </PageActions>
          </PageHeader>
          <section>{/* Additional content can be added here */}</section>
        </div>
        <Footer />
      </div>
    </>
  );
}
