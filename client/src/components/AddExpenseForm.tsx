import "../pages/styles/AddExpenseForm.css";
import { useState } from "react";

type Member = {
  id: number;
  firstname?: string;
  email?: string;
};

type AddExpenseFormProps = {
  tripId: number;
  members: Member[];
  onSuccess: () => void;
};

function AddExpenseForm({ tripId, members, onSuccess }: AddExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${tripId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripId,
            title,
            amount: Number(amount),
            paid_by: Number(paidBy),
            category_id: Number(categoryId),
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Erreur backend:", errorData);
        throw new Error(errorData.message || "Erreur création dépense");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h2>Ajouter une dépense</h2>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Montant"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Choisir une catégorie</option>
        <option value="1">Transport</option>
        <option value="2">Logement</option>
        <option value="3">Nourriture</option>
        <option value="4">Activité</option>
      </select>

      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        required
      >
        <option value="">Payé par</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.firstname || member.email}
          </option>
        ))}
      </select>

      <button type="submit">Enregistrer</button>
    </form>
  );
}

export default AddExpenseForm;
