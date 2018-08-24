const https = require('https')
const iconv = require('iconv-lite')
const cheerio = require("cheerio")

const public_headers = { // template of headers
    // "authority": "item.taobao.com", // required to change by arguments of user's
    "method": "GET",
    // "path": "/item.htm?id=555185159656", // required to change by arguments of user's
    "scheme": "https",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    // "accept-encoding": "gzip, deflate, br", // fucked one, i'am lazy to unpack gzip file, fuck ali88
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "max-age=0",
    "cookie": "hng=CN%7Czh-CN%7CCNY%7C156; t=beb03ff66f121aa4385979a68a56b964; _tb_token_=edde357e3beae; cookie2=15ce370d7bd9c93a69b851c7aedbd6e4; cna=ykUAFBtTwwUCAX1QhM83eUvr; dnk=tb18693699; uc1=cookie14=UoTfL8JpbgymRA%3D%3D&lng=zh_CN&cookie16=Vq8l%2BKCLySLZMFWHxqs8fwqnEw%3D%3D&existShop=false&cookie21=URm48syIYn73&tag=8&cookie15=UtASsssmOIJ0bQ%3D%3D&pas=0; uc3=vt3=F8dBzrtqAdZ6uVKgafI%3D&id2=VyySXQ5DhHg8JA%3D%3D&nk2=F5RENngahWoVVQ%3D%3D&lg2=U%2BGCWk%2F75gdr5Q%3D%3D; tracknick=tb18693699; lid=tb18693699; _l_g_=Ug%3D%3D; unb=4033370409; lgc=tb18693699; cookie1=Vqgq9W1GWtiuQNAFnfeTCyCSVnNv3mSFvtB08%2FS4Dug%3D; login=true; cookie17=VyySXQ5DhHg8JA%3D%3D; _nk_=tb18693699; sg=996; csg=ef7040b1; cq=ccp%3D0; otherx=e%3D1%26p%3D*%26s%3D0%26c%3D0%26f%3D0%26g%3D0%26t%3D0; swfstore=290787; x=__ll%3D-1%26_ato%3D0; _m_h5_tk=2c385c149617568a66297ded466d3884_1534874121753; _m_h5_tk_enc=0824729dd43f521b0146b97cae6a6e82; pnm_cku822=098%23E1hvL9vUvbpvUvCkvvvvvjiPPsF90jlWPFzWlj1VPmP9zjDRRLLWgjY8nLcwQjtniQhvCvvv9UUtvpvhvvvvvvhCvvOvCvvvphmtvpvIvvvvFZCvvRQvvURkphvWfQvv96CvpC29vvm2IyCvhjpvvURkphvpa8yCvv9vvUmAjLKERIyCvvOUvvhCaygEvpCW2W3wvva4%2BExrl8TJEcqwafknnbvAwf0BDpZTHmx%2F0j7y%2Bb8raAd6D7zZdiE67Exr1j7J%2B3%2B%2BafmDYEu4wymQ0f0DW3CQog0HsXZpevGCvvpvvPMM; whl=-1%260%260%260; isg=BF1dYxHI2oA5kL6raoiGdf4MbDCX0pHL2mPw6R8iirTj1n0I5ci8nD0MBIr1FqmE",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
}
const public_option = { // template of option
    // host: "item.taobao.com", // required to change by arguments of user's
    port: 443,
    // path: "/item.htm?id=555185159656", // required to change by arguments of user's 
    method: "GET", 
    // headers: Headers // required to change by arguments of user's 
}
let getContentWithUrl_TB_TM = (url, isGBK, handle, isShopLink_or_isPriceLink, refererLink) => {
    let this_headers = Object.assign({}, public_headers); // get new headers by copy the 'public_headers'
    let this_option = Object.assign({}, public_option); // get new option by copy the 'public_option'
    let taobao_or_tianmao = url.split(".")[1]; // the url is taobao or tianmao
    if (isShopLink_or_isPriceLink === 1) { // is 'price_link' ?
        let where_id_in_url = refererLink.match(/id=(.*?)&/); // get the postion of id in the refererLink, and it's a match object
        let id;
        if (where_id_in_url) {
            id = where_id_in_url[1]
        } else if (!where_id_in_url) { // if the id is last of the refererLink or the refererLink only have id
            let idIndex = refererLink.match(/id=(.*?)/).index // index of "id=" in url
            id = url.substring(idIndex + 3, url.length)
        }

        let taobao_or_tianmao = url.split("://")[1].split(".")[0] === "mdskip" ? "tmall" : "taobao"; // the url is taobao or tianmao for 'price_link'
        if (taobao_or_tianmao === "tmall") { // if the url is tianmao
            this_headers["authority"] = "mdskip.taobao.com" // price link on taobao host
            this_headers["path"] = url.split("mdskip.taobao.com")[1] + "?itemId=" + id // get path
            this_headers["referer"] = refererLink
    
            this_option["host"] = "mdskip.taobao.com" // shop link on taobao host
            this_option["path"] = url.split("mdskip.taobao.com")[1] + "?itemId=" + id // get path
            this_option["headers"] = this_headers // set headers in 'public_option'
        } else if (taobao_or_tianmao === "taobao") { // else if the url is taobao
            this_headers["authority"] = "detailskip.taobao.com" // price link on taobao host
            this_headers["path"] = url.split("detailskip.taobao.com")[1] + "&itemId=" + id // get path
            this_headers["referer"] = refererLink
    
            this_option["host"] = "detailskip.taobao.com" // shop link on taobao host
            this_option["path"] = url.split("detailskip.taobao.com")[1] + "&itemId=" + id // get path
            this_option["headers"] = this_headers // set headers in 'public_option'
        } else {
            console.error("getContentWithUrl_TB_TM--[ERROR] bad url")
            return // failed to call this function
        }
    } else if (isShopLink_or_isPriceLink === 2) { // is shop_link ?
        this_headers["authority"] = "rate.taobao.com" // shop link  on taobao host
        this_headers["path"] = "/" + url.split("/")[3] // get path
        this_headers["referer"] = refererLink

        this_option["host"] = "rate.taobao.com" // shop link  on taobao host
        this_option["path"] = "/" + url.split("/")[3] // get path
        this_option["headers"] = this_headers // set headers in 'public_option'
    } else { // else not shop_link ?
        // preparation of headers and option
        if (taobao_or_tianmao === "tmall") { // if the url is tianmao
            this_headers["authority"] = "detail.tmall.com"
            this_option["host"] = "detail.tmall.com"
        } else if (taobao_or_tianmao === "taobao") { // else if the url is taobao
            this_headers["authority"] = "item.taobao.com"
            this_option["host"] = "item.taobao.com"
        } else {
            console.error("getContentWithUrl_TB_TM--[ERROR] bad url")
            return // failed to call this function
        }

        let where_id_in_url = url.match(/id=(.*?)&/); // get the postion of id in the url, and it's a match object
        let id;
        if (where_id_in_url) {
            id = where_id_in_url[1]
        } else if (!where_id_in_url) { // if the id is last of the url or the url only have id
            let idIndex = url.match(/id=(.*?)/).index // index of "id=" in url
            id = url.substring(idIndex + 3, url.length)
        }
        if (id) {
            this_headers["path"] = "/item.htm?id=" + id
            this_option["path"] = "/item.htm?id=" + id
        } else {
            console.error("getContentWithUrl_TB_TM--[ERROR] bad url: id not found")
            return // failed to call this function
        }

        this_option["headers"] = this_headers // set headers in 'public_option'
    }

    // get content from web
    https.get(this_option, (res) => { // get data...
        console.log(`status code: ${res.statusCode}`); // print http state code
        let data = ''; // required to give caller
        res.on('data', (chunk) => { // each event named 'data'
            if (isGBK) { // should decode ?
                data += iconv.decode(chunk, 'GBK') // decode by iconv // thanks iconv and the blog with iconv i saw very very very match !!!
            } else { // should not decode ?
                data += chunk // no decoding
            }
        })
        res.on('end', () => { // this event means the end of request
            handle(data) // callback the function with result
        })
    }).on('error', (e) => { // if err ... 
        console.log(`http error: ${e.message}`); // print the err message
    })
}

