type Props = {
  meals: string[];
  selectedMeal: string;
  onSelectMeal: (meal: string) => void;
};

const MealSelector = ({ meals, selectedMeal, onSelectMeal }: Props) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">Choose a meal</h2>

        <p className="mt-1 text-sm text-slate-500">
          Where would you like to add this food?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {meals.map((meal) => {
          const active = selectedMeal === meal;
          return (
            <button
              key={meal}
              type="button"
              onClick={() => onSelectMeal(meal)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {meal}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MealSelector;
