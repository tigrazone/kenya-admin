

// localStorage Stuff

var loadState = function loadState(key) {

	console.log('loadState('+key+')');
  try {
    var serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

var saveState = function saveState(key, state) {
	/*
	console.log('saveState('+key+',')
	console.log(state)
	*/

  try {
	  if(state){
    var serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
	  }
	  else
		 localStorage.removeItem(key);

  } catch (err) {
    console.error('Something went wrong: ' + err);
  }
};





const mutations = {

  save_postsAStable (state, data) {
    state.postsAStable = data;
	saveState('postsAStable', data)
  },

  save_a_data (state, data) {
    state.a_data = data;
	saveState('a_data', data)
  },

  LOGIN (state, data) {
    state.usr = data;
	saveState(storageUSRkey, data);
  },

  LOGOUT (state) {
    state.usr = null;
	saveState(storageUSRkey, null);
  }
}


const getters = {
  isAuthenticated: state => {
    return !!state.usr
  }
}






var store = new Vuex.Store({
  strict: true,
  state: {
    usr: loadState(storageUSRkey) || null,
    a_data: loadState('a_data') || null,
    postsAStable: loadState('postsAStable') || null,
  },
  mutations: mutations,
  getters: getters
});