const getData_tianmao = (url, fn) => {
    getContentWithUrl_TB_TM(url,true,(html) => {
        html = html.replace(/[\r\n]/g, "").trim(); // this html with out '\r\n'
        let $ = cheerio.load(html); // preparation of cheerio
        let $textarea = cheerio.load($("textarea").text()) // preparation of cheerio to get 'shop_link' in textarea (the text of textarea is html)
        let tsShopSetupObject = html.match(/TShop.Setup\((.*?)<\/script>/)[1].
                substring(0, html.match(/TShop.Setup\((.*?)<\/script>/)[1].length-8).trim(); // this is object with baby information
        let title = JSON.parse(tsShopSetupObject).itemDO.title;  // this is title of baby on tmall
        let brand = JSON.parse(tsShopSetupObject).itemDO.brand; // this is brand of baby on tmall
        let shop_name = $(".slogo-shopname").children("strong").text(); // this is shop name
        let shop_link = $textarea(".shopkeeper").children("div").children("a").attr("href") // this is shop link of baby on tmall
        shop_link = "https:" + shop_link; // this is shop link with 'https'
        let image_urls = JSON.parse(tsShopSetupObject).propertyPics.default; // this is image urls of baby on tmall
        image_urls.map((urlItem, index) => {
            image_urls[index] = "https:" + urlItem; // get real url with full size and 'https'
        })
        let price
        let type
        getContentWithUrl_TB_TM(shop_link, false, (data) => {
            let utf8data = iconv.encode(data, "utf-8") // decode html with utf-8
            let shop$ = cheerio.load(utf8data); // preparation of cheerio
            type = shop$(".info-block-first").eq(0).children("ul").children("li").children("a").text().trim(); // this is the type of baby on taobao
            getContentWithUrl_TB_TM("http://mdskip.taobao.com/core/initItemDetail.htm", true, (priceData) => {
                let priceInfoObj = JSON.parse(priceData).defaultModel.itemPriceResultDO.priceInfo; // this is object about price information of baby on tmall
                let priceArry = []; // this is arry include all price of baby on tmall (the same baby has very very many edition)
                Object.keys(priceInfoObj).map(priceInfoKeyItem => {
                    let priceItem = priceInfoObj[priceInfoKeyItem].price  // this is price of each edition of baby on tmall
                    priceArry.push(priceItem)   
                })
                priceArry = priceArry.sort() // let the 'priceArry' item from small to large
                price = `${priceArry[0]} - ${priceArry[priceArry.length - 1]}` // set price valued the price on the static page
                fn (title, price, type, image_urls, shop_name, brand) // callback function to give caller title, price, type and image urls
            }, 1, url)
        }, 2, url)
    })
}

const getData_taobao_no_new = (url, fn) => {
    getContentWithUrl_TB_TM(url,true,(html) => {
        let utf8str = iconv.encode(html, "utf-8") // decode html with utf-8
        let $ = cheerio.load(utf8str); // preparation of cheerio
        let title = $(".tb-main-title").attr("data-title"); // this is title of baby on taobao
        let brand
        $(".attributes-list").children("li").each(function() {
            if ($(this).text().indexOf("品牌") !== -1) { // if the element has word 'brand', It's brand-about element
                brand = $(this).attr("title") // this is brand of baby on taobao
            }
        })
        let shop_name = $(".tb-shop-name").children("dl").children("dd").children("strong").children("a").text().trim() // this is shop name
        let shop_link = $(".tb-shop-rank").children("dl").children("dd").children("a").attr("href"); // this is shop link of baby on taobao
        shop_link = "https:" + shop_link; // this is shop link with 'https'
        let static_price = $(".tb-rmb-num").text() // this is price on the static page, it's used to callback when price api return 'ITEM_NOT_FOUND'
        let image_urls = []; // this is image urls of baby on taobao
        let price;
        let type;
        $(".tb-thumb").children("li").children("div").children("a").children("img").each(function(item) { // to get image urls.
            let url = $(this).attr("data-src"); // url i got
            if (url.indexOf(".jpg") + 4 == url.length) { // if url is png
                url = url.substring(0, url.indexOf(".png") + 4); // sub url to get full size image
            } else { // if url is jpg
                url = url.substring(0, url.indexOf(".jpg") + 4); // sub url to get full size image
            }
            url = "https:" + url; // get real url with full size and 'https'
            image_urls.push(url); // push this real_url to url array named 'image_urls'
        })
        getContentWithUrl_TB_TM(shop_link, false, (data) => {
            let utf8data = iconv.encode(data, "utf-8") // decode html with utf-8
            let shop$ = cheerio.load(utf8data); // preparation of cheerio
            type = shop$(".info-block-first").eq(0).children("ul").children("li").children("a").text().trim(); // this is the type of baby on taobao
            getContentWithUrl_TB_TM("https://detailskip.taobao.com/service/getData/1/p1/item/detail/sib.htm?modules=price", false, (priceData) => {
                if (JSON.parse(priceData).data) { // if price api returned normal data
                    price = JSON.parse(priceData).data.price // get price from taobao price api
                } else { // if price api returned 'ITEM_NOT_FOUND'
                    price = static_price // set price valued the price on the static page
                }
                fn (title, price, type, image_urls, shop_name, brand) // callback function to give caller title, price, type and image urls
            }, 1, url)
        }, 2, url)
    })
}

let get = (url, fn) => {
    let taobao_or_tianmao = url.split(".")[1]; // the url is taobao or tianmao
    if (taobao_or_tianmao === "taobao") {
        getData_taobao_no_new(url, fn)
    } else if (taobao_or_tianmao === "tmall") {
        getData_tianmao(url, fn)
    }
}

module.exports = {get}