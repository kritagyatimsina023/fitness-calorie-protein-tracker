import LogFoodContent from "@/components/log-food/LogFoodContent";
import { foodService } from "@/services/log-food/food.service";

export default async function LogFoodPage() {
  const food = await foodService.getAvailableFood();
  console.log(food, "are the available food");

  return <LogFoodContent foodData={food} />;
}
