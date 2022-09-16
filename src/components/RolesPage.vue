<template>
  <div
    class="
      pt-6
      ml-4
      flex
      justify-center
      inline-grid
      gap-1
      grid-cols-1 grid-rows-3
    "
  >
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

    <div
      class="
        flex
        justify-center
        inline-grid
        gap-1
        grid-cols-3
        bg-white
        dark:bg-purple-900
        rounded-xl
        drop-shadow-lg
        p-10
      "
    >
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

    <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-white">
      <button @click="backPage">prev</button>
      <button v-for="item in numberPage" :key="item" @click="goToPage(item)">
        {{ item }}
      </button>
      <button @click="nextPage">next</button>
    </div>
  </div>
</template>
  
  
  
  <script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useFireBaseUsers } from "../composables/useFireBaseUsers";
import Loader from "../components/staff/Loader.vue";

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
    } = useFireBaseUsers();

    const form = ref({
      email: "",
      role: "",
    });
    const loadingListener = ref();

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
    };
  },
});
</script>
  