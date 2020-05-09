import Vue from 'vue';
import axios from 'axios';
import router from '../router';
import Qs from 'qs'

axios.defaults.withCredentials = true;
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response);
    // localStorage.setItem("authorization", response.headers.authorization)
    checkData(response)
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
// const BASE_URL = 'http://192.168.50.229/mingya-backend/public/api/admin';
// const COMMON_URL = 'http://192.168.50.229/mingya-backend/public';
// 测试机
const BASE_URL = 'http://127.0.0.1:8201/shares';
// const BASE_URL = 'http://10.1.161.102:20884';
const COMMON_URL = 'http://127.0.0.1:8201/shares';
// 生产
// const BASE_URL = 'http://192.168.48.194:9090';
// const COMMON_URL = 'http://192.168.48.194:9090';
var flag = true;

function checkData(data) {
    if (data.data.code == 200) {
        return data.data
    } else if (data.data.code == 2) {
        Vue.prototype.$Message.error(data.data.msg);
        router.push('/login');
    } else {
        console.log(data.data)
        return data.data
        Vue.prototype.$Message.error(data.msg);
    }
}

/**
 * 封装get请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myGet(url,params){
    return new Promise((resolve,reject) => {
        url = BASE_URL + url;
        axios.get(url,{
            params:params,
            headers:{
                token:localStorage.getItem('stockToken')
            }
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                Vue.prototype.$Message.error('服务器开小差了！');
            })
    })
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myPostBody(url,params){
    return new Promise((resolve,reject) => {
        url = BASE_URL + url;
        axios.post(url, params,{
            headers:{
                'token':localStorage.getItem('stockToken'),
                'content-type':'application/json'
            }
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                Vue.prototype.$Message.error('服务器开小差了！');
            })
    })
}
/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myPostForm(url,params){
    return new Promise((resolve,reject) => {
        url = BASE_URL + url;
        axios.post(url, Qs.stringify(params),{
            headers:{
                token:localStorage.getItem('token')
            }
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                Vue.prototype.$Message.error('服务器开小差了！');
            })
    })
}

/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
function myCommonPost(url, formdata) {
    return new Promise((resolve, reject) => {
        url = COMMON_URL + url;
        axios.get(url, formdata)
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                reject(err);
                console.log(err);
            })
    })
}

// 登录用
function myPostLogin(url, params) {
    return new Promise((resolve, reject) => {
        url = BASE_URL + url;
        axios.post(url, params, {
        })
            .then(res => {
                let data = checkData(res);
                if (data !== false) {
                    resolve(data);
                }
            })
            .catch(err => {
                if(flag) {
                    flag = false
                    Vue.prototype.$Message.error('登陆信息失效,请重新登陆！');
                    setInterval(() => {
                        flag = true
                    }, 500)

                }
                router.push('/login');
            })
    })
}
// ===============================================================================================================
// 登陆接口
export const login = params =>{
    return myPostLogin('/stock/login',params)
}
// 前端根据用户id获取全部观察数据
export const getAllStock = params => {
    return myGet('/stock/getAllStock', params)
};
// 保存stock数据
export const ioeStock = params =>{
    return myPostBody("/stock/ioeStock",params)
}
// 根据股票编号获取股票名称
export const getStockNameByStockNum = params =>{
    return myGet("/stock/getStockNameByStockNum",params)
}
// 删除观察的数据
export const deleteStock = params =>{
    return myPostForm("/stock/deleteStock",params)
}
//ee3f38cf88acecc5021c8eeab703caa5
