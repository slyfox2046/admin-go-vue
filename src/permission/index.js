import authority from './Authority'

const install = function(Vue) {
  Vue.directive('authority', authority)
}

if (window.Vue) {
  window['authority'] = authority
  Vue.use(install); // eslint-disable-line
}

authority.install = install
export default authority
