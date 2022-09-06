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
  filterEmail: string;
  filterPaint: string;
  sorting: number;
}

const statePaint = reactive<StatePaint>({
  dataPaints: [],
  filterEmail: "",
  filterPaint: "",
  sorting: 0,
});

export interface FireBasePaints {
  statePaint: DeepReadonly<typeof statePaint>;
  feedPaints: ComputedRef<DataPaint[]>;
  getFeedPaints: () => Promise<void>;
  setFilterValueEmail: (value: string) => void;
  saveImageOnServer: (NameOfPaint: string, imageURL: string) => void;
  deleteUserPaint: (name: string, url: string, user: string) => void;
  setSortingValue: (value: number) => void;
  setFilterValuePaint: (value: string) => void;
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
    if (statePaint.filterEmail && statePaint.filterPaint === "")
      return statePaint.dataPaints.filter(
        (p: DataPaint) => p.userName === statePaint.filterEmail
      );
    else if (statePaint.filterEmail === "" && statePaint.filterPaint)
      return statePaint.dataPaints.filter(
        (p: DataPaint) => p.nameOfPaint === statePaint.filterPaint
      );
    else if (statePaint.filterPaint && statePaint.filterPaint)
      return statePaint.dataPaints.filter(
        (p: DataPaint) =>
          p.nameOfPaint === statePaint.filterPaint &&
          p.userName === statePaint.filterEmail
      );
    return statePaint.dataPaints;
  });

  const feedPaints = computed(() => {
    const items = filteredItems.value.sort(
      (prev: DataPaint, curr: DataPaint) =>
        new Date(prev.dateInTimestamp.seconds).getTime() -
        new Date(curr.dateInTimestamp.seconds).getTime()
    );
    if (statePaint.sorting === 0) return items;
    else return items.reverse();
  });

  const setSortingValue = (value: number) => {
    statePaint.sorting = value;
  };

  const setFilterValueEmail = (value: string) => {
    statePaint.filterEmail = value;
  };

  const setFilterValuePaint = (value: string) => {
    statePaint.filterPaint = value;
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

  const deleteUserPaint = (NameOfPaint: string, url: string, user: string) => {
    let idUser = "";
    let getPaintsOfUser: any = [];
    let idOfPaint: number;
    getDocs(collection(db, "users"))
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().name === user) {
            idUser = doc.id;
            getPaintsOfUser = doc.data().paints;
          }
        });
      })
      .then(() => {
        getPaintsOfUser.forEach(
          (
            paint: { date: Timestamp; nameOfPaint: string; url: string },
            index: number
          ) => {
            if (paint.url === url) idOfPaint = index;
          }
        );
        getPaintsOfUser.splice(idOfPaint, 1);

        let id = 0;
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
            console.log(index, paint.urlOfPaint === url);
            if (paint.urlOfPaint === url)  id = index;
          }
        );
        console.log(statePaint.dataPaints);

        statePaint.dataPaints.splice(id, 1);

        console.log(statePaint.dataPaints);

        setDoc(
          doc(db, "users", idUser),
          {
            paints: getPaintsOfUser,
          },
          { merge: true }
        );
      });
  };

  return {
    statePaint: statePaint,
    feedPaints,
    setFilterValueEmail,
    getFeedPaints,
    saveImageOnServer,
    deleteUserPaint,
    setSortingValue,
    setFilterValuePaint,
  };
};
