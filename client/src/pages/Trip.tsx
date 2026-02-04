import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import NavTabs from "../components/NavTabs/NavTabs";
import { useToast } from "../hooks/useToast";

export function Trip() {
  type RouteParams = {
    id: string;
  };

  const { id } = useParams<RouteParams>();
  const tripId = Number(id);

  const navigate = useNavigate();
  useToast();

  useEffect(() => {
    if (!tripId) {
      navigate("/", {
        state: {
          toast: {
            type: "error",
            message: "Voyage invalide",
          },
        },
      });
      return;
    }
  }, [tripId, navigate]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header>
        <nav>Trip Together</nav>
      </header>
      <main>
        <section id="trip-infos" className="card">
          {/* Composant trip infos */}
        </section>

        <NavTabs />
      </main>
    </>
  );
}
