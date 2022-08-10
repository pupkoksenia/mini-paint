import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../main";
import { readonly, reactive, DeepReadonly, computed, ComputedRef } from "vue";
import { DataPaint } from "../types";

export interface State {
  dataPaints: DataPaint[];
  filter: string;
}

const state = reactive<State>({
  dataPaints: [],
  filter: "",
});

export interface FireBasePaints {
  state: DeepReadonly<typeof state>;
  sortedFeedPaints: ComputedRef<DataPaint[]>;
  getFeedPaints: () => Promise<void>;
  setFilterValue: (value: string) => void;
}

export const useFireBasePaints: () => FireBasePaints = () => {
  const getFeedPaints = () =>
    getDocs(collection(db, "users")).then((docs) => {
      docs.forEach((doc) => {
        doc
          .data()
          .paints.forEach((paint: { nameOfPaint: string; date: Timestamp }) => {
            state.dataPaints?.push({
              nameOfPaint: paint.nameOfPaint,
              date: new Date(paint.date.seconds * 1000).toLocaleDateString(),
              userName: doc.data().name,
            });
          });
      });
    });

  const filteredItems = computed(() => {
    if (state.filter)
      return state.dataPaints.filter(
        (p: DataPaint) => p.userName === state.filter
      );
    return state.dataPaints;
  });

  const sortedFeedPaints = computed(() =>
    filteredItems.value
      .sort(
        (prev: DataPaint, curr: DataPaint) =>
          Date.parse(prev.date) - Date.parse(curr.date)
      )
      .reverse()
  );

  const setFilterValue = (value: string) => {
    state.filter = value;
  };

  return {
    state: readonly(state),
    sortedFeedPaints,
    setFilterValue,
    getFeedPaints,
  };
};
