const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const likes = blogs.reduce((total, current) => {
        return total + current.likes
    }, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    const mostLikes = blogs.reduce((biggest, current) => {
        return (biggest.likes < current.likes) ? current : biggest
    }, { likes: Number.NEGATIVE_INFINITY })
    return mostLikes
}

const mostBlogs = (blogs) => {
    const amountOfBlogs = { 'abdi': Number.NEGATIVE_INFINITY }
    blogs.forEach(element => {
        amountOfBlogs[element.author] = amountOfBlogs[element.author] + 1 || 1
    })
    const most = Object.keys(amountOfBlogs).reduce((most, current) => {
        return (amountOfBlogs[most] < amountOfBlogs[current]) ? current : most
    }, 'abdi')
    return { author: most, blogs: amountOfBlogs[most] }
}

const mostLikes = (blogs) => {
    const amountOfBlogs = { 'abdi': Number.NEGATIVE_INFINITY }
    blogs.forEach(element => {
        amountOfBlogs[element.author] = amountOfBlogs[element.author] + element.likes || element.likes
    })
    console.log(amountOfBlogs)
    const most = Object.keys(amountOfBlogs).reduce((most, current) => {
        return (amountOfBlogs[most] < amountOfBlogs[current]) ? current : most
    }, 'abdi')
    return { author: most, likes: amountOfBlogs[most] }
}



module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }