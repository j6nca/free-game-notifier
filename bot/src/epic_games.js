const axios = require('axios');
require('dotenv').config()
// Endpoint for epic games freebies
const epic_url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CA&allowCountries=CA"
const page_base = "https://store.epicgames.com/en-US/p/"
const redirect_base = "https://freebies.j6n.ca/redirect?game="
// Configs
// Set whether or not to show upcoming sale games Format: SEND_UPCOMING=true/false
const sendUpcoming = process.env.SEND_UPCOMING === "true";
// Set the target discord server(s) here. Format: DISCORD_WEBHOOK=url1,url2 ...
const discord_webhook = process.env.DISCORD_WEBHOOK
// Enable/disable notifications (primarily for testing) default: true
const notify = process.env.NOTIFY === undefined ? true : process.env.NOTIFY === "true"

async function check_store() {
  const res = await axios.get(epic_url);
  // const res_json = JSON.stringify(res.data)
  // console.log(res_json)
  // console.log(res.data.data.Catalog.searchStore.elements)
  const games = res.data.data.Catalog.searchStore.elements
  var game_list = []
  games.forEach((game) => {
    console.log(game)
    var skip = true
    const title = game.title
    console.log(game.title)
    const slug = game.catalogNs.mappings != null ? game.catalogNs.mappings[0].pageSlug : "error"
    console.log(slug)
    var original_price = game.price.totalPrice.fmtPrice.originalPrice
    original_price = parseFloat(original_price.replace(/[^0-9\.]+/g,"")).toFixed(2).toString()
    const publisher = game.seller.name
    const description = game.description
    var thumbnail = game.keyImages != null ? game.keyImages[0].url : "error"
    var start_date = null
    var end_date = null

    // Check if game is currently ON SALE
    if (game.price.lineOffers[0].appliedRules[0] != null) {
      end_date = game.price.lineOffers[0].appliedRules[0].endDate
      skip = false
    }

    // Use second image so its not the default gift image from epic
    if (game.keyImages[1] != null) {
      thumbnail = game.keyImages[1].url
    }

    // If game is projected to be ON SALE soon
    if (game.promotions != null) {
      // 12 Days of Christmas it seems to be using this check
      if (game.promotions.promotionalOffers[0] != null) {
        end_date = game.promotions.promotionalOffers[0].promotionalOffers[0].endDate
        skip = false
      }
      if (game.promotions.upcomingPromotionalOffers[0] != null) {
        if (game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0] != null) {
          start_date = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate
          skip = false
        }
      }
    }

    // Skip if it is 'Mystery Game'
    if (game.title == "Mystery Game") {
      skip = true
    }

    // Skip any false-positives (may just be on sale, or non-updated)
    if (game.price.totalPrice.discountPrice != 0){
      skip = true
    }
    
    if (!sendUpcoming && end_date == null){
      skip = true
    }
    
    if (!skip) {
      const found_game = {
        title: title,
        url_slug: slug,
        original_price: original_price,
        publisher: publisher,
        description: description,
        thumbnail: thumbnail,
        start_date: start_date,
        end_date: end_date,
      }
      game_list.push(found_game)
    }
  })
  const ordered_game_list = game_list.sort(
    function(a, b) {
      return (a.end_date === null) - (b.end_date === null) || +(a > b) || -(a < b);
    })

  return ordered_game_list
}

function format_message(game) {
  const now_colour = 5174599
  const coming_soon_colour = 15844367
  const now_text = "End Date"
  const coming_soon_text = "Start Date"
  const message = [
    {
      title: `[${game.start_date == null ? "NOW" : "COMING SOON"}] ${game.title}`,
      url: page_base + game.url_slug,
      color: `${game.start_date == null ? now_colour : coming_soon_colour}`,
      image: {
        url: game.thumbnail
      },
      fields: [
        {
          name: "Publisher",
          value: `${game.publisher}`,
        },
        {
          name: "Original Price",
          value: `~~$${game.original_price}~~`,
        },
        {
          name: "Description",
          value: `${game.description}`
        },
        {
          name: `${game.start_date == null ? now_text : coming_soon_text}`,
          value: `${game.start_date == null ? game.end_date : game.start_date}`
        },
        {
          name: '',
          value: `[Open in Epic Launcher](${redirect_base + game.url_slug})`
        },
      ],
    },
  ];
  return message
}

function send_discord(game, webhook) {
  console.log("=====================================================")
  console.log(game.title)
  // console.log(game.publisher)
  // console.log(game.original_price)
  // console.log(game.start_date)
  // console.log(game.end_date)
  // console.log(game.thumbnail)
  // console.log(game.description)
  const embeds = format_message(game)
  // console.log(message)
  const data = JSON.stringify({ embeds });
  const config = {
    method: "POST",
    url: webhook,
    headers: { "Content-Type": "application/json" },
    data: data,
  };
  // console.log(config)
  axios(config)
  // .then((response) => {
  //   console.log("Webhook delivered successfully");
  //   return response;
  // })
  // .catch((error) => {
  //   console.log(error);
  //   return error;
  // });
}

// const fetch_games = await check_store()
// fetch_games.forEach((game) => {
//   send_discord(game)
// })

// MANUAL
console.log('TEST: Checking Epic Games Store for Freebies :) ...');
check_store().then(games => {
  games.forEach((game) => {
    var webhooks = discord_webhook.split(",")
    webhooks.forEach((webhook) => {
      if(notify){
        send_discord(game, webhook)
      }
    })
  })
})
