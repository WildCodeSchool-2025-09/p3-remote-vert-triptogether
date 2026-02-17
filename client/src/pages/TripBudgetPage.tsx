import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetSummary from "../components/BudgetSummary";
import Modal from "../components/Modal";
import NavTabs from "../components/NavTabs";
import TripInfos from "../components/TripInfos";
import "../pages/styles/TripBugdetPage.css";
import type { TheTrip } from "../types/tripType";

type BudgetSummaryData = {
  total: number;
  paid: number;
  balance: number;
};

type Expense = {
  id: number;
  title: string;
  amount: number;
  paid_by: number;
  category_id: number;
  date: string;
};

function TripBudgetPage() {
  const { id } = useParams();
  const tripId = Number(id);

  const [summary, setSummary] = useState<BudgetSummaryData>({
    total: 0,
    paid: 0,
    balance: 0,
  });

  const [trip, setTrip] = useState<TheTrip | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTrip = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
      );

      if (!response.ok) {
        throw new Error("Erreur chargement voyage");
      }

      const data = await response.json();

      setTrip(data); //
    } catch (error) {
      toast.error("Erreur chargement voyage");
    }
  }, [tripId]);

  const getBudgetSummary = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/budget`,
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du budget");
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      toast.error("Erreur chargement budget");
    }
  }, [tripId]);

  const getExpenses = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${tripId}`,
      );

      if (!response.ok) {
        throw new Error("Erreur chargement dépenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      toast.error("Erreur chargement dépenses");
    }
  }, [tripId]);

  useEffect(() => {
    if (!tripId) return;
    getTrip();
    getBudgetSummary();
    getExpenses();
  }, [tripId, getTrip, getBudgetSummary, getExpenses]);

  return (
    <>
      {trip && <TripInfos trip={trip} />}
      <main className="page-membre trip-budget-page">
        <NavTabs />

        <BudgetSummary
          total={summary.total}
          paid={summary.paid}
          balance={summary.balance}
        />

        <section className="expenses-section">
          <div className="expenses-header">
            <h2>Dépenses ({expenses.length})</h2>
            <button
              type="button"
              className="add-expense-btn"
              onClick={() => setIsModalOpen(true)}
            >
              + Ajouter
            </button>
          </div>

          {expenses.length === 0 ? (
            <p className="empty-state">Aucune dépense pour le moment.</p>
          ) : (
            <ul className="expense-list">
              {expenses.map((expense) => (
                <li key={expense.id} className="expense-item">
                  <div className="expense-left">
                    <p className="expense-title">{expense.title}</p>
                    <small className="expense-date">
                      {new Date(expense.date).toLocaleDateString("fr-FR")}
                    </small>
                  </div>

                  <div className="expense-right">
                    <strong className="expense-amount">
                      {Number(expense.amount).toFixed(2)} €
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddExpenseForm
            tripId={tripId}
            onSuccess={() => {
              setIsModalOpen(false);
              getBudgetSummary();
              getExpenses();
            }}
          />
        </Modal>
      </main>
    </>
  );
}

export default TripBudgetPage;
