import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div
        data-orientation="horizontal"
        role="none"
        className="shrink-0 bg-border h-[1px] w-full"
      ></div>
      <footer className="container mx-auto py-6 text-muted-foreground flex justify-between gap-4 flex-wrap text-sm">
        <p>© 2024 blackpepper-app. All rights reserved.</p>
        <div className="flex gap-2.5 items-center">
          <Link href="/terms">
            <span className="underline">Terms</span>
          </Link>
          <Link href="/privacy">
            <span className="underline">Privacy</span>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
