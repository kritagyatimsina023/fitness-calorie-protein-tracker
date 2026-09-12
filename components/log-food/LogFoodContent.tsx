// "use client";

// import { useActionState, useEffect, useRef, useState } from "react";
// import {
//   ArrowLeft,
//   Check,
//   ChevronDown,
//   Loader2,
//   Plus,
//   Search,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import {
//   addFoodLogAction,
//   type FoodLogActionState,
// } from "@/actions/log-food/food-log.action";

// const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];

// const mealTypeMap: Record<string, string> = {
//   Breakfast: "BREAKFAST",
//   Lunch: "LUNCH",
//   Dinner: "DINNER",
//   Snack: "SNACK",
// };

// type FoodData = {
//   id: string;
//   source: string;
//   externalId: string | null;
//   name: string;
//   brandName: string | null;
//   servingSize: number;
//   servingUnit: string;
//   nutrition: {
//     caloriesPerServing: number;
//     proteinGrams: number;
//     carbohydrateGrams: number;
//     fatGrams: number;
//   } | null;
// };

// type Props = {
//   foodData: FoodData[];
// };

// const initialState: FoodLogActionState = {
//   success: false,
//   message: "",
// };

// const LogFoodContent = ({ foodData }: Props) => {
//   const router = useRouter();
//   const [selectedMeal, setSelectedMeal] = useState("Breakfast");
//   const [search, setSearch] = useState("");
//   const formRef = useRef<HTMLFormElement>(null);
//   const [selectedFood, setSelectedFood] = useState<FoodData | null>(null);
//   const [quantity, setQuantity] = useState(0.1);
//   const selectedFoodRef = useRef<HTMLElement | null>(null);
//   const [state, formAction, isPending] = useActionState(
//     addFoodLogAction,
//     initialState,
//   );
//   const handledMessage = useRef<string | null>(null);
//   useEffect(() => {
//     if (!selectedFood) return;

//     selectedFoodRef.current?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   }, [selectedFood]);
//   useEffect(() => {
//     if (!state.message) return;

//     const messageKey = `${state.success}-${state.message}`;
//     if (handledMessage.current === messageKey) return;
//     handledMessage.current = messageKey;

//     if (state.success) {
//       toast.success(state.message);
//       formRef.current?.reset();
//       router.refresh();
//       return;
//     }

//     toast.error(state.message);
//   }, [state, router]);

//   const totalCalories = selectedFood?.nutrition
//     ? Math.round(selectedFood.nutrition.caloriesPerServing * quantity)
//     : 0;

//   const totalProtein = selectedFood?.nutrition
//     ? Number((selectedFood.nutrition.proteinGrams * quantity).toFixed(1))
//     : 0;

//   const totalCarbs = selectedFood?.nutrition
//     ? Number((selectedFood.nutrition.carbohydrateGrams * quantity).toFixed(1))
//     : 0;

//   const totalFat = selectedFood?.nutrition
//     ? Number((selectedFood.nutrition.fatGrams * quantity).toFixed(1))
//     : 0;
//   const filteredFoods = foodData.filter((food) => {
//     const query = search.toLowerCase().trim();

//     if (!query) return true;
//     return (
//       food.name.toLowerCase().includes(query) ||
//       food.brandName?.toLowerCase().includes(query)
//     );
//   });
//   const handleSelectFood = (food: FoodData) => {
//     setSelectedFood((current) => {
//       if (current?.id === food.id) {
//         return null;
//       }

//       return food;
//     });
//   };
//   return (
//     <div className="min-w-0 flex-1 ">
//       <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
//         {/* Header */}
//         <div className="mb-8">
//           <Link
//             href="/dashboard"
//             className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to dashboard
//           </Link>

