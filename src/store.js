import { isLoggedIn, logOut } from "./components/shared/utils/auth"
import axios from 'axios'
import router from "./routes";
import firebase from 'firebase/app';



export default {
    // vuex store
    state: {
        env: '',
        isHomePage: true,
        lastSearch: {
            from: null,
            to: null,
        },
        basket: {
            items: []
        },
        isLoggedIn: false,
        isEmailVerified: true,
        userRole: "",
        user: {},
        userDBData: {},
        globalMessage: '',
        pricing: {
            pro: 99,
            basic: 29,
            gratis: 0
        }
    },
    // le mutations hanno solo il compito di mutare lo stato dell'app, sono
    // come semplici funzioni
    mutations: {
        setUser(state, payload) {
            state.user = payload
            localStorage.setItem('currentUser', JSON.stringify(payload))
        },
        setLoggedIn(state) {
            state.isLoggedIn = true
            localStorage.setItem('isLoggedIn', true);
            state.user = localStorage.getItem('currentUser')
        },
        setLoggedOut(state) {
            state.isLoggedIn = false
            localStorage.setItem('isLoggedIn', false);
            localStorage.setItem('currentUser', '')
            localStorage.setItem('pacchetto', '')
            state.user = ''
        },
        setEmailVerified(state, payload) {
            state.isEmailVerified = payload
        },
        registrationFromPacchettoSetLocal(state, payload) {
            state.pacchetto = payload.pacchetto
            localStorage.setItem('pacchetto', payload.pacchetto);
        },
        setGlobalMessage(state, payload) {
            state.globalMessage = payload
        },
    },

    // le actions mi chiamano le mutations e in più salvano nel local storage
    // di modo che anche al refresh i dati rimangano salvati
    actions: {

        //####################### test ##############################

        async testAxiosGet({ commit, dispatch }, payload) {
            return axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/test`
                , {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        // 'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    console.log(res);
                })

        },

        async testAxiosPost({ commit, dispatch }, payload) {
            var params = {
                nome: 'test',
            };
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/register`,
                params,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        // 'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    console.log(res);
                })

        },

        //####################### auth ##############################

        async recaptcha({ commit, dispatch }, payload) {
            console.log(payload);
            var params = {
                'token': payload.recaptchaToken
            }
            var res = await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/recaptchaVerify`,
                params,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    }
                }).then(res => {
                    console.log(res);
                    return res
                })
                .catch(err => {
                    console.log(err);
                    return err
                })
            return res
        },
        async registration({ commit, dispatch }, payload) {
            console.log(payload);
            var params = {
                'name': payload.name,
                'email': payload.email,
                'password': payload.password,
                'passwordConfirm': payload.passwordConfirm,
            };
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/register`,
                params,
                {
                    headers: {
                        // 'Content-type': 'application/json',
                        // "Access-Control-Allow-Origin": "*",
                        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    }
                }).then(res => {
                    console.log(res);

                    dispatch("sendSendGridEmailSignUp", { template_id: 'signup', user_email: payload.email, token: res.data.token.token, verifyEmailHash: res.data.cryptUrlCode })

                    //TODO:
                    var pacchetto = payload.pacchetto;

                    if (pacchetto) {
                        dispatch('sendContractEsignature', {
                            name: payload.name,
                            email: payload.email,
                            phone: payload.phone,
                        })
                    }
                    return res
                }).then((result) => {
                    console.log('RESULTTTT')
                    console.log(result)

                    dispatch('signOut', { signoutType: 'signup', signupToken: result.data.token.token })
                })
                .catch(err => {
                    console.log(err);
                    commit('setGlobalMessage', err.message);
                })
        },
        async login({ commit, dispatch }, payload) {
            console.log(payload);
            console.log('LOGGINN');

            var params = {
                'email': payload.email,
                'password': payload.password,
            };
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/login`,
                params,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    }
                }).then(res => {
                    console.log(res);

                    //TODO:
                    var email_verified = res.data.user.email_verified
                    var user_type = 'host'
                    var contract_status = 'contract-signed'

                    if (!email_verified) {
                        dispatch("signOut", { signoutType: 'mail_unverified' });
                        return
                    }
                    if (user_type != 'host') {
                        dispatch("signOut", { signoutType: 'wrong_user_driver' });
                        return
                    }
                    if (contract_status != 'contract-signed') {
                        dispatch("signOut", { signoutType: 'contract_not_signed' });
                        return
                    }

                    commit('setUser', { user: res.data.user, token: res.data.token.token })
                    commit('setLoggedIn')
                    router.replace({ name: "dashboard" });

                    commit('setGlobalMessage', `Benvenuto ${res.data.user.email}`)

                    setTimeout(() => {
                        commit('setGlobalMessage', '')
                    }, 3000)

                })
                .catch(err => {
                    console.log(err);
                    commit('setGlobalMessage', err.message);
                })
        },

        async sendSendGridEmailSignUp({ commit, dispatch }, payload) {
            const confirmUrl = `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/verifyEmail?c=${encodeURIComponent(payload.verifyEmailHash)}`
            await axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/sendSendGridEmailSignUp?template_id=${payload.template_id}&user_email=${payload.user_email}&confirm_url=${confirmUrl}`
                , {
                    headers: {
                        'Authorization': `Bearer ${payload.token}`
                    }
                })
        },
        async sendContractEsignature({ commit, dispatch }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            // var params = { "template_id": "74a62c7a-6cb5-4b3e-a223-6cdaaa25be71", "signers": [{ "name": 'test', "email": 'testemail@mail.mail', "mobile": 'testphone8127631' }], "placeholder_fields": [{ "api_key": "preferred_term", "value": "24 months" }], "test": "yes" };
            var params = { "template_id": "74a62c7a-6cb5-4b3e-a223-6cdaaa25be71", "signers": [{ "name": `${payload.name} ${payload.last_name}`, "email": payload.email, "mobile": payload.phone }], "placeholder_fields": [{ "api_key": "preferred_term", "value": "24 months" }], "test": "yes" };
            await axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/sendContractEsignature?params=${JSON.stringify(params)}`
                , {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }
                })
            // console.log(res);
        },

        async loadLoginStateAfterRefresh({ commit, dispatch }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            console.log(token);
            if (token) {
                await axios.get(
                    `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/check-login`,
                    {
                        headers: {
                            'Content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*",
                            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => {
                        console.log('is logged in???');
                        console.log(res.data.isLoggedIn);
                        if (res.data.isLoggedIn) {
                            commit('setLoggedIn')
                        } else {
                            commit('setLoggedOut')
                        }
                    }).catch(err => {
                        commit('setLoggedOut')
                        if (router.currentRoute.name == 'dashboard') {
                            router.push('/')
                        }
                    })
            } else {
                commit('setLoggedOut')
                if (router.currentRoute.name == 'dashboard') {
                    router.push('/')
                }
            }
        },

        async signOut({ commit, dispatch }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            if (payload.signupToken) token = payload.signupToken
            await axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/logout`,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }

                })
                .then((res) => {
                    console.log(res);

                    commit('setLoggedOut')
                    commit('setUser', {})
                    commit('setUserRole', '')

                    if (payload.signoutType == 'normal') commit('setGlobalMessage', `Log out avvenuto con successo`)

                    if (payload.signoutType == 'signup') commit('setGlobalMessage', `Registrazione avvenuta con successo: verifica la tua mail`)

                    if (payload.signoutType == 'mail_unverified') commit('setGlobalMessage', `Verifica prima la tua email`)
                    if (payload.signoutType == 'contract_not_signed') commit('setGlobalMessage', `Per accedere devi accettare il contratto`)
                    if (payload.signoutType == 'wrong_user_driver') commit('setGlobalMessage', `L'accesso a questa dashboard è consentito solo ad utenti di tipo host`)

                    if (router.currentRoute.name !== 'home') {
                        router.replace({
                            name: "home"
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
        },

        forgotPassword({ commit, dispatch }, payload) {

            // if (!payload) {
            //     return "Please type in a valid email address.";
            // }
            // firebase
            //     .auth()
            //     .sendPasswordResetEmail(payload.email)
            //     .then(() => {
            //         commit('setGlobalMessage', `Controlla la tua email`)

            //         router.replace({
            //             name: "home"
            //         });
            //         return true;
            //     })
            //     .catch(error => {
            //         return error.message;
            //     });

        },
        closeGlobalSnackbar({ commit, dispatch }) {
            commit('setGlobalMessage', false)
        },
        registrationFromPacchetto({ commit, dispatch }, payload) {
            commit('registrationFromPacchettoSetLocal', payload)
        },




        //###################### storage firebase ##########################

        // questa funzione rappresenta il caricamento asincrono di un file
        // solo rendendo il caricamento una Promise, posso aspettare che si carichi una foto e poi passare a un altra
        async uploadIdentityDocument({ commit, dispatch }, payload) {
            const downloadMediaUrls = [];
            // console.log(payload);
            if (payload.media.length <= 2) {
                for (let i = 0; i < payload.media.length; i++) {
                    var file = payload.media[i];
                    var uploadTask = await new Promise(function (resolve, reject) {
                        // console.log(file);
                        // Create a root reference
                        var storageRef = firebase.storage().ref();
                        // Create the file metadata
                        var metadata = {
                            contentType: file.type,
                        };
                        // Upload file and metadata to the object 'images/mountains.jpg'
                        var uploadTask_user = storageRef
                            .child(`users/${payload.uid}/host_id_${payload.uid}_${i}`)
                            .put(file, metadata);
                        var uploadTask_staging = storageRef
                            .child(`uploads/staging/host_id_${payload.uid}_${i}`)
                            // .child(`test/host_id_${payload.uid}_${i}`)
                            .put(file, metadata);
                        resolve(uploadTask_user, uploadTask_staging);
                    });
                    // console.log(uploadTask);
                    var url = await uploadTask.ref
                        .getDownloadURL()
                        .then(function (downloadURL) {
                            // console.log("File available at", downloadURL);
                            return downloadURL;
                        });
                    downloadMediaUrls.push(url);
                    // console.log("---");
                    // console.log(downloadMediaUrls);
                    // console.log("---");
                }
            }
            // console.log(downloadMediaUrls);
            return true;
        },


        //###################### crud ##########################



        async getUser({ commit, state }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            return axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/getUser`
                , {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    // console.log(res.data);
                    return res.data
                })
        },
        async editUser({ commit, dispatch }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            console.log(payload);
            var params = payload;
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/saveUser`,
                params,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(() => {
                    commit('setGlobalMessage', 'Dati utente aggiornati con successo')
                })
        },
        
        
        async getUserGarage({ commit, state }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            return axios.get(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/getGarage`
                , {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    // console.log(res.data);
                    return res.data
                })


        },
        async editGarage({ commit, dispatch }, payload) {
            var token;
            if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
            console.log(payload);
            var params = payload;
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/saveGarage`,
                params,
                {
                    headers: {
                        'Content-type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(() => {
                    commit('setGlobalMessage', 'Dati box aggiornati con successo')
                })
        },


        async iscrivitiNewsletterSaveMail({ commit, dispatch }, payload) {
            console.log(payload);
            var params = {
                emailNewsletter: payload
            };
            await axios.post(
                `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/iscrivitiNewsletterSaveMail`,
                params,
                {
                    headers: {
                    }
                }).then(() => {
                    commit('setGlobalMessage', 'Complimenti! Ti sei iscritto alla nostra newsletter.')
                })
        },

        async selectPacchettoDashboard({ commit, state, dispatch }, payload) {

            var user = await dispatch('getUser')
            console.log(user)

            if (!user.pacchetto) {

                dispatch('sendContractEsignature', user)

                var token;
                if (localStorage.getItem('currentUser')) token = JSON.parse(localStorage.getItem('currentUser'))?.token
                await axios.post(
                    `${process.env.VUE_APP_ADONIS_API_ENDPOINT}/api/setUserPacchetto`,
                    { pacchetto: payload.pacchetto },
                    {
                        headers: {
                            'Content-type': 'application/json',
                            "Access-Control-Allow-Origin": "*",
                            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(() => commit('setGlobalMessage', 'Pacchetto selezionato correttamente, riceverai il contratto da firmare alla tua email'))
            } else {
                commit('setGlobalMessage', 'Pacchetto gia selezionato')
            }
        },




        async removeUser({ commit, dispatch }, payload) {
            // var user = firebase.auth().currentUser;
            // db.collection('users')
            //     .doc(user.uid)
            //     .delete()

            // user.delete().then(function () {
            //     router.push({
            //         // name: "home",
            //     });
            //     commit('setGlobalMessage', 'successfully removed user')

            // }).catch(function (error) {
            //     // An error happened.
            // });
        },

    },

}
