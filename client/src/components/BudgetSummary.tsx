import "../pages/styles/BudgetSummary.css";

type BudgetSummaryProps = {
  total: number;
  paid: number;
  balance: number;
};

function BudgetSummary({ total, paid, balance }: BudgetSummaryProps) {
  return (
    <section className="budget-summary">
      <div className="budget-card">
        <p className="card-label">Budget total</p>
        <h3>{total.toFixed(2)} €</h3>
      </div>

      <div className="budget-card">
        <p className="card-label">Tu as payé</p>
        <h3>{paid.toFixed(2)} €</h3>
      </div>

      <div className={`budget-card ${balance >= 0 ? "positive" : "negative"}`}>
        <p className="card-label">Ton solde</p>
        <h3>
          {balance >= 0 ? "+" : ""}
          {balance.toFixed(2)} €
        </h3>
      </div>
    </section>
  );
}

export default BudgetSummary;
