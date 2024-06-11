import Settings from "./settings";

export default function Page() {
  return (
    <>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 ">
        <Settings />
      </div>
    </>
  );
}
