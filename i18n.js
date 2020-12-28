const NextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig
const path = require('path')

module.exports = new NextI18Next({
    otherLanguages: ['ko'],
    localeSubpaths,
    localePath: path.resolve('./public/static/locales'),
    ignoreRoutes: ["/_next/", "/static/", "/public/", "/api/", "/sitemap", "/robots.txt", "/fonts/"],
    //shallowRender: true //test
})