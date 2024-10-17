import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import type Country from "@/models/country";
export const useCountriesStore = defineStore('countries', () => {
  const countries: Ref<Country[]> = ref([]);

  async function getCountries() {
    try {
      countries.value = await fetch("https://restcountries.com/v3.1/all?fields=name,flag,population,region")
        .then((response) => response.json());
    } catch (error) {
      throw error;
    }
  }

  return { countries, getCountries };
});
