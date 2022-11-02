const axios = require('axios')

const getWeatherInfo = async (city) => {
    let paramss = {
        location: city,
        key: 'b039d29332b3477c84c6131e424510ec',
    }
    const Id = await axios.get('https://geoapi.qweather.com/v2/city/lookup?', { params: paramss })
    if (Id.status !== 200) {
        console.log('获取城市id失败')
    }
    const cityId = Id.data.location.filter((item) => {
        return item.name === paramss.location
    })
    let ids = cityId[0].id
    // 获取城市天气信息
    const weatherInfo = await axios.get('https://devapi.qweather.com/v7/weather/now', {
        params: { key: paramss.key, location: ids },
    })
    if (weatherInfo.status !== 200) {
        console.log('获取天气信息失败')
    }
    let info = weatherInfo.data.now
    // 获取生活运动指数
    const sportIndex = await axios.get('https://devapi.qweather.com/v7/indices/1d', {
        params: { key: paramss.key, location: ids, type: 1 },
    })
    if (sportIndex.status !== 200) {
        console.log('获取运动指数失败')
    }
    let sportText = sportIndex.data.daily[0].text
    let status = sportIndex.status
    return { info: info, sportText: sportText, status: status }
}

module.exports = { getWeatherInfo }