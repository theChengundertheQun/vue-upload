import vueUpload from './vue-upload'

const upload = {
    install (Vue, options) {
        Vue.component(vueUpload.name, vueUpload)
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vueUpload)
}