//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//               Log food
//             </h1>
//             <p className="mt-2 text-sm text-slate-500">
//               Add what you ate and keep your daily nutrition on track.
//             </p>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
//           {/* Main */}
//           <div className="space-y-6">
//             {/* Meal selector */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//               <div className="mb-5">
//                 <h2 className="font-semibold text-slate-900">Choose a meal</h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Where would you like to add this food?
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                 {meals.map((meal) => {
//                   const active = selectedMeal === meal;
//                   return (
//                     <button
//                       key={meal}
//                       type="button"
//                       onClick={() => setSelectedMeal(meal)}
//                       className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
//                         active
//                           ? "border-orange-400 bg-orange-50 text-orange-600"
//                           : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
//                       }`}
//                     >
//                       {meal}
//                     </button>
//                   );
//                 })}
//               </div>
//             </section>
//             {/* Search */}
//             <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//               <div className="mb-5">
//                 <h2 className="font-semibold text-slate-900">Find a food</h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Search your food library to add something to your meal.
//                 </p>
//               </div>

//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search food, brand, or ingredient..."
//                   className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
//                 />
//               </div>

//               <div className="mt-6">
//                 <div className="mb-3 flex items-center justify-between">
//                   <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                     {search ? "Search results" : "Recent foods"}
//                   </p>

//                   <Link
//                     href="/dashboard/library"
//                     className="text-xs font-semibold text-orange-500 hover:text-orange-600"
//                   >
//                     Browse library
//                   </Link>
//                 </div>

//                 <div className="divide-y divide-slate-100">
//                   {filteredFoods.map((food) => {
//                     const active = selectedFood?.id === food.id;
//                     return (
//                       <button
//                         key={food.id}
//                         type="button"
//                         onClick={() => handleSelectFood(food)}
//                         className={`flex w-full items-center gap-4 rounded-xl px-3 py-4 text-left transition ${
//                           active ? "bg-orange-50" : "hover:bg-slate-50"
//                         }`}
//                       >
//                         <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-500">
//                           <span className="text-lg">🍽️</span>
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-semibold text-slate-900">
//                             {food.name}
//                           </p>

//                           <p className="mt-1 text-xs text-slate-500">
//                             {food.servingSize} {food.servingUnit}
//                             {food.nutrition && (
//                               <>
//                                 {" · "}
//                                 {food.nutrition.caloriesPerServing} kcal
//                               </>
//                             )}
//                           </p>

//                           {food.brandName && (
//                             <p className="mt-1 text-xs text-slate-400">
//                               {food.brandName}
//                             </p>
//                           )}
//                         </div>

//                         {active ? (
//                           <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-white">
//                             <Check className="h-4 w-4" />
//                           </span>
//                         ) : (
//                           <Plus className="h-5 w-5 text-slate-400" />
//                         )}
//                       </button>
//                     );
//                   })}

//                   {filteredFoods.length === 0 && (
//                     <div className="py-10 text-center">
//                       <p className="text-sm font-medium text-slate-700">
//                         No foods found
//                       </p>
//                       <p className="mt-1 text-xs text-slate-400">
//                         Try another food or browse your food library.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>

//             {selectedFood && (
//               <section
//                 ref={selectedFoodRef}
//                 className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
//               >
//                 <div className="mb-6 flex items-start justify-between gap-4">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
//                       Selected food
//                     </p>

//                     <h2 className="mt-1 text-lg font-semibold text-slate-900">
//                       {selectedFood.name}
//                     </h2>

//                     <p className="mt-1 text-sm text-slate-500">
//                       {selectedFood.servingSize} {selectedFood.servingUnit} per
//                       serving
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-orange-50 px-3 py-2 text-right">
//                     <p className="text-xs text-orange-500">Calories</p>
//                     <p className="text-lg font-bold text-orange-600">
//                       {totalCalories}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mb-6">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Quantity
//                   </label>
//                   <div className="flex gap-3">
//                     <div className="relative flex-1">
//                       <input
//                         type="number"
//                         min="0.1"
//                         step="0.1"
//                         defaultValue={0.1}
//                         onChange={(e) =>
//                           setQuantity(Math.max(0.1, Number(e.target.value)))
//                         }
//                         className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
//                       />

//                       <div className="flex min-w-32 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700">
//                         {selectedFood.servingSize} {selectedFood.servingUnit}
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       className="flex min-w-32 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700"
//                     >
//                       {selectedFood.servingSize} {selectedFood.servingUnit}
//                       <ChevronDown className="h-4 w-4 text-slate-400" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-3">
//                   <NutritionItem label="Protein" value={`${totalProtein}g`} />
//                   <NutritionItem label="Carbs" value={`${totalCarbs}g`} />
//                   <NutritionItem label="Fat" value={`${totalFat}g`} />
//                 </div>
//               </section>
//             )}
//           </div>

//           <aside className="lg:sticky lg:h-fit lg:top-6 lg:self-start">
//             <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//               <div className="border-b border-slate-100 p-6">
//                 <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
//                   Adding to
//                 </p>

//                 <h2 className="mt-1 text-xl font-bold text-slate-900">
//                   {selectedMeal}
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">Today</p>
//               </div>

//               <div className="space-y-5 p-6">
//                 <div>
//                   <div className="flex items-end justify-between">
//                     <span className="text-sm text-slate-500">Calories</span>
//                     <span className="text-2xl font-bold text-slate-900">
//                       {totalCalories}
//                       <span className="ml-1 text-sm font-normal text-slate-400">
//                         kcal
//                       </span>
//                     </span>
//                   </div>

//                   <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full bg-orange-400 transition-all"
//                       style={{
//                         width: `${Math.min((totalCalories / 2500) * 100, 100)}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-3">
//                   <SummaryMacro label="Protein" value={`${totalProtein}g`} />
//                   <SummaryMacro label="Carbs" value={`${totalCarbs}g`} />
//                   <SummaryMacro label="Fat" value={`${totalFat}g`} />
//                 </div>

//                 <form ref={formRef} action={formAction}>
//                   <input
//                     type="hidden"
//                     name="foodId"
//                     value={selectedFood?.id ?? ""}
//                   />
//                   <input
//                     type="hidden"
//                     name="mealType"
//                     value={mealTypeMap[selectedMeal] ?? "BREAKFAST"}
//                   />
//                   <input type="hidden" name="quantity" value={quantity} />
//                   <button
//                     type="submit"
//                     disabled={!selectedFood || isPending}
//                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
//                   >
//                     {isPending ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Adding...
//                       </>
//                     ) : (
//                       <>
//                         <Plus className="h-4 w-4" />
//                         Add to {selectedMeal}
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </section>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };
// function NutritionItem({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-xl bg-slate-50 p-4">
//       <p className="text-xs text-slate-400">{label}</p>
//       <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }

// function SummaryMacro({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-xl border border-slate-100 p-3">
//       <p className="text-xs text-slate-400">{label}</p>
//       <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }

// export default LogFoodContent;
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addFoodLogAction,
  type FoodLogActionState,
} from "@/actions/log-food/food-log.action";

import MealSelector from "./MealSelector";
import FoodSummary from "./FoodSummary";
import FoodSearch from "./FoodSearch";
import SelectedFoodDetails from "./SelectedFoodDetails";
import { FoodWithNutrition } from "@/types/foodwithnutrition.type";

const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mealTypeMap: Record<string, string> = {
  Breakfast: "BREAKFAST",
  Lunch: "LUNCH",
  Dinner: "DINNER",
  Snack: "SNACK",
};

type Props = {
  foodData: FoodWithNutrition[];
};

const initialState: FoodLogActionState = {
  success: false,
  message: "",
};

const LogFoodContent = ({ foodData }: Props) => {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodWithNutrition | null>(
    null,
  );
  const [quantity, setQuantity] = useState(0.1);

  const formRef = useRef<HTMLFormElement>(null);
  const selectedFoodRef = useRef<HTMLElement | null>(null);
  const handledMessage = useRef<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    addFoodLogAction,
    initialState,
  );

  useEffect(() => {
    if (!selectedFood) return;

    selectedFoodRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedFood]);

  useEffect(() => {
    if (!state.message) return;

    const messageKey = `${state.success}-${state.message}`;

    if (handledMessage.current === messageKey) return;

    handledMessage.current = messageKey;

    if (state.success) {
      toast.success(state.message);

      formRef.current?.reset();
      // setSelectedFood(null);
      // setQuantity(0.1);

      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  const handleSelectFood = (food: FoodWithNutrition) => {
    setSelectedFood((current) => (current?.id === food.id ? null : food));
  };

  const totalCalories = selectedFood?.nutrition
    ? Math.round(selectedFood.nutrition.caloriesPerServing * quantity)
    : 0;

  const totalProtein = selectedFood?.nutrition
    ? Number((selectedFood.nutrition.proteinGrams * quantity).toFixed(1))
    : 0;

  const totalCarbs = selectedFood?.nutrition
    ? Number((selectedFood.nutrition.carbohydrateGrams * quantity).toFixed(1))
    : 0;

  const totalFat = selectedFood?.nutrition
    ? Number((selectedFood.nutrition.fatGrams * quantity).toFixed(1))
    : 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Log food
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add what you ate and keep your daily nutrition on track.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <MealSelector
              meals={meals}
              selectedMeal={selectedMeal}
              onSelectMeal={setSelectedMeal}
            />
            <FoodSearch
              foodData={foodData}
              search={search}
              selectedFood={selectedFood}
              onSearchChange={setSearch}
              onSelectFood={handleSelectFood}
            />
            {selectedFood && (
              <SelectedFoodDetails
                ref={selectedFoodRef}
                selectedFood={selectedFood}
                quantity={quantity}
                onQuantityChange={setQuantity}
                totalCalories={totalCalories}
                totalProtein={totalProtein}
                totalCarbs={totalCarbs}
                totalFat={totalFat}
              />
            )}
          </div>
          <FoodSummary
            selectedMeal={selectedMeal}
            selectedFood={selectedFood}
            totalCalories={totalCalories}
            totalProtein={totalProtein}
            totalCarbs={totalCarbs}
            totalFat={totalFat}
            isPending={isPending}
            formRef={formRef}
            formAction={formAction}
            mealType={mealTypeMap[selectedMeal] ?? "BREAKFAST"}
            quantity={quantity}
          />
        </div>
      </div>
    </div>
  );
};

export default LogFoodContent;
