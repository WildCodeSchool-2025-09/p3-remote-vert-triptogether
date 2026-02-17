import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetSummary from "../components/BudgetSummary";
import Modal from "../components/Modal";
import NavTabs from "../components/NavTabs";

type BudgetSummaryData = {
  total: number;
  paid: number;
  balance: number;
};

function TripBudgetPage() {
  const { id } = useParams();
  const tripId = Number(id);

  const [summary, setSummary] = useState<BudgetSummaryData>({
    total: 0,
    paid: 0,
    balance: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    const getBudgetSummary = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/budget`,
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargmement du budget");
        }
        const data = await response.json();

        setSummary({
          total: data.total,
          paid: data.paid,
          balance: data.balance,
        });
      } catch (error) {
        toast.error("ton message d'erreur");
      }
    };
    getBudgetSummary();
  }, [tripId]);

  return (
    <>
      <main className="page-membre trip-budget-page">
        <NavTabs />
        <BudgetSummary
          total={summary.total}
          paid={summary.paid}
          balance={summary.balance}
        />

        <section className="expenses-section">
          <h2>Dépenses</h2>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            + Ajouter
          </button>
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddExpenseForm
            tripId={tripId}
            onSuccess={() => {
              setIsModalOpen(false);
              // ici tu pourras refetch le budget
            }}
          />
        </Modal>
      </main>
    </>
  );
}

export default TripBudgetPage;
