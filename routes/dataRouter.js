const express = require('express')
const puppeteer = require('puppeteer')

const Product = require('../models/productModel.js')
const router = express.Router()

const fs = require('fs')
const productLinks = JSON.parse(fs.readFileSync('./links.json', 'utf8'))

let browser
;(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  console.log('Here we go scrapping')
})()

router.get('/readLinks', async (req, res, next) => {
  const allProducts = []

  // for (let i = 0; i < productLinks.links.length; i++) {
  for (let i = 1360; i < productLinks.links.length; i++) {
    const productLink = productLinks.links[i]

    // console.log({ productLink })

    const newPage = await browser.newPage()
    await newPage.goto(productLink, {
      waitUntil: 'networkidle2',
      timeout: 0,
    })

    // console.log(`Current Product: ${i + 1}`)

    const info = await newPage.evaluate(() => {
      return {
        title: document.querySelector('h1[itemprop=name]')?.innerText,
        preview: document.querySelector('#bigpic').currentSrc,

        images: Array.from(document.querySelectorAll('a.fancybox img')).map(
          e => e.currentSrc
        ),

        price: parseFloat(
          document.querySelector('[itemprop="price"]').attributes.content.value
        ),

        reference: document.querySelector('#product_reference span[content]')
          ? document.querySelector('#product_reference span[content]').innerText
            ? document.querySelector('#product_reference span[content]')
                .innerText
            : undefined
          : undefined,

        description: document.querySelector('.table-data-sheet > tbody')
          ? Array.from(
              document.querySelector('.table-data-sheet > tbody').rows
            ).map(e => {
              const vartype = Array.from(e.children)[0].outerText
              const proper = Array.from(e.children)[1].outerText
              const returnVal = {}
              returnVal[vartype] = proper
              return returnVal
            })
          : [],

        category: 'manuel',

        ficheTechnique: Array.from(
          document.querySelectorAll('.page-product-box .rte ul li')
        ).map(e => e?.innerText),

        presentation: Array.from(
          document.querySelectorAll('.page-product-box .rte p')
        ).map(e => e?.innerText),

        shortDescription: document.querySelector('#short_description_content')
          ? Array.from(
              document.querySelector('#short_description_content').children
            ).map(e => e?.innerText)
          : [],
      }
    })

    await Product.create(info)
  }

  //2 Add it to DB
  // const productsDb = await Product.insertMany(allProducts)

  res.json({
    message: 'Hello',
    length: allProducts.length,
    // lengthDb: productsDb.length,
  })
})

module.exports = router
