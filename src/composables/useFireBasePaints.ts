import {
  collection,
  getDocs,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../main";
import { reactive, DeepReadonly, computed, ComputedRef } from "vue";
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
  deleteUserPaint: (name: string, url: string) => void;
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
                  dateInTimestamp: paint.date,
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
          new Date(prev.dateInTimestamp.seconds).getTime() -
          new Date(curr.dateInTimestamp.seconds).getTime()
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

  const deleteUserPaint = (NameOfPaint: string, url: string) => {
    let idUser = "";
    let getPaints: any = [];
    let idOfPaint: number;
    getDocs(collection(db, "users"))
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().name === state.user.email) {
            idUser = doc.id;
            getPaints = doc.data().paints;
          }
        });
      })
      .then(() => {
        getPaints.forEach(
          (
            paint: { date: Timestamp; nameOfPaint: string; url: string },
            index: number
          ) => {
            if (paint.nameOfPaint === NameOfPaint && paint.url === url)
              idOfPaint = index;
          }
        );
        getPaints.splice(idOfPaint, 1);

        let id = 0
        statePaint.dataPaints.forEach(
          (
            paint: {
              nameOfPaint: string;
              date: string;
              dateInTimestamp: Timestamp;
              userName: string;
              urlOfPaint: string;
            },
            index: number
          ) => {
            if (paint.nameOfPaint === NameOfPaint && paint.urlOfPaint === url && state.user.email === paint.userName)
              id = index;
          }
        );
        statePaint.dataPaints.splice(id,1)

        setDoc(
          doc(db, "users", idUser),
          {
            paints: getPaints,
          },
          { merge: true }
        );
      });
  };

  return {
    statePaint: statePaint,
    sortedFeedPaints,
    setFilterValue,
    getFeedPaints,
    saveImageOnServer,
    deleteUserPaint,
  };
};
