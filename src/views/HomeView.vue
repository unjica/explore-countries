<script setup lang="ts">
import { useCountriesStore } from '@/stores/countries';
import type Country from "@/models/country";
const countryStore = useCountriesStore();
import Loader from "@/components/Loader.vue";
import { computed, onMounted, type Ref, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute()

const all_countries: Ref<Country[]> = ref([]);
const loading: Ref<loading> = ref(true);
const error: Ref<loading> = ref(false);

const region_filter: Ref<string> = ref('');
const search_string: Ref<string> = ref('');
const sort_by: Ref<'name'|'population'> = ref('name');
const sort_asc: Ref<boolean> = ref(true);

const page: Ref<number> = ref(Number(route.query.page)||1);
const countries_per_page = 50;

const regions: Ref<[]> = ref([]);

onMounted(async () => {
  await countryStore.getCountries()
    .catch(() => error.value = true)
    .finally(() => loading.value = false);

  all_countries.value = countryStore.countries;
  regions.value = [...new Set(countryStore.countries.map((country: Country) => country.region))]
})

const countries = computed(() => {
  return all_countries.value.filter((country: Country) => {
      return country.name.common.toLowerCase().includes(search_string.value.trim().toLowerCase())
        && country.region.toLowerCase().includes(region_filter.value.toLowerCase())
    }
  ).sort((a: Country, b: Country) => {
    if (sort_by.value === "name") {
      return sort_asc.value ? a.name.common.localeCompare(b.name.common) : b.name.common.localeCompare(a.name.common)
    } else {
      return sort_asc.value ? a.population - b.population : b.population - a.population
    }
  }).slice(0, page.value * countries_per_page)
})

const scrollHandler = (e) => {
  if (all_countries.value.length > page.value * countries_per_page) {
    let max_scroll_height = e.target.scrollHeight
    let scroll = e.target.scrollTop + e.target.offsetHeight

    let padding_bottom = 200

    if (max_scroll_height - scroll < padding_bottom) {
      page.value = page.value + 1
    }
  }
}
</script>

<template>
  <main class="w-full bg-white dark:bg-gray-800 text-black dark:text-white mx-auto" style="max-width: 1200px">
    <div class="m-5 -mt-5 px-3 py-1 bg-gray-200 dark:bg-gray-900 rounded-md w-fit text-sm">{{ countries.length }}</div>
    <div v-if="loading">
      <Loader />
    </div>
    <div class="flex flex-col items-center h-full">
      <div class="w-full">
        <div class="w-full flex items-center justify-between px-5 pb-5">
          <input type="text" placeholder="Search for countries" class="px-5 py-2 bg-gray-200 dark:bg-gray-900 rounded-md" v-model="search_string">

          <select v-model="region_filter" name="regions" id="regions" :class="!region_filter ? 'text-gray-500' : 'text-black dark:text-white'" class="px-5 py-2 bg-gray-200 dark:bg-gray-900 rounded-md">
            <option disabled selected value="">Filter by region</option>
            <option v-for="region of regions" :value="region">{{ region }}</option>
          </select>
        </div>

        <div class="flex items-center justify-between pr-7 pl-5 py-5 border-b dark:border-gray-700">
          <div @click="sort_by = 'name', sort_asc = !sort_asc" class="flex items-center cursor-pointer" :class="sort_by == 'name' ? '' : 'opacity-50'">
            <b>Country</b>
            <svg v-show="sort_by == 'name'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 ml-2" :class="sort_asc ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
          </div>
          <div @click="sort_by = 'population', sort_asc = !sort_asc" class="flex items-center cursor-pointer" :class="sort_by == 'population' ? '' : 'opacity-50'">
            <svg v-show="sort_by == 'population'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mr-2" :class="sort_asc ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
            <b>Population</b>
          </div>
        </div>
      </div>
      <div v-if="countries.length" @scroll="scrollHandler" class="w-full overflow-scroll pb-24">
        <div class="flex flex-col">
          <div v-for="country of countries" class="flex items-center w-full border-b border-gray-300 dark:border-gray-700 px-7 py-5">
            <span style="transform: scale(2)" class="mr-5">{{ country.flag }}</span>
            <span>{{ country.region }}, {{ country.name.common }}</span>
            <span class="ml-auto">{{ country.population.toLocaleString() }}</span>
          </div>
        </div>
      </div>
      <i v-else-if="error" class="p-10">Something went wrong. Try again later</i>
      <i v-else class="p-10">No countries found matching the keyword "{{ search_string }}".</i>
    </div>
  </main>
</template>
