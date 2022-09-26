<template>
  <div class="view-role-page">
    <div
      class="flex justify-start inline-grid gap-1 grid-cols-3 grid-rows-2 h-14"
    >
      <input
        type="text"
        placeholder="email"
        v-model="form.email"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmitEmail" class="button-paint">Submit</button>
      <button @click="handleResetEmail" class="button-paint">Reset</button>

      <input
        type="text"
        placeholder="role"
        v-model="form.role"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmitRole" class="button-paint">Submit</button>
      <button @click="handleResetRole" class="button-paint">Reset</button>
    </div>

    <div class="roles">
      <Loader :isLoading="loadingListener" />
      <div
        v-for="user in paginatedData"
        :key="user.email"
        class="text-black dark:text-white"
      >
        Name:{{ user.email }}
        <div class="text-black dark:text-white">Role:{{ user.role }}</div>
        <button
          v-if="user.role === 'user'"
          @click="changeRole(user.email, user.role)"
          class="button-paint"
        >
          Set admin roles
        </button>
        <button
          v-else
          @click="changeRole(user.email, user.role)"
          class="button-paint"
        >
          Set user roles
        </button>
      </div>
    </div>

    <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-black">
      <div>
        <button
          class="
            text-white
            bg-blue-700
            hover:bg-blue-800
            focus:ring-4 focus:ring-blue-300
            rounded-lg
            text-sm
            px-1
            py-1
            text-center
            inline-flex
          "
          data-dropdown-toggle="dropdown"
          @click="setShowPagination(!showPagination)"
        >
          Choose amount of pictures
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          v-show="showPagination"
          class="
            bg-white
            text-base
            list-none
            divide-y divide-gray-100
            rounded
            shadow
          "
          id="dropdown"
        >
          <ul class="py-1 text-center" aria-labelledby="dropdown">
            <li
              v-for="perPage in arrayPerPageUsers"
              :key="perPage"
              @click="setPerPage(perPage)"
            >
              {{ perPage }}
            </li>
          </ul>
        </div>
      </div>

      <div>
        <button @click="backPage" class="pr-2">prev</button>
        <button
          v-for="item in numberPage"
          :key="item"
          @click="goToPage(item)"
          class="pr-2"
        >
          {{ item }}
        </button>
        <button @click="nextPage" class="pr-2">next</button>
      </div>
    </div>
  </div>
</template>
  
  
  
  <script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useFireBaseUsers } from "../composables/useFireBaseUsers";
import Loader from "../components/staff/Loader.vue";
import { arrayPerPageUsers } from "../types/index";

export default defineComponent({
  name: "RolesPage",
  components: { Loader },
  setup() {
    const {
      getListOfUsers,
      changeRoleOfUser,
      setFilterValueEmail,
      setFilterValueRole,
      filteredItems,
      nextPage,
      backPage,
      goToPage,
      stateUsers,
      numberPage,
      setPerPage,
    } = useFireBaseUsers();

    const form = ref({
      email: "",
      role: "",
    });
    const loadingListener = ref();
    const showPagination = ref(false);
    const setShowPagination = (isShowPagination: boolean) => {
      showPagination.value = isShowPagination;
    };

    const paginatedData = computed(() => {
      return filteredItems.value.slice(
        (stateUsers.page - 1) * stateUsers.perPage,
        stateUsers.page * stateUsers.perPage
      );
    });

    const handleSubmitEmail = () => {
      setFilterValueEmail(form.value.email);
    };
    const handleResetEmail = () => {
      form.value.email = "";
      setFilterValueEmail("");
    };

    const handleSubmitRole = () => {
      setFilterValueRole(form.value.role);
    };
    const handleResetRole = () => {
      form.value.role = "";
      setFilterValueRole("");
    };

    onMounted(() => {
      loadingListener.value = true;
      getListOfUsers().then(() => (loadingListener.value = false));
    });

    const changeRole = (nameOfUser: string, userRole: string) => {
      changeRoleOfUser(nameOfUser, userRole);
    };
    return {
      filteredItems,
      changeRole,
      form,
      handleSubmitEmail,
      handleResetEmail,
      handleSubmitRole,
      handleResetRole,
      paginatedData,
      nextPage,
      backPage,
      goToPage,
      numberPage,
      loadingListener,
      arrayPerPageUsers,
      setPerPage,
      showPagination,
      setShowPagination,
    };
  },
});
</script>
  