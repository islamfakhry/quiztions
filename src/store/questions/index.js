import fb from '@/services/firebase-facade'
import Vue from 'vue'
import mutations from '../mutation-types'
import router from "../../router";
import {showSnackbar} from "@/utils";

export default {
    namespaced: true,
    state: {
        questions: [],

    },
    mutations: {
        [mutations.APPEND_QUESTION](state, payload) {
            Vue.set(state.questions, payload.id, payload)
        },
    },
    actions: {

        async fetchQuestion({getters, state, commit}, {id}) {
            let question = state.questions[id]
            if (question) return question;
            try {
                // fetch from server
                const value = await fb.fetchResource('questions', id)
                question = {...value, id}
                commit(mutations.APPEND_QUESTION, question)
                return question
            } catch (err) {
                // otherwise show 404 page
                router.replace({name: 'not-found'})
                return null
            }
        },

        createQuestion({commit, state, rootState}, {question, rightAnswer, lessonId}) {
            return fb.createQuestion({question, rightAnswer, lessonId})
        },

        async deleteQuestion({commit, state, rootState}, {questionId, lessonId}) {
            const updates = {};
            updates['/questions/' + questionId] = null;
            updates['/lessons/' + lessonId + '/questions/' + questionId] = null;
            updates['/rightAnswers/' + questionId] = null;
            try {
                await fb.db.ref().update(updates);
            } catch (e) {
                if (e.code === "PERMISSION_DENIED") {
                    showSnackbar('You have no authentication to complete this process', 'error')
                    return
                }
                showSnackbar('Something went wrong', 'error')
            }
        },
    },
}
