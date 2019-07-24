function validate(userAnswer, question, isValidateRemotely = false) {
    if(! isValidateRemotely){
        return validateLocally(userAnswer, question)
    }else{
        return validateRemotely(userAnswer, question)

    }
}

function validateLocally(userAnswer, question) {
    return arraysEqual(userAnswer, question.rightAnswer)

}

// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
async function validateRemotely(userAnswer, question)
{
    await wait(2000)
    return true

}


function arraysEqual(a1, a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) == JSON.stringify(a2);
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}
export default {
    validate,
    validateRemotely,
}
