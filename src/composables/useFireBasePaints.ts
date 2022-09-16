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
  sorting: string;
  page: number;
  perPage: number;
}

const statePaint = reactive<StatePaint>({
  dataPaints: [],
  filterEmail: "",
  filterPaint: "",
  sorting: "asc",
  page: 1,
  perPage: 2,
});

export interface FireBasePaints {
  statePaint: DeepReadonly<typeof statePaint>;
  feedPaints: ComputedRef<DataPaint[]>;
  getFeedPaints: () => Promise<void>;
  setFilterValueEmail: (value: string) => void;
  uploadOnServer: (NameOfPaint: string, imageURL: string) => void;
  deleteUserPaint: (name: string, url: string, user: string) => void;
  setSortingValue: (value: string) => void;
  setFilterValuePaint: (value: string) => void;
  nextPage: () => void;
  backPage: () => void;
  goToPage: (numPage: number) => void;
  numberPage: ComputedRef<number>;
}

export const useFireBasePaints: () => FireBasePaints = () => {
  const { state } = useFireBase();

  const nextPage = () => {
    if (
      statePaint.page !==
      Math.ceil(feedPaints.value.length / statePaint.perPage)
    ) {
      statePaint.page += 1;
    }
  };
  const backPage = () => {
    if (statePaint.page !== 1) {
      statePaint.page -= 1;
    }
  };
  const goToPage = (numPage: number) => {
    statePaint.page = numPage;
  };

  const numberPage = computed(() => {
    return Math.ceil(feedPaints.value.length / statePaint.perPage);
  });

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
    if (statePaint.sorting === "asc") return items;
    else return items.reverse();
  });

  const setSortingValue = (value: string) => {
    statePaint.sorting = value;
  };

  const setFilterValueEmail = (value: string) => {
    statePaint.filterEmail = value;
  };

  const setFilterValuePaint = (value: string) => {
    statePaint.filterPaint = value;
  };

  const uploadOnServer = (NameOfPaint: string, imageURL: string) => {
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
            if (paint.urlOfPaint === url) id = index;
          }
        );

        statePaint.dataPaints.splice(id, 1);

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
    uploadOnServer,
    deleteUserPaint,
    setSortingValue,
    setFilterValuePaint,
    nextPage,
    backPage,
    goToPage,
    numberPage,
  };
};
