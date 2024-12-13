"use client";
import React, { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function SignIn() {
  const [providers, setProviders] = useState({});
  useEffect(() => {
    async function execThis() {
      const providers = await getProviders();
      setProviders(providers);
    }
    execThis();
  }, []);
  return (
    <div>
      <div
        className="flex items-center justify-evenly flex-col min-h-[85vh]
      py-2 px-14 text-center"
      >
        <Image
          width={320}
          height={320}
          src="/logo.png"
          alt="Some"
        />
        <div className="">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="bg-blue-500 p-3 text-white rounded-lg"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
