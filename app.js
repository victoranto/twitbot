const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

//const url = "https://www.procyclingstats.com/rankings/me/teams"
const url = "https://www.procyclingstats.com/rankings/me/uci-teams-2020-2022"

async function scrapeData(){
  try {
    const { data } = await axios.get(url)

    const $ = cheerio.load(data)
    //const listItems = $("table.basic")

    let res = processCase2table($, ['br']);
	  
    return res

  } catch (error) {
    console.error(error)
  }
}

function processCase2table(cheerio_table_object, remove_tags=[] ){
	let columns = [];
	let items = {};
	
	cheerio_table_object('table.basic thead tr th').each((index, el) => { 
		columns.push(cheerio_table_object(el).text()); 
	});
	
	cheerio_table_object('table.basic tr').each((tr_index, tr) => {
		let item = {}; 
		cheerio_table_object('td:not([colspan])', tr ).each((index, td) => { 
			item[columns[index]] = cheerio.load(td).text(); 
		}); 
		if (Object.entries(item).length !== 0) {
			items[tr_index] = item;
		}
	});
	 
	return items;
}

module.exports.scrapeData = scrapeData

