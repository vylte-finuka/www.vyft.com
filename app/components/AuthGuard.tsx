"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importer usePathname pour obtenir la route actuelle
import secureLocalStorage from "react-secure-storage";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // État pour bloquer le rendu pendant la vérification
  const router = useRouter();
  const pathname = usePathname(); // Obtenir la route actuelle

  useEffect(() => {
    const checkAuthentication = () => {
      // Exclure la route /conditions-generals-de-vente de la vérification
      if (pathname === "/conditions-generales-de-vente") {
        setIsLoading(false); // Ne pas bloquer le rendu pour cette route
        return;
      }

      const userToken = secureLocalStorage.getItem("userToken");
      const isLoggedIn = secureLocalStorage.getItem("isLoggedIn");

      if (!userToken || !isLoggedIn) {
        console.error("Utilisateur non authentifié. Redirection vers /login.");
        setTimeout(() => {
          if (pathname !== "/conditions-generals-de-vente") {
            router.push("/login"); // Rediriger vers /login après 4 millisecondes
          }
        }, 4);
      } else {
        setIsAuthenticated(true); // L'utilisateur est authentifié
      }

      setIsLoading(false); // La vérification est terminée
    };

    checkAuthentication();
  }, [router, pathname]);

  if (isLoading) {
    return null; // Bloquer le rendu tant que la vérification n'est pas terminée
  }

  if (!isAuthenticated && pathname !== "/conditions-generals-de-vente") {
    return null; // Ne rien rendre si l'utilisateur n'est pas authentifié et que ce n'est pas une route exclue
  }

  return <>{children}</>;
};

export default AuthGuard;