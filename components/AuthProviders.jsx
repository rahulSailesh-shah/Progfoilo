"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import Button from "./Button";

const AuthProviders = () => {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  if (providers) {
    return (
      <div>
        {Object.values(providers).map((provider, i) => (
          <Button
            key={i}
            title="Sign In with GitHub"
            handleClick={() => signIn(provider?.id)}
          />
        ))}
      </div>
    );
  }
};

export default AuthProviders;
