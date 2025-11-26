let axios;
if(!axios) axios = require("axios");

module.exports = {
    platform: "Netease",
    author: "fuwutx",
    version: "0.1.5",
    appVersion: ">0.0.0",
    cacheControl: "no-store",
    primaryKey: ["id"],
    srcUrl: "https://yilong.eu.org/api/musicfree_plugin/netease_toubiec.js",
    hints: {
        importMusicSheet: [
            "请输入id或url"
        ],
    },
    userVariables: [],
    supportedSearchType: [],
    base: "https://wyapi-2.toubiec.cn/api",
    // async search(query, page, type) {
    //     // 搜索的具体逻辑
    // },
    // 获取音乐的真实 url
    async getMediaSource(mediaItem, quality) {
        let level = "standard";
        switch (quality) {
            case "high":
                level = "exhigh";
                break;
            case "super":
                level = "lossless";
                break;
            default:
                level = "standard";
        }
        const res = await axios(this.base + "/music/url", {
            method: "POST",
            data: {
                id: mediaItem.id,
                level
            }
        })
        return { url: res.data.data[0].url };
    },
    // 获取音乐详情
    async getMusicInfo(musicItem) {
        const res = await axios(this.base + "/music/detail", {
            method: "POST",
            data: {
                id: musicItem.id.toString(),
            }
        })
        const data = res.data.data;
        this.song = {
            platform: "Netease",
            id: data.id,
            title: data.name,
            artist: data.singer,
            artwork: data.picimg,
            album: data.album,
        };
        return this.song;
    },
    // 获取歌词
    async getLyric(musicItem) {
        const res = await axios(this.base + "/music/lyric", {
            method: "POST",
            data: {
                id: musicItem.id.toString(),
            }
        })
        const data = res.data.data;
        return {
            rawLrc: data.lrc,
            translation: data.tlyric ? data.tlyric : null,
        }
    },
    // 获取专辑详情
    // async getAlbumInfo(albumItem, page) {
    //     // ...
    // },
    // // 获取歌单详情
    // async getMusicSheetInfo(sheetItem, page) {
    //     // ...
    // },
    // // 获取作者作品
    // async getArtistWorks(artistItem, page, type) {
    //     // ...
    // },
    // 导入单曲
    // async importMusicItem(urlLike) {
    //     // ...
    // },
    // 导入歌单
    // async importMusicSheet(urlLike) {
    //     // ...
    // },
    // 获取榜单列表
    async getTopLists() {
        return [
            {
                title: "我的",
                data: [
                    {
                        id: "9493075761",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "喜欢",
                    },
                    {
                        id: "12610418982",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "推荐",
                    },
                ],
            },
            {
                title: "榜单",
                data: [
                    {
                        id: "5059644681",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐日语榜",
                    },
                    {
                        id: "745956260",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "云音乐韩语榜",
                    },
                ],
            },
            {
                title: "雷达",
                data: [
                    {
                        id: "3136952023",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "私人雷达",
                    },
                    {
                        id: "2829896389",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "日系私人雷达",
                    },
                    {
                        id: "2829920189",
                        description: "新歌榜的描述",
                        coverImg: "新歌榜的封面",
                        title: "韩系私人雷达",
                    },
                ],
            },
        ];
    },
    // 获取榜单详情
    async getTopListDetail(topListItem, page) {
        const res = await axios(this.base + "/music/playlist", {
            method: "POST",
            data: {
                id: topListItem.id,
            }
        })
        const data = res.data.data.tracks;
        return {
            musicList: data.map(item => {
                return {
                    platform: "Netease",
                    id: item.id,
                    artists: item.artists,
                    title: item.name,
                    album: item.album,
                    artwork: item.picUrl
                };
            }),
        }
    },
    // // 获取推荐歌单 tag
    // async getRecommendSheetTags() {
    //     // ...
    // },
    // // 获取某个 tag 下的所有歌单
    // async getRecommendSheetsByTag(tag, page) {
    //     // ...
    // },
}
