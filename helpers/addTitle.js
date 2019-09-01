module.exports = (gender, name) => {
    if (gender === 'male') {
        return `Mr. ${name}`; 
    } else {
        return `Ms. ${name}`
    }
}