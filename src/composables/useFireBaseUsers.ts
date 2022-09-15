import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../main";
import { reactive, DeepReadonly, computed, ComputedRef } from "vue";

export interface DataUser {
  email: string;
  role: string;
}

export interface StateUsers {
  dataUsers: DataUser[];
  filterEmailVal: string;
  filterRoleVal: string;
}

const stateUsers = reactive<StateUsers>({
  dataUsers: [],
  filterEmailVal: "",
  filterRoleVal: "",
});

export interface FireBaseUsers {
  stateUsers: DeepReadonly<typeof stateUsers>;
  getListOfUsers: () => Promise<void>;
  changeRoleOfUser: (userName: string, userRole: string) => void;
  filteredItems: ComputedRef<DataUser[]>;
  setFilterValueEmail: (value: string) => void;
  setFilterValueRole: (value: string) => void;
}

export const useFireBaseUsers: () => FireBaseUsers = () => {
  const getListOfUsers = () =>
    getDocs(collection(db, "users")).then((docs) => {
      docs.forEach((doc) => {
        let isPushed = false;

        stateUsers.dataUsers?.forEach((user) => {
          if (user.email === doc.data().name && user.role === doc.data().role)
            isPushed = true;
        });

        if (isPushed === false) {
          stateUsers.dataUsers.push({
            email: doc.data().name,
            role: doc.data().role,
          });
        }
      });
    });

  const changeRoleOfUser = (userName: string, userRole: string) => {
    let idOfUser: string;
    let changedUserRole: string;

    getDocs(collection(db, "users"))
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().name === userName) {
            idOfUser = doc.id;
          }
        });
      })
      .then(() => {
        if (userRole === "admin") changedUserRole = "user";
        else changedUserRole = "admin";

        setDoc(
          doc(db, "users", idOfUser),
          {
            role: changedUserRole,
          },
          { merge: true }
        );
      })
      .then(() => {
        stateUsers.dataUsers.forEach((user) => {
          if (user.email === userName) user.role = changedUserRole;
        });
      })
    }

    const filteredItems = computed(() => {
      if (stateUsers.filterEmailVal && stateUsers.filterRoleVal === "")
        return stateUsers.dataUsers.filter(
          (user: DataUser) => user.email === stateUsers.filterEmailVal
        );
      else if (stateUsers.filterEmailVal === "" && stateUsers.filterRoleVal)
        return stateUsers.dataUsers.filter(
          (user: DataUser) => user.role === stateUsers.filterRoleVal
        );
      else if (stateUsers.filterEmailVal && stateUsers.filterRoleVal)
        return stateUsers.dataUsers.filter(
          (user: DataUser) =>
            user.email === stateUsers.filterEmailVal &&
            user.role === stateUsers.filterRoleVal
        );
      return stateUsers.dataUsers;
    });

    const setFilterValueEmail = (value: string) => {
      stateUsers.filterEmailVal = value;
    };

    const setFilterValueRole = (value: string) => {
      stateUsers.filterRoleVal = value;
    };

  return {
    stateUsers: stateUsers,
    getListOfUsers,
    changeRoleOfUser,
    filteredItems,
    setFilterValueEmail,
    setFilterValueRole,
  };
}
  
