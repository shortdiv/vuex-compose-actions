import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

// fake API call //
let inventory = {
  chips: {
    stock: 10
  }
};

var pingInventory = function(item) {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve(inventory[item]);
    }, 3000);
  });
};

let machines = {
  bender: {
    last_serviced: "feb 2019",
    condition: "broken"
  }
};

export default new Vuex.Store({
  state: {
    machineName: "bender",
    supply: 10,
    isEmpty: false,
    isRestocking: false,
    isDispensing: false,
    isCheckingMachine: false
  },
  actions: {
    fetchFromInventory({ commit, dispatch }) {
      dispatch("checkMachineState").then(() => {
        commit("isRestocking", true);
        pingInventory("chips")
          .then(inventory => {
            commit("stockItems", inventory.stock);
          })
          .finally(() => commit("isRestocking", false));
      });
    },
    dispense({ state, commit }) {
      if (state.supply <= 0) {
        commit("isEmpty", true);
        return new Promise(() => {
          setTimeout(function() {
            commit("isEmpty", false);
          }, 3000);
        });
      } else {
        commit("isDispensing", true);
        setTimeout(() => {
          commit("dispense");
          commit("isDispensing", false);
        }, 3000);
      }
    },
    // create an action to check machine state //
    checkMachineState({ state, commit }) {
      commit("isCheckingMachine", true);
      return new Promise(resolve => {
        setTimeout(() => {
          commit("isCheckingMachine", false);
          resolve(machines[state.machineName]);
        }, 3000);
      });
    }
  },
  getters: {},
  mutations: {
    isRestocking(state, payload) {
      state.isRestocking = payload;
    },
    isDispensing(state, payload) {
      state.isDispensing = payload;
    },
    isCheckingMachine(state, payload) {
      state.isCheckingMachine = payload;
    },
    isEmpty(state, payload) {
      state.isEmpty = payload;
    },
    dispense(state) {
      state.supply--;
    },
    stockItems(state) {
      state.supply = 40;
    }
  }
});
