import moment from "moment";

//create the initial state
const initialState = {
  allCitiesData: [],
  locations: [],
  unmarkedLocations: [],
  city: {},
};

//action types
const LOAD_DATA = "LOAD_DATA";
const UPDATE_CITIES = "UPDATE_CITIES";
const UPDATE_LOCATIONS = "UPDATE_LOCATIONS";
const UPDATE_UNMARKED_LOCATIONS = "UPDATE_UNMARKED_LOCATIONS";
const SELECT_CITY = "SELECT_CITY";

//actions builder {dispatchers}
export function loadData(data) {
  return {
    type: LOAD_DATA,
    payload: data,
  };
}

export function updateCities(allCitiesData) {
  return {
    type: UPDATE_CITIES,
    payload: allCitiesData,
  };
}

export function updateLocations(locations) {
  return {
    type: UPDATE_LOCATIONS,
    payload: locations,
  };
}

export function updateUnmarkedLocations(unmarkedLocations) {
  return {
    type: UPDATE_UNMARKED_LOCATIONS,
    payload: unmarkedLocations,
  };
}

export function selectCity(name) {
  return {
    type: SELECT_CITY,
    payload: name,
  };
}

//reducer
export default function reducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case LOAD_DATA:
      let allCitiesData = {};
      let locations = [];
      let unmarkedLocations = [];

      action.payload.forEach((row) => {
        if (allCitiesData[row.name]) {
          allCitiesData[row.name].data.push({
            projected: row.projected,
            high: row.temp_max_c,
            mean: row.temp_mean_c,
            low: row.temp_min_c,
            date: moment(row.location_date).format("l"),
          });
        } else {
          allCitiesData[row.name] = {
            lon: row.Lon,
            lat: row.Lat,
            population: row.population,
            data: [],
          };

          if (!row.population) {
            unmarkedLocations.push(row.name);
          } else {
            locations.push({
              markerOffset: 25,
              name: row.name,
              coordinates: [row.Lon, row.Lat],
            });
          }
        }
      });
      return { ...state, allCitiesData, locations, unmarkedLocations };
    case UPDATE_CITIES:
      return { ...state, allCitiesData: action.payload };
    case UPDATE_LOCATIONS:
      return { ...state, locations: action.payload };
    case UPDATE_UNMARKED_LOCATIONS:
      return { ...state, unmarkedLocations: action.payload };
    case SELECT_CITY:
      let city = {};
      for (let key in state.allCitiesData) {
        if (key === action.payload) {
          city = { ...state.allCitiesData[key], name: key };
          break;
        }
      }
      return { ...state, city };
    default:
      return state;
  }
}

// Helper function
