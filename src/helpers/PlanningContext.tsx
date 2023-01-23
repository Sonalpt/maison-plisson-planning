import { createContext } from "react";

type PlanningContextType = {
  planningState: {
    id: number,
  },
  setPlanningState: (newPlanningState: any) => void,
};

export const PlanningContext = createContext<PlanningContextType>({
  planningState: {
    id: 0,
  },
  setPlanningState: () => {},
});
