import OTPInput from "./OTPInput";

export default function Home() {
  return (
    <section className="max-w-md mx-auto my-10 px-3">
      <p className="text-center text-sm text-neutral-300">
        Two Factor Auth Micro interaction
      </p>
      <p className="text-center text-sm text-neutral-500 mb-10">Start typing...</p>
      <div className="p-5 rounded-lg border border-neutral-700 bg-neutral-800">
        <OTPInput
          length={6}
        />
        <div className='text-xs mt-12'>
          <h4 className="text-white">Social Sign-On</h4>
          <p className="text-neutral-400 mt-3">
            Add high-conversion Social SSO (Single Sign-On) to you application in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
