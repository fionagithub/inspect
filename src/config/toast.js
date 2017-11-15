import { Toast } from "quasar"
let types = {
    'positive': '',
    'negative': '',
    'info': '',
    'warning': '',
}

function toastBuff(patch, time, type) {
    if (type) {
        for (let i in types) {
            type == i
        }
    }
    let flag = type && type in types
    if (flag) {
        Toast.create[type]({
            html: patch,
            timeout: time
        });
    } else {
        Toast.create({
            html: patch,
            timeout: time
        });
    }
}
export default toastBuff