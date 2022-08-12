import {
  collection,
  getDocs,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../main";
import { readonly, reactive, DeepReadonly, computed, ComputedRef } from "vue";
import { DataPaint } from "../types";
import { useFireBase } from "../composables/useFireBase";

export interface StatePaint {
  dataPaints: DataPaint[];
  filter: string;
}

const statePaint = reactive<StatePaint>({
  dataPaints: [],
  filter: "",
});

export interface FireBasePaints {
  statePaint: DeepReadonly<typeof statePaint>;
  sortedFeedPaints: ComputedRef<DataPaint[]>;
  getFeedPaints: () => Promise<void>;
  setFilterValue: (value: string) => void;
  saveImageOnServer: (NameOfPaint: string, imageURL: string) => void;
}

export const useFireBasePaints: () => FireBasePaints = () => {
  const { state } = useFireBase();

  const getFeedPaints = () =>
    getDocs(collection(db, "users")).then((docs) => {
      docs.forEach((doc) => {
        doc
          .data()
          .paints.forEach(
            (paint: { nameOfPaint: string; date: Timestamp; url: string }) => {
              let isPushed = false;
              statePaint.dataPaints?.forEach((p) => {
                if (
                  p.urlOfPaint === paint.url &&
                  p.nameOfPaint === paint.nameOfPaint
                )
                  isPushed = true;
              });

              if (isPushed === false) {
                statePaint.dataPaints?.push({
                  nameOfPaint: paint.nameOfPaint,
                  date: new Date(
                    paint.date.seconds * 1000
                  ).toLocaleDateString(),
                  userName: doc.data().name,
                  urlOfPaint: paint.url,
                });
              }
            }
          );
      });
    });

  const filteredItems = computed(() => {
    if (statePaint.filter)
      return statePaint.dataPaints.filter(
        (p: DataPaint) => p.userName === statePaint.filter
      );
    return statePaint.dataPaints;
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
    statePaint.filter = value;
  };

  const saveImageOnServer = (NameOfPaint: string, imageURL: string) => {
    let id = "";
    let getPaints: any = [];
    getDocs(collection(db, "users"))
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().name === state.user.email) {
            id = doc.id;
            getPaints = doc.data().paints;
          }
        });
      })
      .then(() => {
        getPaints.push({
          nameOfPaint: NameOfPaint,
          date: new Date(),
          url: imageURL,
        });
        setDoc(
          doc(db, "users", id),
          {
            paints: getPaints,
          },
          { merge: true }
        );
      });
  };

  return {
    statePaint: readonly(statePaint),
    sortedFeedPaints,
    setFilterValue,
    getFeedPaints,
    saveImageOnServer,
  };
};
