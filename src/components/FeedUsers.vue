<template>
  <div class="pt-6 ml-4">
    <div class="flex justify-start inline-grid gap-1 grid-cols-3 grid-rows-2">
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
        placeholder="name of paint"
        v-model="form.namePaint"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmitPaint" class="button-paint">Submit</button>
      <button @click="handleResetPaint" class="button-paint">Reset</button>

      <button
        class="button-asceding-desceding ml-4"
        @click="setSortingValue('asc')"
      >
        Ascending
      </button>
      <button
        class="button-asceding-desceding"
        @click="setSortingValue('desc')"
      >
        Descending
      </button>
    </div>
    <ModalWindow
      :open="isOpen"
      :urlOfpaint="urlOfpaint"
      :nameOfpaint="nameOfPaint"
      :nameOfUser="nameOfUser"
      :filterEmail="form.email"
      :filterNameOfPaint="form.namePaint"
      @open="(isOpened: boolean) => setOpen(isOpened)"
    />
    <div class="mdc-data-table">
      <div class="mdc-data-table__table-container">
        <table class="mdc-data-table__table" aria-label="paints">
          <tbody class="mdc-data-table__content">
            <tr class="mdc-data-table__row">
              <td
                class="mdc-data-table__cell"
                v-for="paint in paginatedData"
                :key="paint.toString"
              >
                <div>
                  <img
                    :src="paint.urlOfPaint"
                    @click="
                      goToPaint(
                        paint.urlOfPaint,
                        paint.nameOfPaint,
                        paint.userName
                      )
                    "
                    class="px-3 py-2 rounded-md border border-slate-400 w-11/12"
                  />
                  <div class="text-black w-full dark:text-white">
                    {{ paint.nameOfPaint }} {{ paint.date }}
                    {{ paint.userName }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mdc-data-table__pagination">
        <div class="mdc-data-table__pagination-trailing">
          <div class="mdc-data-table__pagination-rows-per-page">
            <div class="mdc-data-table__pagination-rows-per-page-label">
              Rows per page
            </div>
            <div
              class="
                mdc-select__menu
                mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth
              "
              role="listbox"
            >
              <ul class="mdc-list">
                <li
                  class="mdc-list-item mdc-list-item--selected"
                  aria-selected="true"
                  role="option"
                  data-value="10"
                >
                  <span class="mdc-list-item__text">2</span>
                </li>
                <li class="mdc-list-item" role="option" data-value="25">
                  <span class="mdc-list-item__text">4</span>
                </li>
                <li class="mdc-list-item" role="option" data-value="100">
                  <span class="mdc-list-item__text">6</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mdc-data-table__pagination-navigation">
          <div class="mdc-data-table__pagination-total">1‑10 of 100</div>
          <button
            class="
              mdc-icon-button
              material-icons
              mdc-data-table__pagination-button
            "
            data-first-page="true"
            disabled
          >
            <div class="mdc-button__icon">first_page</div>
          </button>
          <button
            class="
              mdc-icon-button
              material-icons
              mdc-data-table__pagination-button
            "
            data-prev-page="true"
            disabled
          >
            <div class="mdc-button__icon">chevron_left</div>
          </button>
          <button
            class="
              mdc-icon-button
              material-icons
              mdc-data-table__pagination-button
            "
            data-next-page="true"
          >
            <div class="mdc-button__icon">chevron_right</div>
          </button>
          <button
            class="
              mdc-icon-button
              material-icons
              mdc-data-table__pagination-button
            "
            data-last-page="true"
          >
            <div class="mdc-button__icon">last_page</div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-white">
    <button @click="backPage">prev</button>
    <button v-for="item in numberPage" :key="item" @click="goToPage(item)">
      {{ item }}
    </button>
    <button @click="nextPage">next</button>
  </div>
  <Loader :isLoading="loadingListener" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { useFireBase } from "../composables/useFireBase";
import Loader from "../components/staff/Loader.vue";
import ModalWindow from "./staff/ModalWindowPaint.vue";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const {
      getFeedPaints,
      feedPaints,
      setFilterValueEmail,
      setFilterValuePaint,
      setSortingValue,
      nextPage,
      backPage,
      goToPage,
      statePaint,
      numberPage,
    } = useFireBasePaints();
    const { state } = useFireBase();
    const form = ref({
      email: "",
      namePaint: "",
    });
    const loadingListener = ref();
    const isOpen = ref();
    const urlOfpaint = ref();
    const nameOfPaint = ref("");
    const nameOfUser = ref("");

    const paginatedData = computed(() => {
      return feedPaints.value.slice(
        (statePaint.page - 1) * statePaint.perPage,
        statePaint.page * statePaint.perPage
      );
    });

    const handleSubmitEmail = () => {
      setFilterValueEmail(form.value.email);
    };
    const handleResetEmail = () => {
      form.value.email = "";
      setFilterValueEmail("");
    };

    const handleSubmitPaint = () => {
      setFilterValuePaint(form.value.namePaint);
    };

    const handleResetPaint = () => {
      form.value.namePaint = "";
      setFilterValuePaint("");
    };

    const goToPaint = (
      urlPaint: string,
      namePaint: string,
      nameUser: string
    ) => {
      isOpen.value = true;
      urlOfpaint.value = urlPaint;
      nameOfPaint.value = namePaint;
      nameOfUser.value = nameUser;
    };
    const setOpen = (isOpened: boolean) => {
      isOpen.value = isOpened;
    };

    onMounted(() => {
      loadingListener.value = true;
      getFeedPaints().then(() => (loadingListener.value = false));
      isOpen.value = false;
      setSortingValue("asc");
    });

    return {
      handleSubmitEmail,
      form,
      handleResetEmail,
      feedPaints,
      goToPaint,
      state,
      loadingListener,
      setOpen,
      urlOfpaint,
      isOpen,
      nameOfPaint,
      nameOfUser,
      paginatedData,
      nextPage,
      backPage,
      goToPage,
      setSortingValue,
      handleSubmitPaint,
      handleResetPaint,
      numberPage,
    };
  },
  components: { Loader, ModalWindow },
});
</script>

<style>
@use "@material/icon-button";
@use "@material/data-table/data-table";
@include icon-button.core-styles;
@include data-table.core-styles;
@include data-table.theme-baseline;
</style>
