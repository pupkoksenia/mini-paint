<template>
  <div class="pt-6 ml-4 flex justify-center inline-grid gap-1 grid-cols-1 grid-rows-3">
    <div class="flex justify-start inline-grid gap-1 grid-cols-3 grid-rows-2 h-14">
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
        inline-grid gap-1 grid-cols-3 
        bg-white
        dark:bg-purple-900
        rounded-xl
        drop-shadow-lg
        p-10
      "
    >
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
    <button
      v-for="item in numberPage"
      :key="item"
      @click="() => goToPage(item)"
    >
      {{ item }}
    </button>
    <button @click="nextPage">next</button>
    </div>
  </div>
</template>
  
  
  
  <script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useFireBaseUsers } from "../composables/useFireBaseUsers";

export default defineComponent({
  name: "RolesPage",
  setup() {
    const {
      getListOfUsers,
      changeRoleOfUser,
      setFilterValueEmail,
      setFilterValueRole,
      filteredItems,
    } = useFireBaseUsers();

    const form = ref({
      email: "",
      role: "",
    });
    const page = ref(1);
    const perPage = ref(3);

    const paginatedData = computed(() => {
      return filteredItems.value.slice(
        (page.value - 1) * perPage.value,
        page.value * perPage.value
      );
    });
    const nextPage = () => {
      if (
        page.value !== Math.ceil(filteredItems.value.length / perPage.value)
      ) {
        page.value += 1;
      }
    };
    const backPage = () => {
      if (page.value !== 1) {
        page.value -= 1;
      }
    };
    const goToPage = (numPage: number) => {
      page.value = numPage;
    };

    const numberPage = computed(() => {
      return Math.ceil(filteredItems.value.length / perPage.value);
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
      getListOfUsers();
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
      perPage,
      numberPage,
    };
  },
});
</script>
  